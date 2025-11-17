import React, { useRef, useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Root, useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import { Cpu, Atom, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import merge from 'lodash/merge';
import { SvgImageMorph } from '../SvgImageMorph';

// (ScrollyText 컴포넌트는 변경 없음)
const iconMap: Record<string, React.ElementType> = {
  Cpu, Atom, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users,
  "FlaskConical": TestTube2
};
interface ScrollyTextProps { item: any; className: string; }
function ScrollyText({ item, className }: ScrollyTextProps) {
  const IconComponent = iconMap[item.icon] || Atom;
  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center text-center p-8 text-white absolute inset-0 ${className}`}
      style={{ opacity: 0 }} // GSAP이 제어하도록 opacity: 0
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

  // (useEffect fetchContent는 변경 없음)
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

      {/* --- ⬇️ 수정된 부분 시작 ⬇️ --- */}
      <Root
        start="top top"
        end={`+=${allItems.length * 100}%`}
        scrub={1}
      >
        {/* 1. ScrollyTextAnimator에 mainContentRef를 prop으로 전달 */}
        <ScrollyTextAnimator allItems={allItems} mainContentRef={mainContentRef} />

        <div ref={mainContentRef} className="relative">
          {/* 스티키 배경 래퍼 (z-0) */}
          <div className="absolute top-0 left-0 w-full h-screen z-0" style={{ position: 'sticky' }}>
            
            <SvgImageMorph
              imageUrls={allImages}
              allItems={allItems}
            />

            {/* 스티키 텍스트 컨테이너 (z-10) */}
            <div className="absolute top-0 left-0 w-full h-screen z-10">
              {allItems.map((item, index) => (
                <ScrollyText
                  key={`text-${index}`}
                  item={item}
                  className={`scrolly-text-item text-item-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Root>
      {/* --- ⬆️ 수정된 부분 종료 ⬆️ --- */}

      {/* (파트너 로고 섹션은 변경 없음) */}
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
  );
}

{/* --- ⬇️ 수정된 ScrollyTextAnimator 함수 ⬇️ --- */}
function ScrollyTextAnimator({ allItems, mainContentRef }: { 
  allItems: any[], 
  mainContentRef: React.RefObject<HTMLDivElement> // 2. props 타입 수정
}) {
  const { timeline } = useScrollytelling();

  useLayoutEffect(() => {
    // 3. mainContentRef.current가 준비될 때까지 기다림
    if (!timeline || allItems.length === 0 || !mainContentRef.current) return;

    // 4. mainContentRef.current를 'scope'로 지정하여 텍스트 요소 검색
    const textSections = gsap.utils.toArray<HTMLElement>('.scrolly-text-item', mainContentRef.current);

    // 5. (안전장치) 요소를 찾지 못하면 경고만 띄우고 종료
    if (textSections.length === 0) {
      console.warn("ScrollyTextAnimator: '.scrolly-text-item'을 찾을 수 없습니다.");
      return;
    }

    // (이후 로직은 동일)
    gsap.set(textSections[0], { opacity: 1 }); // 첫 번째 텍스트 보이기

    // 6. gsap.context의 scope도 mainContentRef.current로 지정
    const ctx = gsap.context(() => {
      allItems.forEach((_, i) => {
        if (i === 0) return;

        const prevText = textSections[i - 1];
        const currentText = textSections[i];
        if (!prevText || !currentText) return;
        
        const itemStartTime = (1 / allItems.length) * i;

        const tl = gsap.timeline();
        tl
          .to(prevText, { opacity: 0, scale: 0.95, y: -30, ease: 'power2.in', duration: 0.4 })
          .fromTo(currentText, 
            { opacity: 0, scale: 0.95, y: 30 },
            { opacity: 1, scale: 1, y: 0, ease: 'power2.out', duration: 0.4 }, 
            0
          );

        timeline.add(tl, itemStartTime - 0.2); // 0.2초 = 0.4초(duration)의 절반
      });
    }, mainContentRef.current); // <-- scope 지정

    return () => ctx.revert();
    
  }, [allItems, timeline, mainContentRef]); // 7. 의존성 배열에 mainContentRef 추가

  return null; // UI를 렌더링하지 않음
}