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
      {/* --- ⬇️ 수정된 부분 ⬇️ --- */}
      {/* 1. '악보'에 Padding(총 25%)이 추가되었으므로 end 값을 1250%로 늘립니다. */}
      <Root start="top top" end="+=1500%" scrub={1}>
        <div>
          {/* 2. '악보' 시간에 맞춰 '배우'들을 배치합니다. */}
          {/* (각 컴포넌트의 startTime, endTime도 수정됩니다) */}
          
          {/* 씬 1 (0% ~ 5%) */}
          <Section1_Intro content={content.mission} />

          {/* (Padding: 5% ~ 10%) */}

          {/* 씬 2 (10% ~ 35%) */}
          <Section2_CoreCapabilites content={content.capabilities} />

          {/* (Padding: 35% ~ 40%) */}

          {/* 씬 3 (40% ~ 70%) */}
          <Section3_ResearchAreas content={content.research} />

          {/* (Padding: 70% ~ 75%) */}

          {/* 씬 4 (75% ~ 85%) */}
          <Section4_Demo />

          {/* 씬 5 (이벤트) - 이벤트 시점도 수정 */}
          <ScrollyEvents />

          {/* (Padding: 85% ~ 90%) */}

          {/* 씬 6 (90% ~ 110%) */}
          <Section5_Impact content={content.impact} />
          
          {/* (Padding: 110% ~ 115%) */}

          {/* 씬 7 (115% ~ 125%) */}
          <Section6_Partner content={content.impact} />
        </div>
      </Root>
      {/* --- ⬆️ 수정된 부분 ⬆️ --- */}
    </div>
  );
}