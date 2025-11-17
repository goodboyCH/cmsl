"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

const IMAGE_COUNT = 150;
const demoImages = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `/images/demo-sequence/${(i + 1).toString().padStart(4, '0')}.jpg`
);

export function Section4_Demo() {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null); // 1. sectionRef로 변경
  const imgRef = useRef<HTMLImageElement>(null);

  // '악보' 시점
  const startTime = 0.75; // 60% -> 75%
  const duration = 0.10; // 10% (동일)
  const sectionHeight = `${duration * 1000}vh`; // "100vh" (동일)

  useLayoutEffect(() => {
    // 2. sectionRef.current로 가드
    if (!timeline || !imgRef.current || !sectionRef.current) return;

    const frameTracker = { frame: 0 };
    const imageTween = gsap.to(frameTracker, {
      frame: demoImages.length - 1,
      snap: "frame",
      ease: "none",
      duration: duration, // duration 수정
      onUpdate: () => {
        if (imgRef.current) {
          imgRef.current.src = demoImages[frameTracker.frame];
        }
      },
    });
    timeline.add(imageTween, startTime);
    
  }, [timeline, duration, startTime]);

  return (
    // 3. 'sticky'를 제거하고, '악보'에서 계산된 '높이(height)'를 할당
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* 4. '소품'(Visuals)들만 'sticky'를 사용해 화면에 고정 */}
      <div className="sticky top-0 h-screen">
        <img 
          ref={imgRef}
          src={demoImages[0]}
          className="w-full h-full object-contain"
        />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
          <p className="text-white text-lg text-shadow-lg bg-black/30 p-2 rounded-md">
            우리의 시뮬레이션은 이렇게 동작합니다.
          </p>
        </div>
      </div>
    </div>
  );
}