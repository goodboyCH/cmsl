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
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-16 space-y-20">

                {/* Hero / Header Section */}
                <ScrollAnimation>
                    <div className="space-y-6 md:space-y-8 max-w-5xl">
                        <div className="w-20 h-2 bg-primary mb-6" /> {/* Decorative line */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary tracking-tight leading-[1.1]">
                            {getContent(content, 'title')}
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-3xl">
                            {getContent(content, 'subtitle')}
                        </p>
                    </div>
                </ScrollAnimation>

                <div className="w-full h-px bg-border/50" />

                {/* Main Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    {/* Left Column: Text Content */}
                    <div className="lg:col-span-7 space-y-12">
                        <ScrollAnimation delay={100}>
                            <div className="prose prose-lg dark:prose-invert max-w-none text-justify text-foreground/80">
                                {/* Main Paragraph 1 */}
                                <div className="mb-8">
                                    {renderParagraph(getContent(content, 'main_paragraph_1'))}
                                </div>
                                {/* Main Paragraph 2 */}
                                <div>
                                    {renderParagraph(getContent(content, 'main_paragraph_2'))}
                                </div>
                            </div>
                        </ScrollAnimation>
                    </div>

                    {/* Right Column: Visuals & Gallery */}
                    <div className="lg:col-span-5 space-y-12 sticky top-24">
                        <ScrollAnimation delay={200}>
                            {/* Representative Media - Elevated and Boxed */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-8 h-px bg-primary"></span>
                                    Representative Figure
                                </h3>
                                <div className="rounded-2xl overflow-hidden shadow-xl border border-border/50 bg-slate-50/50 dark:bg-zinc-900/50 p-6 md:p-8">
                                    <div className="aspect-[4/3] relative flex items-center justify-center">
                                        {content.representative_media?.url ? (
                                            content.representative_media.type === 'video' ? (
                                                <video
                                                    src={content.representative_media.url}
                                                    className="w-full h-full object-contain rounded-md shadow-sm"
                                                    autoPlay loop muted playsInline
                                                />
                                            ) : (
                                                <img
                                                    src={content.representative_media.url}
                                                    alt={getContent(content.representative_media, 'alt') || "Representative Figure"}
                                                    className="w-full h-full object-contain rounded-md shadow-sm mix-blend-multiply dark:mix-blend-normal"
                                                />
                                            )
                                        ) : (
                                            <div className="text-muted-foreground text-sm flex flex-col items-center gap-2">
                                                <span>No Representative Media</span>
                                            </div>
                                        )}
                                    </div>
                                    {content.representative_media?.alt && (
                                        <p className="mt-6 text-sm text-center text-muted-foreground font-medium italic border-t border-border/50 pt-4">
                                            {getContent(content.representative_media, 'alt')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Gallery Carousel */}
                            {content.gallery_images && content.gallery_images.length > 0 && (
                                <div className="space-y-4 pt-8 border-t border-border/50">
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-8 h-px bg-primary"></span>
                                        Research Gallery
                                    </h3>
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-border/50">
                                        <ImageCarousel
                                            items={content.gallery_images.map(img => ({
                                                ...img,
                                                alt: getContent(img, 'alt')
                                            }))}
                                        />
                                    </div>
                                </div>
                            )}
                        </ScrollAnimation>
                    </div>
                </div>

                <div className="w-full h-px bg-border/50" />

                {/* Related Publications Section */}
                <ScrollAnimation delay={300}>
                    <section className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                                {getContent(content, 'related_publications_title') || "Related Publications"}
                            </h2>
                            <p className="text-muted-foreground">
                                Selected works related to {getContent(content, 'title')}.
                            </p>
                        </div>

                        {publications.length === 0 ? (
                            <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border text-muted-foreground">
                                No related publications selected.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {publications.map((pub) => (
                                    <Card key={pub.id} className="elegant-shadow hover:shadow-lg transition-shadow duration-300">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                                                <div className="space-y-2 flex-1">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span className="font-semibold text-primary">{pub.year}</span>
                                                        <span>•</span>
                                                        <span className="line-clamp-1">{pub.journal}</span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                                                        {pub.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Users className="w-4 h-4" />
                                                        <span className="line-clamp-1">{pub.authors}</span>
                                                    </div>
                                                </div>
                                                {pub.doi_link && (
                                                    <Button variant="outline" size="sm" asChild className="shrink-0">
                                                        <a href={pub.doi_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                            Read Paper <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
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
