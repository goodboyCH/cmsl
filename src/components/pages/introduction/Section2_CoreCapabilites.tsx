"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

// 1. '소품'(Dumb UI) 컴포넌트 임포트
import { SvgImageMorph } from '../../SvgImageMorph';
import { ScrollyText_UI } from '../../ui/ScrollyText_UI';

// Supabase의 'capabilities' 객체를 받음
export function Section2_CoreCapabilites({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null); // 'Scope' 문제 해결용 ref

  // 2. '악보'에 정의된 이 섹션의 마스터 타임라인 시점
  const startTime = 0.05; // 5%
  const endTime = 0.30; // 30%
  const sectionDuration = endTime - startTime; // 25% (0.25)
  
  // '악보' 25% = 1000%의 25% = 250%. 즉, 250vh의 '높이'를 할당합니다.
  const sectionHeight = `${sectionDuration * 1000}vh`; // "250vh"
  const items = content.items || [];
  const imageList = items.map((item: any) => item.imageUrl);

  // 3. Level 2 'Hook' 접근 방식
  useLayoutEffect(() => {
    // 4. 가드: timeline, ref, data가 모두 준비되었는지 확인
    if (!timeline || !sectionRef.current || items.length === 0) return;

    // 5. 'Scope' 지정 (가장 중요)
    const ctx = gsap.context(() => {
      // 6. 'Scope' 내부에서 GSAP 대상들을 찾음
      const textSections = gsap.utils.toArray<HTMLElement>('.core-cap-text');
      const images = gsap.utils.toArray<SVGImageElement>('.core-cap-image');
      const displacementFilter = sectionRef.current?.querySelector('#displacement-filter feDisplacementMap');
      
      if (textSections.length === 0 || images.length === 0 || !displacementFilter) return;

      // 7. 첫 번째 항목은 즉시 보이도록 '마스터 타임라인'에 등록
      timeline.set(textSections[0], { opacity: 1, scale: 1, y: 0 }, startTime); // 5% 시점에 바로 등장
      timeline.set(images[0], { autoAlpha: 1 }, startTime);

      items.forEach((_, i: number) => {
        if (i === 0) return; // 0번은 이미 처리됨

        // 8. 각 아이템의 '절대' 시작 시점을 계산
        const itemStartTime = startTime + (i * (sectionDuration / items.length));
        
        // 9. 텍스트 전환 애니메이션 (로컬 타임라인)
        const textTL = gsap.timeline();
        textTL
          .to(textSections[i - 1], { opacity: 0, scale: 0.95, y: -30, duration: 0.4 })
          .fromTo(textSections[i], { opacity: 0, scale: 0.95, y: 30 }, 
                { opacity: 1, scale: 1, y: 0, duration: 0.4 }, 0);
        
        // 10. 이미지 모핑 애니메이션 (로컬 타임라인)
        const morphTL = gsap.timeline();
        morphTL
          .to(displacementFilter, { attr: { scale: 150 }, duration: 0.5 })
          .to(images[i - 1], { autoAlpha: 0 }, '<')
          .to(images[i], { autoAlpha: 1 }, '<')
          .to(displacementFilter, { attr: { scale: 0 }, duration: 0.5 });
          
        // 11. 로컬 타임라인을 마스터 타임라인의 '절대 시점'에 등록
        timeline.add(textTL, itemStartTime - 0.2); // 0.4초 애니메이션의 절반
        timeline.add(morphTL, itemStartTime - 0.5); // 1.0초 애니메이션의 절반
      });
    }, sectionRef.current); // <-- 'Scope' 적용

    return () => ctx.revert();
  }, [timeline, items, startTime, sectionDuration]); // <-- 의존성 배열

  return (
    // 12. 핀(pin) 효과: '악보' 5%~30% 동안 화면에 고정
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      
      {/* 2. '소품'(Visuals)들만 'sticky'를 사용해 화면에 고정시킵니다. */}
      <div className="sticky top-0 h-screen">
        <h2 className="absolute top-16 left-1/2 -translate-x-1/2 text-3xl font-bold text-primary z-20">
          {content.title}
        </h2>
        
        <SvgImageMorph imageUrls={imageList} imageClassName="core-cap-image" />

        <div className="absolute inset-0 z-10">
          {items.map((item: any, index: number) => (
            <ScrollyText_UI
              key={index}
              item={item}
              className={`core-cap-text`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}