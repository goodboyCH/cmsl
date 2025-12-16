import React, { useState, useEffect } from 'react';
import { ScrollAnimation } from './ScrollAnimation';
import { supabase } from '@/lib/supabaseClient';
import merge from 'lodash/merge';
import { ImageCarousel } from './ImageCarousel';
import { useLanguage } from '@/components/LanguageProvider';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// 🆕 변경된 데이터 구조 인터페이스
export interface ResearchSection {
    heading: string; heading_ko?: string;
    content: string; content_ko?: string;
    images: { url: string; type: 'image' | 'video'; alt?: string; alt_ko?: string }[];
}

export interface ResearchPageContent {
    title: string; title_ko?: string;
    subtitle: string; subtitle_ko?: string;
    representative_media: { url: string, type: 'image' | 'video', alt?: string, alt_ko?: string };
    
    // 🆕 기존 paragraph_1, 2 대신 섹션 배열 사용
    research_sections: ResearchSection[];

    related_publications_title: string; related_publications_title_ko?: string;
    related_publication_ids: number[];
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
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);

    const getContent = (data: any, field: string) => {
        if (!data) return '';
        if (language === 'ko' && data[`${field}_ko`]) {
            return data[`${field}_ko`];
        }
        return data[field] || '';
    };

    // 텍스트 렌더링 (줄바꿈 처리)
    const renderText = (text: string, className: string = "") => {
        if (!text) return null;
        return text.split('\n').map((line, i) => (
            <p key={i} className={`whitespace-pre-wrap mb-4 ${className}`} dangerouslySetInnerHTML={{ __html: line }} />
        ));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: pageData } = await supabase.from('pages').select('content').eq('page_key', pageKey).single();
            const { data: pubData } = await supabase.from('publications').select('*').order('year', { ascending: false });

            let currentContent: ResearchPageContent;
            if (pageData?.content) {
                // 기존 데이터와의 호환성을 위해 merge 사용 시 주의 필요하지만, 구조가 바뀌었으므로 초기화 로직 강화
                currentContent = merge({}, defaultContent, pageData.content) as ResearchPageContent;
                
                // 구형 데이터 호환성 체크 (혹시 research_sections가 없을 경우 빈 배열 할당)
                if (!currentContent.research_sections) {
                    currentContent.research_sections = [];
                }
            } else {
                currentContent = defaultContent as ResearchPageContent;
            }
            setContent(currentContent);

            if (pubData && currentContent.related_publication_ids?.length > 0) {
                setPublications(pubData.filter(pub => currentContent.related_publication_ids.includes(pub.id)));
            } else {
                setPublications([]);
            }
            setLoading(false);
        };
        fetchData();
    }, [pageKey]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    if (!content) return <div className="text-center p-20">Failed to load content.</div>;

    return (
        <div className="w-full bg-background animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative w-full bg-gradient-to-b from-muted/30 to-background pt-24 pb-20">
                <div className="max-w-[1000px] mx-auto px-6 text-center space-y-6">
                    <ScrollAnimation>
                        <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase border border-primary/20 rounded-full bg-primary/5">
                            Research Area
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
                            {getContent(content, 'title')}
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {getContent(content, 'subtitle')}
                        </p>
                    </ScrollAnimation>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 pb-24 space-y-24">

                {/* Representative Media */}
                <ScrollAnimation delay={100}>
                    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                        <div className="aspect-video relative flex items-center justify-center bg-muted/10">
                            {content.representative_media?.url ? (
                                content.representative_media.type === 'video' ? (
                                    <video src={content.representative_media.url} className="w-full h-full object-contain" autoPlay loop muted playsInline />
                                ) : (
                                    <img src={content.representative_media.url} alt={getContent(content.representative_media, 'alt')} className="w-full h-full object-contain" />
                                )
                            ) : (
                                <span className="text-muted-foreground">No Representative Media</span>
                            )}
                        </div>
                    </div>
                </ScrollAnimation>

                {/* 🆕 Dynamic Research Sections (Title > Content > Carousel) */}
                <div className="space-y-20">
                    {content.research_sections?.map((section, index) => (
                        <ScrollAnimation key={index} delay={100}>
                            <section className="space-y-8 border-b border-border/40 pb-16 last:border-0 last:pb-0">
                                
                                {/* 1. 소제목 (크게, 볼드) */}
                                <div className="space-y-4">
                                    <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight border-l-4 border-primary pl-4">
                                        {getContent(section, 'heading')}
                                    </h2>
                                </div>

                                {/* 2. 본문 (텍스트 사이즈 키움) */}
                                <div className="prose prose-xl dark:prose-invert max-w-none text-foreground/80 leading-loose">
                                    {renderText(getContent(section, 'content'), "text-lg md:text-xl")}
                                </div>

                                {/* 3. 해당 섹션의 캐러셀 */}
                                {section.images && section.images.length > 0 && (
                                    <div className="rounded-xl overflow-hidden bg-muted/10 p-4 sm:p-6 border border-border/50 shadow-inner mt-8">
                                        <ImageCarousel
                                            items={section.images.map(img => ({
                                                ...img,
                                                alt: getContent(img, 'alt')
                                            }))}
                                        />
                                    </div>
                                )}
                            </section>
                        </ScrollAnimation>
                    ))}
                </div>

                {/* Related Publications (Unchanged) */}
                <ScrollAnimation delay={200}>
                    <section className="space-y-8 pt-10 border-t border-border">
                        <div className="flex items-center justify-between pb-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                {getContent(content, 'related_publications_title') || "Related Publications"}
                            </h2>
                            <Button variant="ghost" size="sm" asChild>
                                <a href="/publications">View All <ExternalLink className="ml-2 w-4 h-4" /></a>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {publications.map((pub) => (
                                <Card key={pub.id} className="group hover:border-primary/50 transition-colors duration-300">
                                    <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide">
                                                <span>{pub.year}</span>
                                                <span className="text-muted-foreground/30">•</span>
                                                <span className="text-muted-foreground line-clamp-1">{pub.journal}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                                                {pub.title}
                                            </h3>
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                {pub.authors}
                                            </div>
                                        </div>
                                        {pub.doi_link && (
                                            <Button variant="outline" size="sm" asChild className="shrink-0">
                                                <a href={pub.doi_link} target="_blank" rel="noopener noreferrer">Read Paper</a>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </ScrollAnimation>

            </div>
        </div>
    );
}