"use client";
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ReactBits Component
import GradientText from '@/components/reactbits/GradientText';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/videos/demo2.mp4"; 
const FPS = 30; 

export function Section4_Demo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // 비디오 컨테이너 참조

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
            trigger: sectionRef.current, // 섹션을 트리거로 잡음
            // ✅ [수정] start/end 지점 조정
            // 화면 중앙(center)에 비디오 박스의 중앙(center)이 오면 고정 시작
            start: "center center", 
            end: "+=300%", // 스크롤 길이 (길수록 천천히 재생됨)
            pin: true,     // 섹션 고정
            scrub: 1,      // 부드러운 스크러빙
          }
        });

        // 비디오 프레임 재생 애니메이션
        tl.to(videoState, {
          frame: totalFrames,
          duration: duration,
          ease: "none",
          onUpdate: () => {
            if (video) {
                // 비디오가 로드된 상태에서만 시간 업데이트
                if (Number.isFinite(videoState.frame)) {
                   video.currentTime = videoState.frame / FPS;
                }
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
    // ✅ [레이아웃] 전체 화면(h-screen) 대신 패딩이 있는 섹션으로 변경
    <section ref={sectionRef} className="relative py-32 bg-black border-b border-white/10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl h-full flex flex-col justify-center">
        
        {/* --- 1. 헤더 (다른 섹션과 통일된 스타일) --- */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={5}
              showBorder={false}
            >
              Simulation Demo
            </GradientText>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
            Experience the microstructure evolution predicted by our Full-Stack PFM engine.
            <br className="hidden md:block"/>
            Scroll down to control the simulation time-lapse.
          </p>
        </div>

        {/* --- 2. 비디오 컨테이너 (16:9 비율) --- */}
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
          
          {/* 장식용: 비디오 위에 살짝 그라데이션 오버레이 (선택사항) */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          
          {/* 우측 하단 라벨 */}
          <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs md:text-sm text-cyan-400 font-mono">
             ● AI-Accelerated PFM
          </div>
        </div>

      </div>
    </section>
  );
}