import React, { useState, useEffect } from 'react';
import { ScrollAnimation } from '../ScrollAnimation';
import { ProjectCard } from '../ProjectCard';
import { supabase } from '@/lib/supabaseClient';
import merge from 'lodash/merge';
import { ImageCarousel } from '../ImageCarousel';
import { useLanguage } from '@/components/LanguageProvider'; // 1. Import

// 2. Interface 수정 (ko 필드 추가)
interface PageContent {
  title: string; title_ko?: string;
  subtitle: string; subtitle_ko?: string;
  main_paragraph_1: string; main_paragraph_1_ko?: string;
  main_paragraph_2: string; main_paragraph_2_ko?: string;
  representative_media: { url: string, type: 'image' | 'video', alt?: string };
  gallery_images: { url: string, type: 'image' | 'video', alt?: string }[];
  projects_title: string; projects_title_ko?: string;
  projects_subtitle: string; projects_subtitle_ko?: string;
  projects: any[];
}

const defaultContent: Partial<PageContent> = {
  title: "Thin Films Research",
  subtitle: "Default subtitle if not loaded.",
  representative_media: { url: '', type: 'image' },
  gallery_images: [], 
  projects_title: "Current Projects",
  projects_subtitle: "Our ongoing research projects.",
  projects: []
};

export function ThinFilmsPage() {
  const { language } = useLanguage(); // 3. useLanguage
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  // 4. getContent 헬퍼
  const getContent = (data: any, field: string) => {
    if (!data) return '';
    if (language === 'ko' && data[`${field}_ko`]) {
      return data[`${field}_ko`];
    }
    return data[field] || '';
  };

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      const pageKey = 'research-films'; // ✨ Key 확인
      
      const { data, error } = await supabase
        .from('pages')
        .select('content')
        .eq('page_key', pageKey)
        .single();

      if (data?.content) {
        const mergedContent = merge({}, defaultContent, data.content);
        setContent(mergedContent as PageContent);
      } else {
        console.error('Failed to fetch page content:', error);
        setContent(defaultContent as PageContent);
      }
      
      setLoading(false);
    };
    fetchPageData();
  }, []);

  if (loading) return <div className="text-center p-20">Loading...</div>;
  if (!content) return <div className="text-center p-20">Failed to load content.</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-12 space-y-16">
      
      <ScrollAnimation>
        <div className="space-y-10">
          <div className="max-w-4xl">
            {/* 5. 타이틀 적용 */}
            <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight mb-4">
              {getContent(content, 'title')}
            </h1>
            <p className="text-xl text-muted-foreground font-medium border-l-4 border-primary pl-4">
              {getContent(content, 'subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* 5. 본문 적용 */}
            <div className="lg:col-span-6 space-y-6 text-base lg:text-lg text-foreground/80 leading-relaxed text-justify">
              <p>{getContent(content, 'main_paragraph_1')}</p>
              <p>{getContent(content, 'main_paragraph_2')}</p>
            </div>
            
            <div className="lg:col-span-6 space-y-8">
              <div>
                <div className="rounded-xl overflow-hidden elegant-shadow aspect-video bg-white border flex items-center justify-center">
                  {content.representative_media?.url ? (
                    content.representative_media.type === 'video' ? (
                      <video 
                        src={content.representative_media.url}
                        className="w-full h-full object-contain bg-white"
                        autoPlay loop muted playsInline
                      />
                    ) : (
                      <img 
                        src={content.representative_media.url} 
                        alt="Representative Figure" 
                        className="w-full h-full object-contain"
                      />
                    )
                  ) : (
                    <div className="text-muted-foreground text-sm">No Representative Media</div>
                  )}
                </div>
                {content.representative_media?.alt && (
                  <p className="mt-2 text-sm text-muted-foreground text-center italic">
                    {/* alt 대신 getContent 사용 */}
                    {getContent(content.representative_media, 'alt')}
                  </p>
                )}
              </div>

              {content.gallery_images && content.gallery_images.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">Gallery</h4>
                  <ImageCarousel 
                    items={content.gallery_images.map(img => ({
                      ...img,
                      alt: getContent(img, 'alt') // alt 값을 현재 언어에 맞게 덮어씌워서 전달
                    }))} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollAnimation>

      <div className="w-full h-px bg-border" />

      <ScrollAnimation delay={200}>
        <section className="space-y-10">
          <div className="flex flex-col items-start gap-2">
            {/* 5. 섹션 제목 적용 */}
            <h2 className="text-3xl font-bold text-primary">{getContent(content, 'projects_title')}</h2>
            <p className="text-lg text-muted-foreground">{getContent(content, 'projects_subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(content.projects || []).map((project, index) => (
              <ProjectCard 
                key={index}
                // 6. 프로젝트 내용 적용
                title={getContent(project, 'title')}
                description={getContent(project, 'description')}
                tags={project.tags || []}
                status={project.status as 'Active' | 'Completed'}
                logo_url={project.logo_url}
                person_in_charge={project.person_in_charge}
              />
            ))}
          </div>
        </section>
      </ScrollAnimation>
    </div>
  );
}