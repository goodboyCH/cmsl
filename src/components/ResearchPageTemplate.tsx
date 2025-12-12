import React, { useState, useEffect } from 'react';
import { ScrollAnimation } from './ScrollAnimation';
import { supabase } from '@/lib/supabaseClient';
import merge from 'lodash/merge';
import { ImageCarousel } from './ImageCarousel';
import { useLanguage } from '@/components/LanguageProvider';
import { BookOpen, Users, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface ResearchPageContent {
    title: string; title_ko?: string;
    subtitle: string; subtitle_ko?: string;
    main_paragraph_1: string; main_paragraph_1_ko?: string;
    main_paragraph_2: string; main_paragraph_2_ko?: string;
    representative_media: { url: string, type: 'image' | 'video', alt?: string, alt_ko?: string };
    gallery_images: { url: string, type: 'image' | 'video', alt?: string, alt_ko?: string }[];
    related_publications_title: string; related_publications_title_ko?: string;
    related_publication_ids: number[]; // IDs of publications to display
}

interface Publication {
    id: number;
    title: string;
    authors: string;
    journal: string | null;
    year: number;
    doi_link: string | null;
    abstract: string | null;
}

interface ResearchPageTemplateProps {
    pageKey: string;
    defaultContent: Partial<ResearchPageContent>;
}

export function ResearchPageTemplate({ pageKey, defaultContent }: ResearchPageTemplateProps) {
    const { language } = useLanguage();
    const [content, setContent] = useState<ResearchPageContent | null>(null);
    const [publications, setPublications] = useState<Publication[]>([]); // Filtered publications
    const [loading, setLoading] = useState(true);

    // Helper to get content based on language
    const getContent = (data: any, field: string) => {
        if (!data) return '';
        if (language === 'ko' && data[`${field}_ko`]) {
            return data[`${field}_ko`];
        }
        // Fallback to English/Default
        return data[field] || '';
    };

    const renderParagraph = (text: string) => {
        if (!text) return null;
        const paragraphs = text.split('\n').filter(p => p.trim() !== '');
        return (
            <div className="space-y-4">
                {paragraphs.map((p, idx) => (
                    <p key={idx} className="leading-relaxed text-foreground/90 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: p }} />
                ))}
            </div>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // 1. Fetch Page Content
            const { data: pageData, error: pageError } = await supabase
                .from('pages')
                .select('content')
                .eq('page_key', pageKey)
                .single();

            let currentContent: ResearchPageContent;
            if (pageData?.content) {
                currentContent = merge({}, defaultContent, pageData.content) as ResearchPageContent;
            } else {
                console.error(`Failed to fetch ${pageKey} content:`, pageError);
                currentContent = defaultContent as ResearchPageContent;
            }
            setContent(currentContent);

            // 2. Fetch All Publications (Optimization: could be filtered server-side if keyword logic is simple)
            // For now, fetching all and filtering client-side for flexibility with title/abstract matching
            const { data: pubData, error: pubError } = await supabase
                .from('publications')
                .select('id, title, authors, journal, year, doi_link, abstract')
                .order('year', { ascending: false });

            if (pubData) {
                const targetIds = Array.isArray(currentContent.related_publication_ids)
                    ? currentContent.related_publication_ids
                    : [];

                if (targetIds.length > 0) {
                    // Filter by ID
                    const filtered = pubData.filter(pub => targetIds.includes(pub.id));
                    setPublications(filtered);
                } else {
                    setPublications([]);
                }
            } else {
                console.error("Failed to fetch publications:", pubError);
            }

            setLoading(false);
        };
        fetchData();
    }, [pageKey]); // Depend on pageKey to refetch when route changes

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    if (!content) return <div className="text-center p-20">Failed to load content.</div>;

    return (
        <div className="w-full bg-background animate-in fade-in duration-500">
            {/* Hero Section - Centered & Impactful */}
            <div className="relative w-full bg-gradient-to-b from-muted/30 to-background pt-20 pb-16">
                <div className="max-w-[1000px] mx-auto px-6 text-center space-y-6">
                    <ScrollAnimation>
                        <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase border border-primary/20 rounded-full bg-primary/5">
                            Research Area
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
                            {getContent(content, 'title')}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {getContent(content, 'subtitle')}
                        </p>
                    </ScrollAnimation>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 pb-24 space-y-24">

                {/* Representative Media - Large & Cinematic */}
                <ScrollAnimation delay={100}>
                    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                        <div className="aspect-video relative flex items-center justify-center bg-muted/10">
                            {content.representative_media?.url ? (
                                content.representative_media.type === 'video' ? (
                                    <video
                                        src={content.representative_media.url}
                                        className="w-full h-full object-contain"
                                        autoPlay loop muted playsInline
                                    />
                                ) : (
                                    <img
                                        src={content.representative_media.url}
                                        alt={getContent(content.representative_media, 'alt') || "Representative Figure"}
                                        className="w-full h-full object-contain"
                                    />
                                )
                            ) : (
                                <div className="text-muted-foreground flex flex-col items-center gap-2">
                                    <span className="text-sm">No Representative Media</span>
                                </div>
                            )}
                        </div>
                        {content.representative_media?.alt && (
                            <div className="p-4 bg-muted/30 border-t border-border/50 text-center">
                                <p className="text-sm text-muted-foreground font-medium italic">
                                    {getContent(content.representative_media, 'alt')}
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollAnimation>

                {/* Main Article Content - Single Column for Readability */}
                <div className="max-w-3xl mx-auto space-y-12">
                    <ScrollAnimation delay={200}>
                        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 leading-loose">
                            {/* Paragraph 1 */}
                            <div className="first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-[-2px]">
                                {renderParagraph(getContent(content, 'main_paragraph_1'))}
                            </div>

                            {/* Paragraph 2 */}
                            <div className="mt-8">
                                {renderParagraph(getContent(content, 'main_paragraph_2'))}
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>

                {/* Gallery Section - Horizontal Grid/Carousel */}
                {content.gallery_images && content.gallery_images.length > 0 && (
                    <ScrollAnimation delay={300}>
                        <div className="space-y-8 py-12 border-t border-b border-border/50">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-foreground">Research Gallery</h3>
                                <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
                            </div>

                            <div className="rounded-xl overflow-hidden bg-muted/10 p-4 sm:p-6 border border-border/50 shadow-inner">
                                <ImageCarousel
                                    items={content.gallery_images.map(img => ({
                                        ...img,
                                        alt: getContent(img, 'alt')
                                    }))}
                                />
                            </div>
                        </div>
                    </ScrollAnimation>
                )}

                {/* Related Publications - Clean Grid */}
                <ScrollAnimation delay={400}>
                    <section className="space-y-8">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                {getContent(content, 'related_publications_title') || "Related Publications"}
                            </h2>
                            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                                <a href="/publications">View All <ExternalLink className="ml-2 w-4 h-4" /></a>
                            </Button>
                        </div>

                        {publications.length === 0 ? (
                            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border text-muted-foreground">
                                No related publications selected.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {publications.map((pub) => (
                                    <Card key={pub.id} className="group hover:border-primary/50 transition-colors duration-300">
                                        <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide">
                                                    <span>{pub.year}</span>
                                                    <span className="text-muted-foreground/30">•</span>
                                                    <span className="text-muted-foreground line-clamp-1 max-w-[200px]">{pub.journal}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                                                    {pub.title}
                                                </h3>
                                                <div className="text-sm text-muted-foreground line-clamp-1">
                                                    {pub.authors}
                                                </div>
                                            </div>
                                            {pub.doi_link && (
                                                <Button variant="outline" size="sm" asChild className="shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                    <a href={pub.doi_link} target="_blank" rel="noopener noreferrer">
                                                        Read Paper
                                                    </a>
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </ScrollAnimation>

            </div>
        </div>
    );
}
