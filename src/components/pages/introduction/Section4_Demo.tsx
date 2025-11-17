"use client";

// 1. Level 2 훅과 GSAP만 임포트합니다. (ImageSequenceCanvas 제거)
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

// (데모용 이미지 시퀀스 URL 배열은 동일)
const IMAGE_COUNT = 150;
const demoImages = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `/images/demo-sequence/${(i + 1).toString().padStart(4, '0')}.jpg`
);

export function Section4_Demo() {
  
  // 2. 'Level 2' 훅과 'Scope' ref를 사용합니다.
  const { timeline } = useScrollytelling();
  // 3. <canvas> 대신 <img> 태그에 ref를 연결합니다.
  const imgRef = useRef<HTMLImageElement>(null); 

  // 4. '악보'에 정의된 이 섹션의 마스터 타임라인 시점
  const startTime = 0.60; // 60%
  const duration = 0.10; // 10% (60% ~ 70%)

  // 5. GSAP 애니메이션을 'useLayoutEffect' (또는 useEffect)로 등록
  useLayoutEffect(() => {
    if (!timeline || !imgRef.current) return;

    // 6. 이미지 프레임을 추적할 가상 객체를 만듭니다.
    const frameTracker = { frame: 0 };

    // 7. 이 가상 객체의 'frame' 속성을 0에서 마지막 프레임까지 애니메이션합니다.
    const imageTween = gsap.to(frameTracker, {
      frame: demoImages.length - 1, // 0에서 149까지
      snap: "frame", // 프레임 번호(정수)로 값이 '딱' 떨어지게 함
      ease: "none", // 스크롤(scrub)이 타이밍을 제어하므로 ease는 없음
      
      // 8. 'frame' 값이 업데이트될 때마다(onUpdate) <img>의 src를 강제로 변경
      onUpdate: () => {
        if (imgRef.current) {
          imgRef.current.src = demoImages[frameTracker.frame];
        }
      },
    });

    // 9. 이 '이미지 시퀀스 트윈'을 마스터 타임라인에 '등록'합니다.
    timeline.add(imageTween, startTime);
    
  }, [timeline, duration, startTime]); // <-- 의존성 배열

  return (
    // 10. 핀(pin) 효과: '악보' 60%~70% 동안 화면에 고정
    <div className="h-screen sticky top-0">
      
      {/* 11. <canvas> 대신, 'ref'가 연결된 일반 <img> 렌더링 */}
      {/* src는 첫 번째 이미지로 설정 */}
      <img 
        ref={imgRef}
        src={demoImages[0]}
        className="w-full h-full object-contain"
      />

      {/* 12. 설명 캡션 (이 부분은 Level 1 <Animation>으로 수정하는 것이 좋습니다) */}
      <div className="absolute bottom-20 left-1-2 -translate-x-1/2 z-10">
        <p className="text-white text-lg text-shadow-lg bg-black/30 p-2 rounded-md">
          우리의 시뮬레이션은 이렇게 동작합니다.
        </p>
      </div>
    </div>
  );
}