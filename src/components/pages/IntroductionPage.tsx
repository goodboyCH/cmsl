import React, { useRef, useState, useEffect } from 'react'; // 1. useState, useEffect 추가
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollingFocusSection } from '@/components/ScrollingFocusSection'; 
import { Cpu, Atom, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; // 2. Supabase 클라이언트 import

// 3. 기존 하드코딩 데이터를 '기본값' 또는 '폴백' 용도로 변경
const pageContentDefault = {
  mission: {
    video_url: "/videos/bg.mp4",
    korean_mission: "CMSL",
    english_mission: "Achieving Predictable Materials Design from the Physics of Microstructure"
  },
  capabilities: {
    title: "Our Core Capabilities",
    items: [
      { icon: Cpu, title: "Multi-scale Phase-Field Modeling", description: "다중 스케일에서 미세조직의 상변태 및 동적 거동을 정밀하게 예측하여, NdFeB 자성재료, Al-Si 합금 등 다양한 소재의 특성을 제어합니다." },
      { icon: BrainCircuit, title: "AI-driven Active Learning", description: "KISTI 슈퍼컴퓨터를 활용한 대규모 시뮬레이션과 AI 액티브 러닝을 통해, 실험적 한계를 뛰어넘는 새로운 재료 물성 및 Landau 계수를 효율적으로 탐색합니다." },
      { icon: TestTube2, title: "Electrochemical Potential Mapping", description: "부식 현상 예측을 위해 Mg-Ca, Silafont 합금 등의 전기화학적 전위 분포를 분석하고, KPFM 측정 데이터와 비교하여 모델의 정확도를 검증합니다." },
      { icon: Atom, title: "Thermodynamic & Kinetic Analysis", description: "계면 에너지 이방성(Anisotropy), Jackson-Hunt 이론 등 재료의 열역학 및 반응속도론적 원리를 깊이 있게 탐구하여 시뮬레이션의 물리적 기반을 다집니다." }
    ]
  },
  research: {
    title: "Major Research Areas",
    items: [
      { icon: Car, title: "Advanced Automotive Alloys", description: "현대자동차와 협력하여 Al-Fe-Mn-Si 합금의 응고 거동을 시뮬레이션하고, 고강도 경량 차체 및 부품 소재 개발에 기여합니다.", imageUrl: "/images/research-auto.jpg" },
      { icon: Magnet, title: "Next-Gen Magnetic Materials", description: "NdFeB 스트립 캐스팅 공정 시뮬레이션을 통해 차세대 고성능 영구자석의 미세조직 제어 기술을 확보하고, 전기차 모터 및 풍력 발전기 효율 향상에 기여합니다.", imageUrl: "/images/research-magnet.jpg" },
      { icon: Film, title: "Functional HZO Thin Films", description: "반강자성(AFE) 특성을 지닌 HZO 박막을 모델링하여, 차세대 메모리 소자 및 센서에 적용 가능한 신소재 개발의 이론적 기반을 제공합니다.", imageUrl: "/images/research-film.jpg" },
      { icon: HeartPulse, title: "Biomedical & Lightweight Alloys", description: "Mg-Ca 합금의 부식 메커니즘을 분석하여 체내에서 안전하게 분해되는 생분해성 임플란트 및 초경량 항공우주 부품 소재를 설계합니다.", imageUrl: "/images/research-bio.jpg" }
    ]
  },
  impact: {
    title: "Our Impact",
    items: [
        { icon: Building, title: "Bridging Science and Industry", description: "저희 연구실은 심도 있는 물리 기반 모델링과 최신 AI 기술을 융합하여, 기초 과학적 원리 탐구에서부터 산업적 난제 해결에 이르기까지 재료 과학의 새로운 지평을 열어가고 있습니다." },
        { icon: Users, title: "Fostering Future Leaders", description: "다양한 국책 및 기업 과제 수행을 통해 학생들이 이론과 실제를 겸비한 재료 분야의 전문가로 성장할 수 있도록 지원하며, 국내외 학회에서 연구 성과를 활발히 교류합니다." }
    ],
    logos: [
      { name: "Hyundai Motors", url: "/images/hyundai-logo.png" },
      { name: "KISTI", url: "/images/kisti-logo.png" },
    ]
  }
};

export function IntroductionPage() {
  // --- ⬇️ 4. Supabase 데이터를 담을 state와 로딩 state 추가 ⬇️ ---
  const [content, setContent] = useState<any>(pageContentDefault);
  const [loading, setLoading] = useState(true);

  // --- ⬇️ 5. Supabase에서 데이터를 가져오는 useEffect 추가 ⬇️ ---
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('content')
        .eq('page_key', 'introduction')
        .single();
      
      if (error || !data?.content) {
        console.warn('DB에서 소개 페이지 콘텐츠 로딩 실패. 기본값을 사용합니다.', error);
        // 실패 시 pageContentDefault가 이미 설정되어 있으므로 별도 처리는 불필요
      } else {
        setContent(data.content); // 성공 시 DB에서 가져온 데이터로 state 업데이트
      }
      setLoading(false);
    };
    fetchContent();
  }, []);
  
  const mainContentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: contentScrollProgress } = useScroll({
    target: mainContentRef,
    offset: ['start start', 'end end'] 
  });

  // (useTransform, useScroll 등 나머지 훅은 변경 없음)
  const backgroundColor = useTransform(
    contentScrollProgress,
    [0, 0.25, 0.35, 0.6, 0.7, 1], 
    [
      "hsl(0 0% 100%)",
      "hsl(0 0% 100%)",
      "hsl(221.2 83.2% 95.3%)",
      "hsl(221.2 83.2% 95.3%)",
      "hsl(0 0% 100%)",
      "hsl(0 0% 100%)"
    ]
  );

  const { scrollYProgress: missionProgress } = useScroll({ offset: ['start start', 'end start'] });
  const missionBgScale = useTransform(missionProgress, [0, 1], [1, 1.15]);

  // --- ⬇️ 6. 로딩 중일 때 표시할 화면 ⬇️ ---
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p>Loading Introduction...</p>
      </div>
    );
  }

  // --- ⬇️ 7. 모든 'pageContent' 참조를 'content'로 변경 ⬇️ ---
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <section className="h-screen w-screen flex items-center justify-center relative text-white text-center p-4">
        <motion.div
          className="absolute inset-0 bg-black z-0 overflow-hidden"
          style={{ scale: missionBgScale }}
        >
          <video
            className="w-full h-full object-cover opacity-40"
            src={content.mission.video_url}
            autoPlay loop muted playsInline
          />
        </motion.div>
        <motion.div 
          className="relative z-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-shadow-lg">{content.mission.korean_mission}</h1>
          <p className="text-lg md:text-2xl text-white/80 font-light text-shadow max-w-xs md:max-w-2xl mx-auto">"{content.mission.english_mission}"</p>
        </motion.div>
      </section>

      <motion.div ref={mainContentRef} style={{ backgroundColor }}>

        <ScrollingFocusSection 
          sectionTitle={content.capabilities.title} 
          items={content.capabilities.items}
          backgroundColor="bg-transparent"
        />

        <div className="h-96" /> 
        
        <ScrollingFocusSection 
          sectionTitle={content.research.title} 
          items={content.research.items}
          backgroundColor="bg-transparent"
        />

        <div className="h-96" />

        <ScrollingFocusSection 
          sectionTitle={content.impact.title} 
          items={content.impact.items}
          backgroundColor="bg-transparent"
        />

        <section className="container pb-20 md:pb-32 text-center space-y-8">
          <h3 className='text-xl md:text-2xl font-bold text-muted-foreground'>Key Partners</h3>
          <motion.div 
            className="flex justify-center items-center gap-8 md:gap-12 flex-wrap"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.3 }}
          >
            {content.impact.logos.map((logo: any, index: number) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.5 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
                }}
              >
                <img src={logo.url} alt={logo.name} className="h-10 md:h-16 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}