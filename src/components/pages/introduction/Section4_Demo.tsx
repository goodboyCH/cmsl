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
      {/* ✅ [수정 1] items-start: Flex 아이템들을 왼쪽(시작점)으로 강제 정렬 
         justify-center는 수직 중앙 정렬, items-start는 수평 좌측 정렬 역할을 합니다.
      */}
      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-center items-start">
        
        {/* ✅ [수정 2] w-full: items-start 적용 시 너비가 컨텐츠만큼만 잡힐 수 있으므로, 
           부모 너비를 꽉 채우도록 설정하여 text-left가 확실히 먹히도록 함 
        */}
        <div className="w-full mb-12 text-left">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={5}
              showBorder={false}
            >
              {title}
            </GradientText>
          </h2>
          
          {/* ✅ [수정 3] break-keep: 한글 단어 중간 끊김 방지
             ✅ [수정 4] whitespace-pre-wrap: 텍스트 내 줄바꿈(\n) 적용
          */}
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl leading-relaxed break-keep whitespace-pre-wrap">
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