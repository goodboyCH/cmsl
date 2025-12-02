"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Components
import SmoothScroll from '@/components/SmoothScroll';
import { Section1_Intro } from './introduction/Section1_Intro';
import { Section2_CoreCapabilites } from './introduction/Section2_CoreCapabilites';
import { Section3_ResearchAreas } from './introduction/Section3_ResearchAreas';
import { Section4_Demo } from './introduction/Section4_Demo';
import { Section5_Impact } from './introduction/Section5_Impact';

// Icons
import { Cpu, Atom, BrainCircuit } from 'lucide-react';

// Static Data (JSON 반영됨)
const STATIC_CONTENT = {
  mission: {
    korean: "미세조직의 물리로부터 예측가능한 재료설계를 구현한다", 
    english: "Achieving Predictable Materials Design from the Physics of Microstructure", 
  },
  capabilities: [
    {
      icon: <Cpu className="w-10 h-10" />, 
      title: "Multi-scale Phase-Field Modeling",
      description: "페이즈-필드 모델링(PFM)을 활용하여 응고, 결정립 성장, 상 분리 등 복잡한 물리적 현상을 시뮬레이션합니다."
    },
    {
      icon: <Atom className="w-10 h-10" />,
      title: "CALPHAD Thermodynamics",
      description: "검증된 열역학 데이터베이스와 CALPHAD 방법론을 결합하여 합금 조성을 설계하고 공정을 최적화합니다."
    },
    {
      icon: <BrainCircuit className="w-10 h-10" />,
      title: "AI Integration",
      description: "머신러닝 기술을 재료 최적화 및 가속화된 신소재 발견에 적용하여, 연구 효율성을 극대화합니다."
    }
  ],
  impact: {
    items: [
      { title: "Bridging Science and Industry", description: "심도 있는 물리 기반 모델링과 최신 AI 기술을 융합하여 산업적 난제를 해결합니다." },
      { title: "Fostering Future Leaders", description: "국책 및 기업 과제 수행을 통해 학생들이 재료 분야의 전문가로 성장하도록 지원합니다." },
      { title: "Industrial Innovation", description: "현대자동차, 포스코 등 글로벌 리더들과의 파트너십을 통해 산업 혁신을 주도합니다." },
      { title: "Global Exchange", description: "국내외 학회 및 연구 기관과의 교류를 통해 차세대 기술 발전을 선도합니다." }
    ],
    logos: [
      { name: "Hyundai Motors", url: "/images/logo_hyundai.png" },
      { name: "KISTI", url: "/images/5.jpg" },
      { name: "Samsung", url: "/images/logo_samsung.png" },
      { name: "POSCO", url: "/images/logo_posco.png" },
    ]
  }
};

export function IntroductionPage() {
  const [researchContent, setResearchContent] = useState<any>({ title: "Major Research Areas", items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.from('pages').select('content').eq('page_key', 'introduction').single();
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
        <Section1_Intro 
          missionKor={STATIC_CONTENT.mission.korean}
          missionEng={STATIC_CONTENT.mission.english}
        />
        <Section2_CoreCapabilites items={STATIC_CONTENT.capabilities} />
        <Section3_ResearchAreas content={researchContent} loading={loading} />
        <Section4_Demo />
        <Section5_Impact items={STATIC_CONTENT.impact.items} logos={STATIC_CONTENT.impact.logos} />
      </main>
    </SmoothScroll>
  );
}