"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

const VIDEO_SRC = "/videos/demo-sequence1.webm";
const VIDEO_DURATION_SECONDS = 5;

export function Section4_Demo() {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- ⬇️ '새 악보' (2350%) 적용 ⬇️ ---
  const startTime = 16.5; // (시작은 16.5 동일)
  const endTime = 20.5; // 18.5 -> 19.5
  const sectionDuration = endTime - startTime; // 2.0 -> 3.0 (300vh)
  const sectionHeight = `${sectionDuration * 100}vh`; // "300vh"
  // --- ⬆️ '새 악보' 적용 ⬆️ ---

  useLayoutEffect(() => {
    // 2. sectionRef.current로 가드
    if (!timeline || !videoRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // --- ⬇️ (문제 1) 캡션/제목 애니메이션 추가 ⬇️ ---
      const caption = sectionRef.current?.querySelector('.demo-caption');
      if (caption) {
        // 넉넉하게 0.3 (30vh) 뒤에 나타나고 0.3 (30vh) 전에 사라짐
        timeline.fromTo(caption, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 }, startTime + 0.3);
        timeline.to(caption, { opacity: 0, y: 20, duration: 0.1 }, endTime - 0.3);
      }
      // --- ⬆️ (문제 1) 캡션/제목 애니메이션 추가 ⬆️ ---
      const videoTracker = { time: 0 };

      // 5. 'frame' 대신 'videoTracker.time'을 0초에서 'VIDEO_DURATION_SECONDS'초까지 애니메이션
      const videoTween = gsap.to(videoTracker, {
        time: VIDEO_DURATION_SECONDS,
        ease: "none",
        duration: 3.0, // '고정' 시간을 위해 sectionDuration(3.0)보다 짧게 설정
        onUpdate: () => {
          // 6. videoTracker.time이 바뀔 때마다 <video>의 currentTime을 강제로 변경
          if (videoRef.current) {
            videoRef.current.currentTime = videoTracker.time;
          }
        },
      });
      timeline.add(videoTween, startTime); // 16.5 시점에 시작 
      
    }, sectionRef.current);
    
    return () => ctx.revert();
    
  }, [timeline, sectionDuration, startTime, endTime]); // endTime 추가

  return (
    // 5. 'sticky'를 제거하고, '악보'에서 계산된 '높이(height)'를 할당
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* 6. '소품'(Visuals)들만 'sticky'를 사용해 화면에 고정 */}
      <div className="sticky top-0 h-screen">
      <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="w-full h-full object-contain"
          playsInline // 모바일 자동재생 정책
          muted // 모바일 자동재생 정책
          preload="auto" // 미리 로드
        />

        {/* 7. 캡션에 GSAP이 제어할 클래스와 opacity-0 추가 */}
        <div className="demo-caption opacity-0 absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
          <p className="text-white text-lg text-shadow-lg bg-black/30 p-2 rounded-md">
            우리의 시뮬레이션은 이렇게 동작합니다.
          </p>
        </div>
      </div>
    </div>
  );
}