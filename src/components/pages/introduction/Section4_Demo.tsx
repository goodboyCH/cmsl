"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

const IMAGE_COUNT = 118;
const demoImages = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `/images/demo-sequence/${(i + 1).toString().padStart(4, '0')}.jpg`
);

export function Section4_Demo() {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // --- ⬇️ '새 악보' (2350%) 적용 ⬇️ ---
  const startTime = 16.5; // (시작은 16.5 동일)
  const endTime = 20.5; // 18.5 -> 19.5
  const sectionDuration = endTime - startTime; // 2.0 -> 3.0 (300vh)
  const sectionHeight = `${sectionDuration * 100}vh`; // "300vh"
  // --- ⬆️ '새 악보' 적용 ⬆️ ---

  useLayoutEffect(() => {
    // 2. sectionRef.current로 가드
    if (!timeline || !imgRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // --- ⬇️ (문제 1) 캡션/제목 애니메이션 추가 ⬇️ ---
      const caption = sectionRef.current?.querySelector('.demo-caption');
      if (caption) {
        // 넉넉하게 0.3 (30vh) 뒤에 나타나고 0.3 (30vh) 전에 사라짐
        timeline.fromTo(caption, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 }, startTime + 0.3);
        timeline.to(caption, { opacity: 0, y: 20, duration: 0.1 }, endTime - 0.3);
      }
      // --- ⬆️ (문제 1) 캡션/제목 애니메이션 추가 ⬆️ ---

      const frameTracker = { frame: 0 };
      const imageTween = gsap.to(frameTracker, {
        frame: demoImages.length - 1,
        snap: "frame",
        ease: "none",
        duration: sectionDuration, // 3. 0.10이 아닌 '2.0' (200vh) 전체를 사용
        onUpdate: () => {
          if (imgRef.current) {
            imgRef.current.src = demoImages[frameTracker.frame];
          }
        },
      });
      timeline.add(imageTween, startTime); // 4. 14.5 시점에 시작
      
    }, sectionRef.current);
    
    return () => ctx.revert();
    
  }, [timeline, sectionDuration, startTime, endTime]); // endTime 추가

  return (
    // 5. 'sticky'를 제거하고, '악보'에서 계산된 '높이(height)'를 할당
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* 6. '소품'(Visuals)들만 'sticky'를 사용해 화면에 고정 */}
      <div className="sticky top-0 h-screen">
        <img 
          ref={imgRef}
          src={demoImages[0]}
          className="w-full h-full object-contain"
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