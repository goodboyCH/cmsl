"use client";
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ReactBits Component
import GradientText from '@/components/reactbits/GradientText';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/videos/demo2.mp4"; 
const FPS = 30; 

interface Section4Props {
  title: string;
  description: string;
}

export function Section4_Demo({ title, description }: Section4Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!videoRef.current || !sectionRef.current || !containerRef.current) return;

      const video = videoRef.current;

      const handleMetadata = () => {
        const duration = video.duration || 5; 
        const totalFrames = Math.floor(duration * FPS); 
        const videoState = { frame: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "center center", 
            end: "+=300%", 
            pin: true,     
            scrub: 1,      
          }
        });

        tl.to(videoState, {
          frame: totalFrames,
          duration: duration,
          ease: "none",
          onUpdate: () => {
            if (video && Number.isFinite(videoState.frame)) {
                video.currentTime = videoState.frame / FPS;
            }
          }
        }, 0); 
      };

      if (video.readyState >= 1) {
        handleMetadata();
      } else {
        video.onloadedmetadata = handleMetadata;
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 bg-black border-b border-white/10 overflow-hidden">
      
      {/* ✅ [수정 1] items-start -> items-center 
         Flex 컨테이너 내부 요소들을 수평 중앙으로 정렬합니다.
      */}
      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-center items-center">
        
        {/* ✅ [수정 2] text-left -> text-center 
           내부 텍스트들이 가운데로 정렬되도록 변경했습니다.
        */}
       <div className="w-full mb-12 text-center">
          
          {/* ✅ [수정 3] justify-start -> justify-center 
             GradientText 컴포넌트가 화면 중앙에 위치하도록 Flex 정렬을 수정했습니다.
          */}
          <h2 className="text-4xl md:text-6xl font-bold mb-4 flex justify-center">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={5}
              showBorder={false}
            >
              {title}
            </GradientText>
          </h2>
          
          {/* ✅ [수정 4] mx-auto 추가 
             max-w-3xl로 너비가 제한된 상태에서 박스 자체가 중앙에 오도록 margin auto를 줍니다.
          */}
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed break-keep whitespace-pre-wrap">
            {description}
          </p>
        </div>

        {/* --- 비디오 컨테이너 --- */}
        <div 
          ref={containerRef}
          className="relative w-full aspect-video bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5"
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            className="w-full h-full object-contain" 
            playsInline
            muted
            preload="auto"
          />
          
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs md:text-sm text-cyan-400 font-mono">
             ● AI-Accelerated PFM
          </div>
        </div>

      </div>
    </section>
  );
}