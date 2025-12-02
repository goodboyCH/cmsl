"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import merge from 'lodash/merge';

// --- [Components] ---
import SmoothScroll from '@/components/SmoothScroll';
import { Section1_Intro } from './introduction/Section1_Intro';
import { Section2_CoreCapabilites } from './introduction/Section2_CoreCapabilites';
import { Section3_ResearchAreas } from './introduction/Section3_ResearchAreas'; // ⭐️ Supabase 연동
import { Section4_Demo } from './introduction/Section4_Demo';
import { Section5_Impact } from './introduction/Section5_Impact';

// --- [Icons for Static Data] ---
// JSON 데이터에 있는 아이콘들을 임포트합니다.
import { Cpu, Atom, BrainCircuit, Building, Users, Car, Magnet } from 'lucide-react';

// --- 💎 [STATIC DATA] : 제공해주신 JSON 데이터를 기반으로 구성 💎 ---
const STATIC_CONTENT = {
  mission: {
    // 시각적 효과를 위해 긴 문장을 메인으로 사용했습니다.
    korean: "미세조직의 물리로부터 예측가능한 재료설계를 구현한다", 
    english: "Achieving Predictable Materials Design from the Physics of Microstructure", 
  },
  capabilities: [
    {
      icon: <Cpu className="w-10 h-10" />, 
      title: "Multi-scale Phase-Field Modeling",
      description: "페이즈-필드 모델링(PFM)을 활용하여 응고, 결정립 성장, 상 분리 등 복잡한 물리적 현상을 시뮬레이션하고 재료의 최종 물성을 정밀하게 예측합니다."
    },
    {
      icon: <Atom className="w-10 h-10" />,
      title: "CALPHAD Thermodynamics",
      description: "검증된 열역학 데이터베이스와 CALPHAD 방법론을 결합하여 합금 조성을 설계하고 공정을 최적화하며, 재료의 상 안정성을 정밀하게 평가합니다."
    },
    // 그리드 밸런스를 위해 JSON 내 'section2_capabilities'에서 하나를 가져왔습니다.
    {
      icon: <BrainCircuit className="w-10 h-10" />,
      title: "AI Integration",
      description: "머신러닝 기술을 재료 최적화 및 가속화된 신소재 발견에 적용하여, 기존 실험 및 계산 방식의 한계를 뛰어넘는 효율성을 제공합니다."
    }
  ],
  impact: {
    items: [
      { 
        title: "Bridging Science and Industry", 
        description: "심도 있는 물리 기반 모델링과 최신 AI 기술을 융합하여, 기초 과학적 원리 탐구에서부터 산업적 난제 해결에 이르기까지 재료 과학의 새로운 지평을 엽니다." 
      },
      { 
        title: "Fostering Future Leaders", 
        description: "다양한 국책 및 기업 과제 수행을 통해 학생들이 이론과 실제를 겸비한 재료 분야의 전문가로 성장할 수 있도록 지원합니다." 
      },
      // Bento Grid (4칸) 채우기 위한 추가 강조 포인트 (데이터 기반)
      { 
        title: "Industrial Innovation", 
        description: "현대자동차, 포스코 등 글로벌 리더들과의 전략적 파트너십을 통해 기초 연구를 실질적인 산업 혁신으로 전환합니다." 
      },
      { 
        title: "Global Exchange", 
        description: "국내외 학회 및 연구 기관과의 활발한 교류를 통해 연구 성과를 공유하고 차세대 기술 발전을 주도합니다." 
      }
    ],
    logos: [
      { name: "Hyundai Motors", url: "/images/logo_hyundai.png" }, // JSON 경로 반영
      { name: "KISTI", url: "/images/5.jpg" },
      { name: "Samsung", url: "/images/logo_samsung.png" },
      { name: "POSCO", url: "/images/logo_posco.png" },
    ]
  }
};

export function IntroductionPage() {
  // Section 3(Research)는 Supabase에서 가져옵니다.
  const [researchContent, setResearchContent] = useState<any>({ title: "Major Research Areas", items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        setLoading(true);
        // 'introduction' 페이지 데이터를 가져옵니다.
        const { data } = await supabase.from('pages').select('content').eq('page_key', 'introduction').single();
        
        // JSON 구조상 root의 'research' 객체를 가져옵니다.
        if (data?.content?.research) {
          setResearchContent(data.content.research);
        }
      } catch (e) {
        console.error("Failed to fetch research data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, []);

  return (
    <SmoothScroll>
      <main className="bg-black min-h-screen text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
        
        {/* S1: Mission (Static) - 로딩 없이 즉시 렌더링 */}
        <Section1_Intro 
          missionKor={STATIC_CONTENT.mission.korean}
          missionEng={STATIC_CONTENT.mission.english}
        />

        {/* S2: Capabilities (Static) - 아이콘 컴포넌트 포함 */}
        <Section2_CoreCapabilites items={STATIC_CONTENT.capabilities} />

        {/* S3: Research (Dynamic) - Supabase 데이터 연동 */}
        {/* 이 섹션은 Section3_ResearchAreas.tsx 내부의 ICON_MAP을 통해 
            "Car", "Magnet" 등의 문자열 아이콘을 렌더링합니다. */}
        <Section3_ResearchAreas content={researchContent} loading={loading} />

        {/* S4: Demo (Static/Hardcoded Video) */}
        <Section4_Demo />

        {/* S5: Impact (Static) - Bento Grid & Logos */}
        <Section5_Impact 
          items={STATIC_CONTENT.impact.items} 
          logos={STATIC_CONTENT.impact.logos} 
        />

      </main>
    </SmoothScroll>
  );
}