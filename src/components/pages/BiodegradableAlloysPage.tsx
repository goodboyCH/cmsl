import React, { useState, useEffect } from 'react';
import { ScrollAnimation } from '../ScrollAnimation';
import { ProjectCard } from '../ProjectCard';
import { supabase } from '@/lib/supabaseClient';
import merge from 'lodash/merge'; 
import { ImageCarousel } from '../ImageCarousel'; 

interface PageContent {
  title: string;
  subtitle: string;
  main_paragraph_1: string;
  main_paragraph_2: string;
  // 대표 미디어 (이미지/영상)
  representative_media: { url: string, type: 'image' | 'video', alt?: string };
  // 갤러리 (이미지/영상)
  gallery_images: { url: string, type: 'image' | 'video', alt?: string }[];
  projects_title: string;
  projects_subtitle: string;
  projects: any[];
}

const defaultContent: Partial<PageContent> = {
  title: "Biodegradable Alloys Research",
  subtitle: "Default subtitle if not loaded.",
  representative_media: { url: '', type: 'image' },
  gallery_images: [], 
  projects_title: "Current Projects",
  projects_subtitle: "Our ongoing research projects.",
  projects: []
};

export function BiodegradableAlloysPage() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      const pageKey = 'research-biodegradable'; // 페이지 키
      
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

  if (loading) return <div className="text-center p-20">Loading Page Content...</div>;
  if (!content) return <div className="text-center p-20">Failed to load page content.</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-8 md:py-12 space-y-16 md:space-y-20">
      <ScrollAnimation>
        <section className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6 order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">{content.title}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground">{content.subtitle}</p>
            <div className="text-base text-foreground/80 space-y-4 leading-relaxed">
              <p>{content.main_paragraph_1}</p>
              <p>{content.main_paragraph_2}</p>
            </div>
          </div>
          
          {/* --- Representative Figure/Video Section --- */}
          <div className="w-full order-1 md:order-2 rounded-lg overflow-hidden elegant-shadow aspect-video bg-black flex items-center justify-center">
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
                  alt={content.representative_media.alt || "Representative Research Figure"} 
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="text-muted-foreground flex flex-col items-center">
                 <p>No Media Set</p>
              </div>
            )}
          </div>
          
        </section>
      </ScrollAnimation>

      {/* --- Media Gallery Carousel Section --- */}
      {content.gallery_images && content.gallery_images.length > 0 && (
        <ScrollAnimation delay={100}>
          <section className="space-y-6">
            <h3 className="text-2xl font-bold text-primary text-center">Research Gallery</h3>
            <ImageCarousel items={content.gallery_images} />
          </section>
        </ScrollAnimation>
      )}

      <ScrollAnimation delay={200}>
        <section className="space-y-8 md:space-y-10">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">{content.projects_title}</h2>
            <p className="text-base sm:text-lg text-muted-foreground mt-2">{content.projects_subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {(content.projects || []).map((project, index) => (
              <ProjectCard 
                key={index}
                title={project.title}
                description={project.description}
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