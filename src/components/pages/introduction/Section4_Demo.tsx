"use client";
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/videos/demo-sequence1.mp4"; 
const FPS = 30; // ⭐️ 비디오의 초당 프레임 수 (영상에 맞춰 30 또는 60으로 수정 필수)

export function Section4_Demo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!videoRef.current || !sectionRef.current) return;

      const video = videoRef.current;

      video.onloadedmetadata = () => {
        const duration = video.duration || 5;
        // 전체 총 프레임 수 계산 (예: 5초 * 30fps = 150프레임)
        const totalFrames = duration * FPS; 

        // 비디오 상태를 제어할 가상의 객체 (Proxy)
        const videoState = { frame: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            
            // ⭐️ 스크롤 민감도 조절:
            // 비디오 1프레임을 넘기기 위해 스크롤해야 하는 픽셀 수 = (end 높이) / (총 프레임)
            // +=2000% 정도면 30fps 영상 기준 아주 부드럽고 촘촘하게 제어됩니다.
            end: "+=600%", 
            
            pin: true,
            scrub: 0.5, // 약간의 관성(0.5)을 줘야 뚝뚝 끊기는 느낌이 덜합니다.
          }
        });

        // ⭐️ 핵심 변경: currentTime을 직접 돌리는 게 아니라 'frame'을 돌림
        tl.to(videoState, {
          frame: totalFrames,
          ease: "none",
          onUpdate: () => {
            // 현재 프레임 번호를 시간으로 환산하여 적용
            // Math.floor를 쓰지 않고 정확한 나눗셈을 하되, 브라우저가 프레임을 잘 찾도록 유도
            video.currentTime = videoState.frame / FPS;
          }
        });

        // 텍스트 애니메이션 (기존 로직 유지하되 타임라인에 통합)
        if (textRef.current) {
          // 전체 타임라인 진행률에 맞춰 텍스트 등장
          // duration 대신 totalFrames 비율로 계산해도 되지만, 여기선 시간 비율로 유지
          tl.fromTo(textRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: totalFrames * 0.1 }, 
            totalFrames * 0.3 // 30% 지점
          )
          .to(textRef.current, 
            { opacity: 0, y: -50, duration: totalFrames * 0.1 }, 
            totalFrames * 0.7 // 70% 지점
          );
        }
      };
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
          // 중요: 자동재생 방지
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
      
      {/* 노이즈 효과 (유지) */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
    </div>
  );
}