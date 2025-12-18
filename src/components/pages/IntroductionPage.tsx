"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

import { useLanguage } from '@/components/LanguageProvider';
// Components
import SmoothScroll from '@/components/SmoothScroll';
import { Section1_Intro } from './introduction/Section1_Intro';
import { Section2_CoreCapabilites } from './introduction/Section2_CoreCapabilites';
import { Section3_ResearchAreas } from './introduction/Section3_ResearchAreas';
import { Section4_Demo } from './introduction/Section4_Demo';
import { Section5_Impact } from './introduction/Section5_Impact';

// Icons
import { Cpu, Atom, BrainCircuit, Boxes } from 'lucide-react';

// Static Data (JSON 반영됨)
const STATIC_CONTENT = {
  mission: {
    ko: "미세조직의 물리로부터 예측가능한 재료설계를 구현한다", 
    en: "Achieving Predictable Materials Design from the Physics of Microstructure", 
  },
  capabilities: [
    {
      icon: <Cpu className="w-10 h-10" />, 
      title: "Multi-scale Phase-Field Modeling",
      description: {
        ko: "페이즈-필드 모델링(PFM)을 활용하여 응고, 결정립 성장, 상 분리 등 복잡한 물리적 현상을 시뮬레이션합니다.",
        en: "Utilizing Phase-Field Modeling (PFM) to simulate complex physical phenomena such as solidification, grain growth, and phase separation."
      }
    },
    {
      icon: <Atom className="w-10 h-10" />,
      title: "CALPHAD Thermodynamics",
      description: {
        ko: "검증된 열역학 데이터베이스와 CALPHAD 방법론을 결합하여 합금 조성을 설계하고 공정을 최적화합니다.",
        en: "Combining verified thermodynamic databases with CALPHAD methodology to design alloy compositions and optimize processes."
      }
    },
    {
      icon: <BrainCircuit className="w-10 h-10" />,
      title: "AI Integration",
      description: {
        ko: "머신러닝 기술을 재료 최적화 및 가속화된 신소재 발견에 적용하여, 연구 효율성을 극대화합니다.",
        en: "Applying machine learning technologies to material optimization and accelerated discovery of new materials, maximizing research efficiency."
      }
    },
    {
      icon: <Boxes className="w-10 h-10" />,
      title: "Material Digital Twin",
      description: {
        ko: "실제 미세조직을 가상 환경에 정밀하게 구현하는 디지털 트윈을 구축하여, 공정 변수에 따른 구조적 진화를 높은 정확도로 예측합니다.",
        en: "Constructing digital twins that precisely replicate actual microstructures in a virtual environment to accurately predict structural evolution based on process variables."
      }
    }
  ],
  impact: {
    headerDesc: {
        ko: "우리의 연구는 실험실을 넘어, 실제 산업과 환경에\n구체적이고 측정 가능한 변화를 만들어냅니다.",
        en: "Our research extends beyond the laboratory,\ncreating tangible and measurable impacts on real-world industries."
    },

    items: [
      { 
        title: "Bridging Science and Industry", 
        description: {
          ko: "심도 있는 물리 기반 모델링과 최신 AI 기술을 융합하여 산업적 난제를 해결합니다.",
          en: "Solving industrial challenges by fusing in-depth physics-based modeling with the latest AI technologies."
        }
      },
      { 
        title: "Fostering Future Leaders", 
        description: {
          ko: "국책 및 기업 과제 수행을 통해 학생들이 재료 분야의 전문가로 성장하도록 지원합니다.",
          en: "Supporting students to grow into experts in the materials field through participation in national and corporate projects."
        }
      },
      { 
        title: "Industrial Innovation", 
        description: {
          ko: "글로벌 선도 기업들과의 긴밀한 파트너십을 통해 실제 산업 현장의 기술 혁신을 주도합니다.",
          en: "Leading technological innovation in the industry through close partnerships with global leading companies."
        }
      },
      { 
        title: "Global Exchange", 
        description: {
          ko: "국내외 유수 학회 및 연구 기관과의 활발한 교류를 통해 차세대 기술 발전을 선도합니다.",
          en: "Leading next-generation technological advancements through active exchanges with domestic and international academic and research institutions."
        }
      },
      {
        title: "Sustainable Solutions",
        description: {
          ko: "에너지 효율적인 공정 설계와 친환경 소재 개발 연구를 통해 탄소 중립 실현에 기여합니다.",
          en: "Contributing to carbon neutrality through research on energy-efficient process design and eco-friendly material development."
        }
      },
      {
        title: "Pioneering Methodology",
        description: {
          ko: "데이터 사이언스와 재료 물리학의 융합을 통해 기존의 한계를 뛰어넘는 새로운 연구 방법론을 제시합니다.",
          en: "Proposing new research methodologies that transcend existing limits by converging data science with materials physics."
        }
      }
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
  const { language } = useLanguage();

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
        
        {/* Section 1: 미션 텍스트도 언어에 따라 변경 */}
        <Section1_Intro 
          missionKor={STATIC_CONTENT.mission.ko} 
          missionEng={STATIC_CONTENT.mission.en}
          // 원하신다면 Section1 내부 코드를 수정해서 language 값에 따라 하나만 보여주거나,
          // 지금처럼 둘 다 넘겨주고 Section1에서 연출할 수도 있습니다.
          // (현재 코드는 두 언어 모두 넘겨주고 애니메이션 효과로 보여주는 구조라 유지합니다)
        />

        {/* Section 2: Core Capabilities */}
        <Section2_CoreCapabilites 
          items={STATIC_CONTENT.capabilities.map(item => ({
            ...item,
            // ✅ [핵심] 현재 언어(language) 키값('en' 또는 'ko')에 맞는 텍스트 선택
            description: item.description[language] 
          }))} 
        />

        <Section3_ResearchAreas content={researchContent} loading={loading} />
        <Section4_Demo />

        {/* Section 5: Impact */}
        <Section5_Impact 
          description={STATIC_CONTENT.impact.headerDesc[language]} 
          items={STATIC_CONTENT.impact.items.map(item => ({
             ...item,
             description: item.description[language]
          }))}
          logos={STATIC_CONTENT.impact.logos} 
        />
      </main>
    </SmoothScroll>
  );
}