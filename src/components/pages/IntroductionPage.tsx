// 1. "use client" 선언 (SSR 충돌 및 JS 오류 해결)
"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Root } from '@bsmnt/scrollytelling';
import merge from 'lodash/merge';

// 2. '배우'(섹션) 컴포넌트들을 임포트합니다.
// (파일 경로는 사용자님의 구조에 맞게 조정합니다)
import { Section1_Intro } from './introduction/Section1_Intro';
import { Section2_CoreCapabilites } from './introduction/Section2_CoreCapabilites';
import { Section3_ResearchAreas } from './introduction/Section3_ResearchAreas';
import { Section4_Demo } from './introduction/Section4_Demo';
import { Section5_Impact } from './introduction/Section5_Impact';
import { Section6_Partner } from './introduction/Section6_Partner';
import { ScrollyEvents } from './introduction/ScrollyEvents';

// Supabase 데이터의 기본 형태 (데이터 로딩 실패 시 사용)
const pageContentDefault: any = {
  mission: { video_url: "", korean_mission: "Loading...", english_mission: "..." },
  capabilities: { title: "Core Capabilities", items: [] },
  research: { title: "Research Areas", items: [] },
  impact: { title: "Our Impact", items: [], logos: [] }
};

export function IntroductionPage() {
  const [content, setContent] = useState<any>(pageContentDefault);
  const [loading, setLoading] = useState(true);

  // 3. Supabase 데이터 로딩
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data } = await supabase.from('pages').select('content').eq('page_key', 'introduction').single();
      setContent(data ? merge({}, pageContentDefault, data.content) : pageContentDefault);
      setLoading(false);
    };
    fetchContent();
  }, []);

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  // 4. '악보' 렌더링
  return (
    <div className="bg-background">
      {/* 5. '악보' 전체를 연주할 마스터 <Root> 무대 */}
      {/* 악보가 100%로 끝나므로, 1000% (화면 10개 분량) 스크롤을 확보합니다.
        이렇게 하면 '악보'의 10% = 타임라인의 0.1 (10%)이 되어 계산이 편합니다.
      */}
      <Root start="top top" end="+=1000%" scrub={1}>
        
        {/* 6. '악보' 순서대로 '배우'(섹션)들을 배치하고 Supabase 데이터 전달 */}

        {/* 씬 1 (0% ~ 5%) */}
        <Section1_Intro content={content.mission} />

        {/* 씬 2 (5% ~ 30%) */}
        <Section2_CoreCapabilites content={content.capabilities} />

        {/* 씬 3 (30% ~ 60%) */}
        <Section3_ResearchAreas content={content.research} />

        {/* 씬 4 (60% ~ 70%) */}
        <Section4_Demo />

        {/* 씬 5 (이벤트) - 악보대로 UI가 없는 이벤트 트리거 */}
        <ScrollyEvents />

        {/* 씬 6 (70% ~ 90%) */}
        <Section5_Impact content={content.impact} />
        
        {/* 씬 7 (90% ~ 100%) */}
        <Section6_Partner content={content.impact} />

      </Root>
    </div>
  );
}