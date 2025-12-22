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
import { Cpu, Atom, BrainCircuit, Boxes, Network, Zap, Globe, ShieldCheck } from 'lucide-react';

// Static Data (Updated based on Research Proposal)
const STATIC_CONTENT = {
  mission: {
    ko: "물리 법칙과 인공지능의 융합\n예측 가능한 미래 소재를 설계하다", 
    en: "The Perfect Convergence of Physics and AI:\nDesigning Predictable Future Materials", 
  },
  capabilities: [
    {
      icon: <Atom className="w-10 h-10" />, 
      title: "Full-Stack PFM Technology",
      description: {
        // 소스: 7대 핵심 물성 코드 독자 보유, 소재의 탄생부터 죽음까지
        ko: "소재의 탄생(Sintering)부터 소멸(Failure)까지, 전 생애주기를 관통하는 7대 핵심 PFM 원천 코드를 통해 미세조직의 진화를 완벽하게 예측합니다.",
        en: "We predict microstructure evolution perfectly through 7 proprietary Full-Stack PFM codes covering the entire lifecycle from sintering to failure."
      }
    },
    {
      icon: <BrainCircuit className="w-10 h-10" />,
      title: "Neuro-Symbolic AI (PINO)",
      description: {
        // 소스: PINO 기반 초고속 대리 모델, 10,000배 가속
        ko: "물리 법칙의 엄밀함과 AI의 초고속 연산성을 결합한 PINO(Physics-Informed Neural Operator) 기술로 시뮬레이션 속도를 10,000배 이상 가속화합니다.",
        en: "Accelerating simulation speeds by over 10,000x using PINO technology, combining the rigor of physical laws with the ultra-fast computation of AI."
      }
    },
    {
      icon: <Network className="w-10 h-10" />,
      title: "Autonomous Evolution",
      description: {
        // 소스: 자율 보정, Grey-box Evolving Thermodynamics
        ko: "현장 데이터를 실시간으로 흡수하여 물리 엔진이 스스로 오차를 보정하고 진화하는 'Grey-box 자율 진화 열역학' 시스템을 구축합니다.",
        en: "Building a 'Grey-box Evolving Thermodynamics' system where the physics engine autonomously calibrates errors and evolves by absorbing real-time field data."
      }
    },
    {
      icon: <Boxes className="w-10 h-10" />,
      title: "Lab-to-Field Deployment",
      description: {
        // 소스: Portable Palantir, Edge Device 탑재
        ko: "이론적 연구를 넘어, 실제 제조 현장의 엣지 디바이스(Edge Device)에 탑재 가능한 경량화된 'Portable Palantir' 솔루션을 제공합니다.",
        en: "Going beyond theoretical research, we provide 'Portable Palantir' solutions—lightweight models deployable on edge devices in actual manufacturing sites."
      }
    }
  ],
  impact: {
    headerDesc: {
        // 연구계획서: 소재 데이터 주권, Material Metaverse
        ko: "우리는 소재 개발의 패러다임을 '경험'에서 '데이터와 물리'로 전환하며,\n국가 소재 데이터 주권과 글로벌 표준을 확립합니다.",
        en: "We aim to shift the paradigm of material development from 'experience' to 'data & physics',\nestablishing national data sovereignty and global standards."
    },

    items: [
      { 
        title: "Material Metaverse", 
        description: {
          ko: "가상 공간에서의 무한한 실험(Virtual Test)을 통해 물리적 시공간의 제약을 초월하는 'Material Metaverse'를 구현합니다.",
          en: "Realizing a 'Material Metaverse' that transcends physical spatiotemporal limits through infinite virtual testing."
        }
      },
      { 
        title: "Fabless-Foundry Ecosystem", 
        description: {
          ko: "설계(Lab)와 제조(Foundry)를 연결하는 협업 생태계를 조성하여, R&D 효율을 혁신하고 개발 주기를 획기적으로 단축합니다.",
          en: "Creating a collaborative ecosystem linking design (Lab) and manufacturing (Foundry) to innovate R&D efficiency and drastically shorten development cycles."
        }
      },
      { 
        title: "Technological Sovereignty", 
        description: {
          ko: "외산 소프트웨어 의존을 탈피하고, 극한 환경 및 폐쇄망에서도 구동 가능한 독자적인 소재 해석 플랫폼을 제공합니다.",
          en: "Breaking reliance on foreign software by providing an independent material analysis platform capable of operating in extreme environments and closed networks."
        }
      },
      { 
        title: "Zero-Waste R&D", 
        description: {
          ko: "시행착오를 가상 공간으로 대체하여 실험 폐기물을 획기적으로 줄이고, 지속 가능한 친환경 소재 산업의 표준을 제시합니다.",
          en: "Drastically reducing experimental waste by replacing trial-and-error with virtual simulations, setting a standard for sustainable eco-friendly material industries."
        }
      },
      {
        title: "Missing Link Discovery",
        description: {
          ko: "원자 단위(Quantum)와 거시 세계(Continuum)를 잇는 '메조스케일(Meso-scale)'의 난제를 해결하여 재료과학의 끊어진 고리를 연결합니다.",
          en: "Bridging the 'Meso-scale' gap between the atomic (Quantum) and macroscopic (Continuum) worlds to solve the missing link in materials science."
        }
      },
      {
        title: "Global Standardization",
        description: {
          ko: "오픈소스 Physics-ML 프레임워크 배포를 통해 전 세계 연구자들이 활용하는 계산재료과학의 글로벌 허브로 도약합니다.",
          en: "Leaping as a global hub for computational materials science by deploying an open-source Physics-ML framework used by researchers worldwide."
        }
      }
    ],
    logos: [
      { name: "KIST", url: "/images/logo_kist.png" }, // 예시: 연구계획서에 KIST 협력 언급
      { name: "Samsung", url: "/images/logo_samsung.png" },
      { name: "Hyundai", url: "/images/logo_hyundai.png" },
      { name: "NRF", url: "/images/logo_nrf.png" }, // 한국연구재단
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
        
        {/* Section 1: Mission */}
        <Section1_Intro 
          missionKor={STATIC_CONTENT.mission.ko} 
          missionEng={STATIC_CONTENT.mission.en}
        />

        {/* Section 2: Core Capabilities */}
        <Section2_CoreCapabilites 
          items={STATIC_CONTENT.capabilities.map(item => ({
            ...item,
            description: item.description[language] 
          }))} 
        />

        {/* Section 3: Research Areas (Supabase Data) */}
        {/* Supabase 데이터도 연구계획서의 'Multi-physics Integration', 'Acceleration', 'Evolution' 등의 키워드로 업데이트하면 좋습니다. */}
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