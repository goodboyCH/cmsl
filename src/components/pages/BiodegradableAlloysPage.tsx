import React, { useState, useEffect } from 'react';
import { ScrollAnimation } from '../ScrollAnimation';
import { ProjectCard } from '../ProjectCard';
import { supabase } from '@/lib/supabaseClient';

interface PageContent {
  title: string;
  subtitle: string;
  main_paragraph_1: string;
  main_paragraph_2: string;
  main_image_url: string;
  projects_title: string;
  projects_subtitle: string;
  projects: any[]; // ⬅️ 이 줄을 추가해야 합니다
}

export function BiodegradableAlloysPage() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      const pageKey = 'research-biodegradable'; // 페이지 키만 변경
      
      const [pageContentData, projectsData] = await Promise.all([
        supabase.from('pages').select('content').eq('page_key', pageKey).single(),
        supabase.from('projects').select('*').eq('page_key', pageKey).order('display_order')
      ]);

      if (pageContentData.data?.content) setContent(pageContentData.data.content);
      if (projectsData.data) setProjects(projectsData.data);
      
      setLoading(false);
    };
    fetchPageData();
  }, []);

  if (loading) return <div className="text-center p-20">Loading Page Content...</div>;
  if (!content) return <div className="text-center p-20">Failed to load page content.</div>;

  return (
    // --- ⬇️ 전체 페이지 여백 및 간격을 반응형으로 수정 ⬇️ ---
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-8 md:py-12 space-y-16 md:space-y-20">
      <ScrollAnimation>
        {/* --- ⬇️ 상단 섹션 레이아웃을 반응형으로 수정 (모바일: 세로, md 이상: 가로) ⬇️ --- */}
        <section className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6 order-2 md:order-1"> {/* 모바일에서 텍스트가 이미지 아래로 오도록 순서 변경 */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">{content.title}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground">{content.subtitle}</p>
            <div className="text-base text-foreground/80 space-y-4 leading-relaxed">
              <p>{content.main_paragraph_1}</p>
              <p>{content.main_paragraph_2}</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden elegant-shadow aspect-video w-full order-1 md:order-2">
            <img 
              src={content.main_image_url} 
              alt="Casting Alloys Simulation" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation delay={200}>
        {/* --- ⬇️ 프로젝트 섹션 간격 및 텍스트를 반응형으로 수정 ⬇️ --- */}
        <section className="space-y-8 md:space-y-10">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">{content.projects_title}</h2>
            <p className="text-base sm:text-lg text-muted-foreground mt-2">{content.projects_subtitle}</p>
          </div>
          {/* --- ⬇️ 프로젝트 카드 그리드 및 간격을 반응형으로 수정 ⬇️ --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {(content.projects || []).map((project, index) => ( // 5. content.projects 사용
              <ProjectCard 
                key={index} // DB id가 없으므로 index 사용
                title={project.title}
                description={project.description}
                tags={project.tags || []}
                status={project.status as 'Active' | 'Completed'}
                // 6. 새 prop 전달
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