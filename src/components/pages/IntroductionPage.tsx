import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollingFocusSection } from '@/components/ScrollingFocusSection'; 
import { Cpu, Atom, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; 
import merge from 'lodash/merge'; 
import { ImageTransitionCanvas } from '../ImageTransitionCanvas'; 

// 기본값 객체 (DB 로딩 실패 시 사용)
const pageContentDefault: any = {
  mission: { video_url: "/videos/bg1.mp4", korean_mission: "CMSL", english_mission: "Achieving Predictable Materials Design..." },
  capabilities: { title: "Our Core Capabilities", items: [{ imageUrl: "/images/logo1.png" }] }, // 최소 1개 이미지 보장
  research: { title: "Major Research Areas", items: [{ imageUrl: "/images/logo1.png" }] }, // 최소 1개 이미지 보장
  impact: { title: "Our Impact", items: [], logos: [] }
};

export function IntroductionPage() {
  const [content, setContent] = useState<any>(pageContentDefault);
  const [loading, setLoading] = useState(true);

  // (useEffect 로직은 변경 없음)
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

  const { scrollYProgress: contentScrollProgress } = useScroll({
    target: mainContentRef,
    offset: ['start start', 'end end'] 
  });
  
  // (imageTransitionUrls useMemo 로직은 변경 없음)
  const imageTransitionUrls = useMemo(() => {
    const capabilitiesImages = (content.capabilities?.items || [])
      .map((item: any) => item.imageUrl)
      .filter((url: any) => typeof url === 'string' && url.trim() !== '');

    const researchImages = (content.research?.items || [])
      .map((item: any) => item.imageUrl)
      .filter((url: any) => typeof url === 'string' && url.trim() !== '');
      
    const impactImages = (content.impact?.items || [])
      .map((item: any) => item.imageUrl)
      .filter((url: any) => typeof url === 'string' && url.trim() !== '');

    const allImages = [...capabilitiesImages, ...researchImages, ...impactImages];
      
    // (안전장치) 이미지가 2개 미만일 경우 로고 이미지로 채웁니다.
    if (allImages.length === 0) {
      return ["/images/logo1.png", "/images/logo1.png"]; 
    }
    if (allImages.length === 1) {
      return [allImages[0], allImages[0]]; 
    }
    return allImages; 
    
  }, [content.capabilities?.items, content.research?.items, content.impact?.items]); 

  // (scrollStops useMemo 로직은 변경 없음)
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

      {/* --- ⬇️ 메인 콘텐츠 래퍼 수정 ⬇️ --- */}
      <div ref={mainContentRef} className="relative"> 
        
        {/* WebGL 캔버스 배경 (스티키) */}
        <div className="absolute top-0 left-0 w-full h-screen z-0" style={{ position: 'sticky' }}>
          {/* 2. Suspense로 캔버스를 감싸고, 로딩 중 표시할 fallback UI 지정 */}
          <Suspense fallback={<div className="w-full h-full bg-muted" />}>
            <ImageTransitionCanvas 
              scrollProgress={contentScrollProgress}
              imageUrls={imageTransitionUrls}
              scrollStops={scrollStops}
            />
          </Suspense>
        </div>
        {/* --- ⬆️ 수정 완료 ⬆️ --- */}
        
        {/* 스크롤 콘텐츠 (z-10) */}
        <div className="relative z-10">
          <ScrollingFocusSection 
            sectionTitle={content?.capabilities?.title} 
            items={content?.capabilities?.items || []}
            backgroundColor="bg-transparent"
          />
          <div className="h-96" /> 
          <ScrollingFocusSection 
            sectionTitle={content?.research?.title} 
            items={content?.research?.items || []}
            backgroundColor="bg-transparent"
          />
          <div className="h-96" />
          <ScrollingFocusSection 
            sectionTitle={content?.impact?.title} 
            items={content?.impact?.items || []}
            backgroundColor="bg-transparent"
          />
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
    </div>
  );
}