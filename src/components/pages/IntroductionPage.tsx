// 1. "use client" 선언
"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Root } from '@bsmnt/scrollytelling';
import merge from 'lodash/merge';

// 2. 새로 추가된 고급 효과 컴포넌트 임포트
// (파일을 만드신 경로에 맞춰 수정해주세요)
import SmoothScroll from '@/components/SmoothScroll'; 
import { LiquidMetalBackground } from '@/components/3d/LiquidMetalBackground';

// 3. 기존 '배우'(섹션) 컴포넌트 임포트 (경로 유지)
import { Section1_Intro } from './introduction/Section1_Intro';
import { Section2_CoreCapabilites } from './introduction/Section2_CoreCapabilites';
import { Section3_ResearchAreas } from './introduction/Section3_ResearchAreas';
import { Section4_Demo } from './introduction/Section4_Demo';
import { Section5_Impact } from './introduction/Section5_Impact';
import { Section6_Partner } from './introduction/Section6_Partner';
import { ScrollyEvents } from './introduction/ScrollyEvents';

// Supabase 데이터 기본 형태
const pageContentDefault: any = {
  mission: { video_url: "", korean_mission: "Loading...", english_mission: "..." },
  capabilities: { title: "Core Capabilities", items: [] },
  research: { title: "Research Areas", items: [] },
  impact: { title: "Our Impact", items: [], logos: [] }
};

export function IntroductionPage() {
  const [content, setContent] = useState<any>(pageContentDefault);
  const [loading, setLoading] = useState(true);

  // 4. Supabase 데이터 로딩
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

  // 5. 렌더링: SmoothScroll -> 3D 배경 -> Scrollytelling 순서
  return (
    <SmoothScroll>
      {/* 전체 컨테이너: 배경색은 3D 배경이 보이도록 투명 혹은 기본값 설정 */}
      <div className="relative min-h-screen bg-background">
        
        {/* [Layer 0] 3D Liquid Metal 배경 (화면 전체 고정) */}
        {/* z-index를 0으로 두어 가장 뒤에 깔리게 합니다. */}
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
           <LiquidMetalBackground />
        </div>

        {/* [Layer 1] 스크롤리텔링 콘텐츠 */}
        {/* z-index를 10으로 두어 배경 위에 올라오게 합니다. */}
        <div className="relative z-10">
          <Root start="top top" end="+=2450%" scrub={1}>
            <div>
              {/* 씬 1 (0.0 ~ 0.5): 배경이 투명해야 3D 금속이 보임 */}
              <Section1_Intro content={content.mission} />

              {/* 여기서부터는 가독성을 위해 배경을 살짝 깔아줍니다.
                 만약 Section5, 6에서도 3D 배경을 다시 보여주고 싶다면 
                 이 div 래퍼를 제거하고 각 Section 컴포넌트 내부에서 배경색을 제어하는 것이 좋습니다.
                 
                 현재 구성: 
                 - Section 2~4: 콘텐츠 집중 (배경 불투명/반투명 권장)
                 - Section 5~6: 다시 3D 배경 느낌을 살리려면 배경 투명화 (Glassmorphism)
              */}
              
              <div className="relative">
                {/* 씬 2 (0.5 ~ 9.5) */}
                {/* Section2, 3은 전체 화면 이미지를 쓰므로 자체 배경이 있음 */}
                <Section2_CoreCapabilites content={content.capabilities} />

                {/* 씬 3 (9.5 ~ 16.5) */}
                <Section3_ResearchAreas content={content.research} />

                {/* 씬 4 (16.5 ~ 18.5) */}
                {/* 비디오 데모 섹션 */}
                <Section4_Demo />

                {/* 이벤트 트리거 (화면엔 안 보임) */}
                <ScrollyEvents />
              </div>

              {/* 씬 5, 6 (18.5 ~ 26.5) */}
              {/* 이 부분은 다시 3D 배경이 은은하게 비치도록 투명한 래퍼를 사용하거나 그냥 배치 */}
              <div>
                <Section5_Impact content={content.impact} />
                <Section6_Partner content={content.impact} />
              </div>

            </div>
          </Root>
        </div>
      </div>
    </SmoothScroll>
  );
}