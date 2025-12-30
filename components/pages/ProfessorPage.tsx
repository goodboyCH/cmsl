'use client';

import React, { useState, useEffect } from 'react';
import { ScrollAnimation } from '../ScrollAnimation';
import { Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Badge } from '@/components/ui/badge';

// 페이지 콘텐츠 데이터의 새로운 타입을 정의합니다.
interface ProfessorContent {
  name: string;
  title: string;
  department: string;
  profile_image_url: string;
  contact: {
    phone: string;
    email: string;
    office: string;
  };
  research_interests: string[];
  education: { period: string; description: string }[];
  experience: { period: string; description: string }[];
  awards_and_honors: { period: string; description: string }[];
}

// 이력 목록을 렌더링하는 재사용 가능한 컴포넌트
const ProfileSection = ({ title, items }: { title: string; items: { period: string; description: string }[] }) => (
  <section>
    <h2 className="text-3xl font-bold text-primary border-b-2 border-primary/20 pb-2 mb-6">{title}</h2>
    <div className="space-y-4">
      {(items || []).map((item, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-x-4">
          <p className="md:col-span-1 text-sm text-muted-foreground md:text-right">{item.period}</p>
          <p className="md:col-span-3">{item.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export function ProfessorPage() {
  const [content, setContent] = useState<ProfessorContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data } = await supabase.from('pages').select('content').eq('page_key', 'professor').single();
      if (data?.content) setContent(data.content);
      setLoading(false);
    };
    fetchContent();
  }, []);

  if (loading) return <p className="text-center p-20">Loading Professor's Profile...</p>;
  if (!content) return <p className="text-center p-20">Failed to load content.</p>;

  return (
    // 1. ⬇️ 전체 콘텐츠의 최대 가로 폭을 'max-w-5xl'에서 'max-w-7xl'로 늘립니다. ⬇️
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 상단 프로필 섹션 */}
      <ScrollAnimation>
        {/* 'items-center'를 'items-start'로 변경하여 상단 정렬 */}
        <section className="flex flex-col md:flex-row items-start gap-12 md:gap-16">
          {/* 2. ⬇️ 이미지 크기를 'w-56 h-72'에서 'w-64 h-80'로 키웁니다. ⬇️ */}
          <img 
            src={content.profile_image_url} 
            alt={content.name} 
            className="w-96 h-[32rem] object-cover rounded-lg shadow-md flex-shrink-0 border border-border"
          />
          {/* 3. 텍스트 영역은 'flex-1'으로 설정되어, 늘어난 가로 폭을 자동으로 채웁니다. */}
          <div className="flex-1 space-y-4 w-full">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white pt-2">{content.name}</h1>
            <p className="text-xl font-medium text-primary">{content.title}</p>
            <p className="text-muted-foreground">{content.department}</p>
            <div className="border-t pt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground"><Phone className="h-4 w-4 text-primary" /><span>{content.contact.phone}</span></div>
              <div className="flex items-center gap-3 text-muted-foreground"><Mail className="h-4 w-4 text-primary" /><span>{content.contact.email}</span></div>
              <div className="flex items-center gap-3 text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /><span>{content.contact.office}</span></div>
            </div>
            <div className="pt-2">
              <h3 className="font-semibold mb-2">Research Interests</h3>
              <div className="flex flex-wrap gap-2">
                {(content.research_interests || []).map((interest, i) => <Badge key={i} variant="secondary">{interest}</Badge>)}
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* 학력, 경력, 수상내역 섹션 */}
      <ScrollAnimation delay={100}><ProfileSection title="Education" items={content.education || []} /></ScrollAnimation>
      <ScrollAnimation delay={200}><ProfileSection title="Experience" items={content.experience || []} /></ScrollAnimation>
      <ScrollAnimation delay={300}><ProfileSection title="Awards & Honors" items={content.awards_and_honors || []} /></ScrollAnimation>
    </div>
  );
}