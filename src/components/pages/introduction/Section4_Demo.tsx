"use client";
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/videos/demo-sequence1.mp4"; // 기존 비디오 경로 유지

export function Section4_Demo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!videoRef.current || !sectionRef.current) return;

      const video = videoRef.current;
      
      // 1. 비디오 메타데이터 로드 대기 (길이 확보)
      video.onloadedmetadata = () => {
        const duration = video.duration || 5; // 비디오 길이가 없으면 기본 5초

        // 2. 타임라인 생성
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top", // 섹션 상단이 화면 상단에 닿을 때
            end: "+=900%",    // 스크롤 길이 (300vh 만큼 스크롤 하는 동안 재생)
            pin: true,        // 화면 고정
            scrub: 1,         // 부드러운 스크러빙
            // markers: true, // 디버깅 필요시 주석 해제
          }
        });

        // 3. 비디오 재생 애니메이션 (currentTime을 스크롤에 매핑)
        tl.fromTo(
          video,
          { currentTime: 0 },
          { currentTime: duration, ease: "none" }
        );

        // 4. 텍스트(캡션) 애니메이션 추가
        // 비디오 재생 중간쯤에 텍스트가 떴다가 사라짐
        if (textRef.current) {
          tl.fromTo(textRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: duration * 0.1 }, 
            duration * 0.2 // 20% 지점에서 등장
          )
          .to(textRef.current, 
            { opacity: 0, y: -50, duration: duration * 0.1 }, 
            duration * 0.8 // 80% 지점에서 퇴장
          );
        }
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative h-screen w-full bg-black overflow-hidden">
      {/* ScrollTrigger가 'pin: true'를 하면 자동으로 래퍼를 생성하므로, 
        여기서는 별도의 sticky 클래스 없이 h-full로 채우면 됩니다. 
      */}
      
      {/* 비디오 컨테이너 */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="w-full h-full object-contain" // object-contain으로 전체가 보이게 (혹은 cover)
          playsInline
          muted
          preload="auto"
        />
      </div>

      {/* 캡션 오버레이 */}
      <div 
        ref={textRef} 
        className="absolute bottom-20 left-0 w-full text-center z-10 opacity-0 pointer-events-none"
      >
        <div className="inline-block bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
          <p className="text-white text-lg md:text-2xl font-bold tracking-wide">
            "Simulation Results: <span className="text-cyan-500">Predicted Microstructure</span>"
          </p>
        </div>
      </div>
      
      {/* 장식용 오버레이 (Scanlines) */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
    </div>
  );
}