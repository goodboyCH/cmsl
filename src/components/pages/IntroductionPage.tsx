import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollingFocusSection } from '@/components/ScrollingFocusSection'; 
import { Cpu, Atom, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; 
import merge from 'lodash/merge'; 
import { SvgImageMorph } from '../SvgImageMorph'; // 1. GSAP 모핑 컴포넌트 import

// (기본값 객체는 변경 없음)
const pageContentDefault: any = {
  mission: { video_url: "/videos/bg1.mp4", korean_mission: "CMSL", english_mission: "Achieving Predictable Materials Design..." },
  capabilities: { title: "Our Core Capabilities", items: [{ imageUrl: "/images/logo1.png" }] },
  research: { title: "Major Research Areas", items: [{ imageUrl: "/images/logo1.png" }] },
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
      
    if (allImages.length === 0) {
      return ["/images/logo1.png", "/images/logo1.png"];
    }
    if (allImages.length === 1) {
      return [allImages[0], allImages[0]];
    }
    return allImages; 
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
        {/* ... Hero 렌더링 ... */}
      </section>

      <div ref={mainContentRef} className="relative"> 
        
        {/* 스티키 배경 래퍼 (SVG 캔버스) */}
        <div className="absolute top-0 left-0 w-full h-screen z-0" style={{ position: 'sticky' }}>
          <SvgImageMorph 
            imageUrls={imageTransitionUrls} 
            sectionRefs={[capabilitiesRef, researchRef, impactRef]} // ref 배열 전달
          />
        </div>
        
        {/* 스크롤 콘텐츠 (z-10) */}
        <div className="relative z-10">
          {/* --- ⬇️ (핵심 수정) .map()을 사용해 'imageUrl'을 제거하고 items를 전달 ⬇️ --- */}
          <div ref={capabilitiesRef}>
            <ScrollingFocusSection 
              sectionTitle={content?.capabilities?.title} 
              items={(content?.capabilities?.items || []).map(({ imageUrl, ...rest }: any) => rest)} 
              backgroundColor="bg-transparent"
            />
          </div>
          <div className="h-96" /> 
          
          <div ref={researchRef}>
            <ScrollingFocusSection 
              sectionTitle={content?.research?.title} 
              items={(content?.research?.items || []).map(({ imageUrl, ...rest }: any) => rest)} 
              backgroundColor="bg-transparent"
            />
          </div>
          <div className="h-96" />

          <div ref={impactRef}>
            <ScrollingFocusSection 
              sectionTitle={content?.impact?.title} 
              items={(content?.impact?.items || []).map(({ imageUrl, ...rest }: any) => rest)} 
              backgroundColor="bg-transparent"
            />
          </div>
          {/* --- ⬆️ 수정 완료 ⬆️ --- */}
          
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