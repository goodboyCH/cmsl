"use client";
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/videos/demo-sequence1.mp4"; 
const FPS = 30; // 영상 프레임레이트에 맞춰 수정 (30 or 60)

export function Section4_Demo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!videoRef.current || !sectionRef.current) return;

      const video = videoRef.current;

      // 비디오 메타데이터 로드 핸들러
      const handleMetadata = () => {
        const duration = video.duration || 5; 
        const totalFrames = Math.floor(duration * FPS); 
        const videoState = { frame: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=600%", // 50배 길이 (충분히 긺)
            pin: true,
            scrub: 0.5,     // 부드러운 감속
          }
        });

        // 🛑 [핵심 수정] duration: duration
        // 이전 코드에서는 이 부분이 없어서 0.5초만에 비디오가 끝났습니다.
        // 이제 비디오 길이(예: 5초)만큼 타임라인을 꽉 채웁니다.
        tl.to(videoState, {
          frame: totalFrames,
          duration: duration, // ⭐️ 이 설정을 반드시 넣어야 스크롤 끝까지 비디오가 나옵니다.
          ease: "none",
          onUpdate: () => {
            if (video) {
                video.currentTime = videoState.frame / FPS;
            }
          }
        }, 0); // 0초 지점부터 시작

        // 텍스트 애니메이션: 비디오 타임라인 위에 얹기
        if (textRef.current) {
          // 비디오 전체 길이의 20%~40% 구간에서 등장했다가 사라짐
          const fadeInTime = duration * 0.2;
          const fadeOutTime = duration * 0.8;
          
          tl.fromTo(textRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1 }, // 텍스트 나타나는 속도
            fadeInTime
          )
          .to(textRef.current, 
            { opacity: 0, y: -50, duration: 1 }, // 텍스트 사라지는 속도
            fadeOutTime
          );
        }
      };

      // 이미 로드되어 있으면 바로 실행, 아니면 이벤트 대기
      if (video.readyState >= 1) {
        handleMetadata();
      } else {
        video.onloadedmetadata = handleMetadata;
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative h-screen w-full bg-black overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="w-full h-full object-contain" 
          playsInline
          muted
          preload="auto"
        />
      </div>

      <div 
        ref={textRef} 
        className="absolute bottom-20 left-0 w-full text-center z-10 opacity-0 pointer-events-none"
      >
        <div className="inline-block bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
          <p className="text-white text-lg md:text-2xl font-bold tracking-wide">
            "Simulation Results: <span className="text-cyan-500">Predicted Microstructure</span>"
          </p>
        </div>
      </div>
      
      <div className="absolute inset-0 z-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
    </div>
  );
}