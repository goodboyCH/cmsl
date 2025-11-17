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
      {/* 1. '악보' 길이를 1250% (1250vh)로 수정 */}
      <Root start="top top" end="+=1250%" scrub={1}>
        <div>
          {/* 2. '악보' 시간에 맞춰 '배우'들을 배치 (Padding 없음) */}
          
          {/* 씬 1 (0.0 ~ 0.5) [50vh] */}
          <Section1_Intro content={content.mission} />

          {/* 씬 2 (0.5 ~ 4.5) [400vh] (아이템 4개 * 100vh) */}
          <Section2_CoreCapabilites content={content.capabilities} />

          {/* 씬 3 (4.5 ~ 7.5) [300vh] (아이템 3개 * 100vh) */}
          <Section3_ResearchAreas content={content.research} />

          {/* 씬 4 (7.5 ~ 8.5) [100vh] */}
          <Section4_Demo />

          {/* 씬 5 (이벤트) - 이벤트 시점도 수정 */}
          <ScrollyEvents />

          {/* 씬 6 (8.5 ~ 11.5) [300vh] (아이템 3개 * 100vh) */}
          <Section5_Impact content={content.impact} />
          
          {/* 씬 7 (11.5 ~ 12.5) [100vh] */}
          <Section6_Partner content={content.impact} />
        </div>
      </Root>
      {/* --- ⬆️ 수정된 부분 ⬆️ --- */}
    </div>
  );
}