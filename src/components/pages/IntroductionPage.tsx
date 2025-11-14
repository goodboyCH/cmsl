import React, { useRef, useState, useEffect, useMemo } from 'react'; // 1. useMemo 추가
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollingFocusSection } from '@/components/ScrollingFocusSection'; 
import { Cpu, Atom, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; 
import merge from 'lodash/merge'; 
import { ImageTransitionCanvas } from '../ImageTransitionCanvas'; // 2. 새로 만든 캔버스 import

// 3. 기본값 객체 (안정성을 위해 수정)
const pageContentDefault: any = {
  mission: { video_url: "", korean_mission: "Loading...", english_mission: "Loading..." },
  capabilities: { title: "", items: [] },
  research: { title: "", items: [] },
  impact: { title: "", items: [], logos: [] }
};

export function IntroductionPage() {
  const [content, setContent] = useState<any>(pageContentDefault);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // (useEffect 로직은 lodash/merge를 사용)
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

  const { scrollYProgress: contentScrollProgress } = useScroll({
    target: mainContentRef,
    offset: ['start start', 'end end'] 
  });

  // 4. 배경색 로직(backgroundColor)은 삭제합니다.
  
  // 5. 모핑에 사용할 이미지 목록 준비 (useMemo로 불필요한 리렌더링 방지)
  const imageTransitionUrls = useMemo(() => {
    // content.research.items에서 imageUrl을 추출합니다.
    const researchImages = (content.research?.items || [])
      .map((item: any) => item.imageUrl)
      .filter(Boolean); // null이나 undefined 제거
      
    // 최소 2개의 이미지가 필요하므로, 부족하면 기본 이미지로 채웁니다.
    if (researchImages.length === 0) {
      return ["/images/research-auto.jpg", "/images/research-magnet.jpg"]; // 기본 이미지
    }
    if (researchImages.length === 1) {
      return [researchImages[0], researchImages[0]]; // 1개면 2개로 복사
    }
    return researchImages;
  }, [content.research?.items]);

  // 6. 스크롤 전환 지점 설정 (이미지 개수에 맞춰 자동 계산)
  const scrollStops = useMemo(() => {
    const numStops = imageTransitionUrls.length - 1;
    if (numStops <= 0) return [1.0];
    return Array.from({ length: numStops }, (_, i) => (i + 1) / numStops);
  }, [imageTransitionUrls.length]);


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
      {/* (Hero 섹션은 변경 없음) */}
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

      {/* --- ⬇️ 7. 메인 콘텐츠 래퍼 수정 ⬇️ --- */}
      {/* ref를 여기로 이동하고, style(backgroundColor) 제거 */}
      <div ref={mainContentRef} className="relative"> 
        
        {/* WebGL 캔버스 배경 */}
        <div className="absolute top-0 left-0 w-full h-screen z-0" style={{ position: 'sticky' }}>
          <ImageTransitionCanvas 
            scrollProgress={contentScrollProgress}
            imageUrls={imageTransitionUrls}
            scrollStops={scrollStops}
          />
        </div>
        
        {/* 스크롤 콘텐츠 */}
        <div className="relative z-10">
          <ScrollingFocusSection 
            sectionTitle={content?.capabilities?.title} 
            items={content?.capabilities?.items || []}
            backgroundColor="bg-transparent" // 배경색 투명하게
          />

          <div className="h-96" /> 
          
          <ScrollingFocusSection 
            sectionTitle={content?.research?.title} 
            items={content?.research?.items || []}
            backgroundColor="bg-transparent" // 배경색 투명하게
          />

          <div className="h-96" />

          <ScrollingFocusSection 
            sectionTitle={content?.impact?.title} 
            items={content?.impact?.items || []}
            backgroundColor="bg-transparent" // 배경색 투명하게
          />

          {/* 파트너 로고 섹션 (다시 배경색 적용) */}
          <section className="container pb-20 md:pb-32 text-center space-y-8 bg-background">
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