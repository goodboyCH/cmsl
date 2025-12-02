"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import merge from 'lodash/merge';

// 1. 고급 스크롤
import SmoothScroll from '@/components/SmoothScroll';

// 2. 섹션 컴포넌트들
import { Section1_Intro } from './introduction/Section1_Intro';
import { Section2_CoreCapabilites } from './introduction/Section2_CoreCapabilites';
import { Section3_ResearchAreas } from './introduction/Section3_ResearchAreas';
import { Section4_Demo } from './introduction/Section4_Demo';
import { Section5_Impact } from './introduction/Section5_Impact';
// Section 6는 Impact 섹션 하단에 통합하는 것이 디자인적으로 깔끔하여 제거하거나 합칩니다.

// 기본 데이터
const pageContentDefault: any = {
  mission: { korean_mission: "Loading...", english_mission: "Initializing..." },
  capabilities: { title: "Core Capabilities", items: [] },
  research: { title: "Research Areas", items: [] },
  impact: { title: "Our Impact", items: [], logos: [] }
};

export function IntroductionPage() {
  const [content, setContent] = useState<any>(pageContentDefault);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data } = await supabase.from('pages').select('content').eq('page_key', 'introduction').single();
      setContent(data ? merge({}, pageContentDefault, data.content) : pageContentDefault);
      setLoading(false);
    };
    fetchContent();
  }, []);

  if (loading) return <div className="bg-black h-screen w-screen flex items-center justify-center text-cyan-500 font-mono">SYSTEM BOOTING...</div>;

  return (
    <SmoothScroll>
      <main className="bg-black min-h-screen text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
        
        {/* SECTION 1: 압도적 시작 (파티클 + 물리 엔진) */}
        <Section1_Intro content={content.mission} />

        {/* SECTION 2: 탐색 (스포트라이트 카드) */}
        <Section2_CoreCapabilites content={content.capabilities} />

        {/* SECTION 3: 연구 (글리치 이미지 + 윈도우 레이아웃) */}
        <Section3_ResearchAreas content={content.research} />

        {/* SECTION 4: 데모 (유일한 스크롤리텔링 유지 - 기술력 과시용) */}
        <Section4_Demo />

        {/* SECTION 5 & Partners: 임팩트 (Bento Grid) */}
        <Section5_Impact content={content.impact} />

      </main>
    </SmoothScroll>
  );
}