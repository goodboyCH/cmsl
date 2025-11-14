import React, { useRef, useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
// ScrollingFocusSection은 더 이상 사용하지 않습니다.
import { Cpu, Atom, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; 
import merge from 'lodash/merge'; 
import { SvgImageMorph } from '../SvgImageMorph'; 
import { gsap } from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 

gsap.registerPlugin(ScrollTrigger);

// (ScrollyText 컴포넌트는 변경 없음)
const iconMap: Record<string, React.ElementType> = {
  Cpu, Atom, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users,
  "FlaskConical": TestTube2 
};

interface ScrollyTextProps {
  item: any;
  className: string; 
}

function ScrollyText({ item, className }: ScrollyTextProps) {
  const IconComponent = iconMap[item.icon] || Atom; 

  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center justify-center text-center p-8 text-white absolute inset-0 ${className}`}
      style={{ opacity: 0 }} 
    >
      <IconComponent className="h-12 w-12 text-primary" />
      <h2 className="text-3xl md:text-5xl font-bold text-shadow-lg mt-4">{item.title}</h2>
      <p className="text-lg md:text-xl text-white/80 max-w-2xl mt-4 text-shadow-md">{item.description}</p>
    </div>
  );
}
// --- ⬆️ ScrollyText 컴포넌트 완료 ⬆️ ---


// (기본값 객체는 변경 없음)
const pageContentDefault: any = {
  mission: { video_url: "/videos/bg1.mp4", korean_mission: "CMSL", english_mission: "Achieving Predictable Materials Design..." },
  capabilities: { title: "Our Core Capabilities", items: [{ imageUrl: "/images/logo1.png", title: "Capabilities", description: "Loading...", icon: "Cpu" }] },
  research: { title: "Major Research Areas", items: [{ imageUrl: "/images/logo1.png", title: "Research", description: "Loading...", icon: "Car" }] },
  impact: { title: "Our Impact", items: [], logos: [] }
};

export function IntroductionPage() {
  const [content, setContent] = useState<any>(pageContentDefault);
  const [loading, setLoading] = useState(true);

  // (useEffect는 변경 없음)
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
        setContent(pageContentDefault);
      } else {
        const mergedContent = merge({}, pageContentDefault, data.content);
        setContent(mergedContent);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);
  
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // (각 스크롤 섹션에 대한 Ref 생성은 변경 없음)
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const researchRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  
  // (imageTransitionUrls useMemo 로직은 변경 없음)
  const { allItems, allImages } = useMemo(() => {
    const capabilitiesItems = (content.capabilities?.items || []).filter((item: any) => item.imageUrl);
    const researchItems = (content.research?.items || []).filter((item: any) => item.imageUrl);
    const impactItems = (content.impact?.items || []).filter((item: any) => item.imageUrl);
    
    const items = [...capabilitiesItems, ...researchItems, ...impactItems];
    const images = items.map((item: any) => item.imageUrl);

    if (images.length === 0) return { allItems: [], allImages: ["/images/logo1.png", "/images/logo1.png"] };
    if (images.length === 1) return { allItems: items, allImages: [images[0], images[0]] };

    return { allItems: items, allImages: images };

  }, [content.capabilities?.items, content.research?.items, content.impact?.items]);
  
  // (sectionRefs useMemo 로직은 변경 없음)
  const sectionRefs = useMemo(() => 
    Array(allItems.length).fill(0).map(() => React.createRef<HTMLDivElement>()), 
    [allItems.length]
  );
  
  // --- ⬇️ (핵심 수정) GSAP 텍스트 페이드 로직 ⬇️ ---
  useLayoutEffect(() => {
    if (loading || allItems.length === 0) return;

    const ctx = gsap.context(() => {
      // (오류 수정) 'unknown[]' 대신 'HTMLElement[]' 타입을 명시
      const textSections = gsap.utils.toArray<HTMLElement>('.scrolly-text-item');

      // 각 트리거(sectionRefs)에 텍스트 페이드 애니메이션 바인딩
      sectionRefs.forEach((sectionRef, i) => {
        if (!textSections[i]) return;

        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current, // 스크롤 영역 div
            start: 'top 50%', // 스크롤 div가 화면 50%에 닿으면
            end: 'bottom 50%', // 스크롤 div가 화면 50%를 떠나면
            toggleActions: 'play reverse play reverse', // 진입/이탈 시 페이드 인/아웃
          }
        })
        .to(textSections[i], { opacity: 1, duration: 0.5 }); // 해당 텍스트만 보이게
      });
    }, mainContentRef); // mainContentRef 안에서 실행

    return () => ctx.revert();
  }, [loading, allItems, sectionRefs]);
  // --- ⬆️ 수정 완료 ⬆️ ---

  // (Hero 비디오 스케일 훅은 그대로 둡니다)
  const { scrollYProgress: missionProgress } = useScroll({ offset: ['start start', 'end start'] });
  const missionBgScale = useTransform(missionProgress, [0, 1], [1, 1.15]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p>Loading Introduction...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* (Hero 섹션 변경 없음) */}
      <section className="h-screen w-screen flex items-center justify-center relative text-white text-center p-4">
        <motion.div
          className="absolute inset-0 bg-black z-0 overflow-hidden"
          style={{ scale: missionBgScale }}
        >
          <video
            className="w-full h-full object-cover opacity-40"
            src={content?.mission?.video_url} 
            autoPlay loop muted playsInline
          />
        </motion.div>
        <motion.div 
          className="relative z-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-shadow-lg">{content?.mission?.korean_mission}</h1>
          <p className="text-lg md:text-2xl text-white/80 font-light text-shadow max-w-xs md:max-w-2xl mx-auto">"{content?.mission?.english_mission}"</p>
        </motion.div>
      </section>

      {/* --- ⬇️ (핵심) 메인 콘텐츠 래퍼 ⬇️ --- */}
      <div ref={mainContentRef} className="relative"> 
        
        {/* 스티키 배경 래퍼 (z-0) */}
        <div className="absolute top-0 left-0 w-full h-screen z-0" style={{ position: 'sticky' }}>
          <SvgImageMorph 
            imageUrls={allImages} 
            sectionRefs={sectionRefs} // GSAP이 사용할 ref 전달
          />
          
          {/* 스티키 텍스트 컨테이너 (z-10) */}
          <div className="absolute top-0 left-0 w-full h-screen z-10">
            {allItems.map((item, index) => (
              <ScrollyText
                key={`text-${index}`}
                item={item}
                className={`scrolly-text-item text-item-${index}`} // GSAP이 선택할 클래스
              />
            ))}
          </div>
        </div>
        
        {/* 스크롤 영역 (z-20) */}
        <div className="relative z-20">
          
          {/* (핵심) GSAP 트리거 역할을 할 빈 div들 */}
          {/* 이 div들이 실제 스크롤 영역을 만듭니다. */}
          {allItems.map((item, index) => (
            <div 
              key={`trigger-${index}`}
              ref={sectionRefs[index]} 
              className="h-screen" // 각 섹션이 화면 높이만큼의 스크롤을 차지
            />
          ))}
          
          {/* 파트너 로고 섹션 (z-10 유지) */}
          <section className="container pb-20 md:pb-32 text-center space-y-8 bg-background relative z-10">
            <h3 className='text-xl md:text-2xl font-bold text-muted-foreground'>Key Partners</h3>
            <motion.div 
              className="flex justify-center items-center gap-8 md:gap-12 flex-wrap"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ staggerChildren: 0.3 }}
            >
              {(content?.impact?.logos || []).map((logo: any, index: number) => (
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
        </div>
      </div>
      {/* --- ⬆️ 수정 완료 ⬆️ --- */}
    </div>
  );
}