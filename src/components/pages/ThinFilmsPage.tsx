import React, { useState, useEffect } from 'react';
import { ScrollAnimation } from '../ScrollAnimation';
import { ProjectCard } from '../ProjectCard';
import { supabase } from '@/lib/supabaseClient';
import merge from 'lodash/merge'; // 1. merge 임포트
import { ImageCarousel } from '../ImageCarousel'; // 2. 캐러셀 컴포넌트 import

// --- ⬇️ 3. interface 수정 ⬇️ ---
interface PageContent {
  title: string;
  subtitle: string;
  main_paragraph_1: string;
  main_paragraph_2: string;
  // main_image_url: string; // ⬅️ 삭제
  gallery_images: { url: string, alt?: string }[]; // ⬅️ 추가
  projects_title: string;
  projects_subtitle: string;
  projects: any[];
}

// 4. 기본값 객체 생성
const defaultContent: Partial<PageContent> = {
  title: "Thin Films Research",
  subtitle: "Default subtitle if not loaded.",
  gallery_images: [], // ⬅️ 수정
  projects_title: "Current Projects",
  projects_subtitle: "Our ongoing research projects.",
  projects: []
};

export function ThinFilmsPage() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      const pageKey = 'research-films'; // 페이지 키
      
      const { data, error } = await supabase
        .from('pages')
        .select('content')
        .eq('page_key', pageKey)
        .single();

      if (data?.content) {
        // 5. DB 데이터와 기본값을 병합하여 content가 항상 완전하도록 보장
        const mergedContent = merge({}, defaultContent, data.content);
        setContent(mergedContent as PageContent);
      } else {
        console.error('Failed to fetch page content:', error);
        setContent(defaultContent as PageContent); // 에러 시 기본값 사용
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
          {/* --- ⬇️ 6. <img>를 <ImageCarousel>로 교체 ⬇️ --- */}
          <div className="w-full order-1 md:order-2">
            <ImageCarousel images={content.gallery_images || []} />
          </div>
          {/* --- ⬆️ 교체 완료 ⬆️ --- */}
        </section>
      </ScrollAnimation>

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