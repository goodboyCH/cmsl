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
    <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12 space-y-20">
      <ScrollAnimation>
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">{content.title}</h1>
            <p className="text-xl text-muted-foreground">{content.subtitle}</p>
            <div className="text-base text-foreground/80 space-y-4 leading-relaxed">
              <p>{content.main_paragraph_1}</p>
              <p>{content.main_paragraph_2}</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden elegant-shadow aspect-video">
            <img 
              src={content.main_image_url} 
              alt="Biodegradable Medical Stent" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      </ScrollAnimation>
      <ScrollAnimation delay={200}>
        <section className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary">{content.projects_title}</h2>
            <p className="text-lg text-muted-foreground mt-2">{content.projects_subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id}
                title={project.title}
                description={project.description}
                tags={project.tags || []}
                status={project.status as 'Active' | 'Completed'}
              />
            ))}
          </div>
        </section>
      </ScrollAnimation>
    </div>
  );
}