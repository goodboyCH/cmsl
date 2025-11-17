"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

// 1. '소품'(Dumb UI) 컴포넌트 임포트 (동일)
import { SvgImageMorph } from '../../SvgImageMorph';
import { ScrollyText_UI } from '../../ui/ScrollyText_UI';

// Supabase의 'research' 객체를 받음
export function Section3_ResearchAreas({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null); // 'Scope' 문제 해결용 ref

  // 2. '악보'에 정의된 이 섹션의 마스터 타임라인 시점 (수정됨)
  const startTime = 0.30; // 30%
  const endTime = 0.60; // 60%
  const sectionDuration = endTime - startTime; // 30% (0.30)
  const items = content.items || [];
  const imageList = items.map((item: any) => item.imageUrl);

  // 3. Level 2 'Hook' 접근 방식
  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current || items.length === 0) return;

    const ctx = gsap.context(() => {
      // 4. 'Scope' 내부에서 고유한 클래스 이름으로 GSAP 대상들을 찾음 (수정됨)
      const textSections = gsap.utils.toArray<HTMLElement>('.research-text');
      const images = gsap.utils.toArray<SVGImageElement>('.research-image');
      const displacementFilter = sectionRef.current?.querySelector('#displacement-filter feDisplacementMap');
      
      if (textSections.length === 0 || images.length === 0 || !displacementFilter) return;

      // 5. 첫 번째 항목은 'startTime' (30%)에 보이도록 등록
      timeline.set(textSections[0], { opacity: 1, scale: 1, y: 0 }, startTime);
      timeline.set(images[0], { autoAlpha: 1 }, startTime);

      items.forEach((_, i: number) => {
        if (i === 0) return; 

        // 6. 각 아이템의 '절대' 시작 시점을 계산 (30% ~ 60% 사이)
        const itemStartTime = startTime + (i * (sectionDuration / items.length));
        
        // 7. 텍스트 전환 애니메이션 (로컬 타임라인)
        const textTL = gsap.timeline();
        textTL
          .to(textSections[i - 1], { opacity: 0, scale: 0.95, y: -30, duration: 0.4 })
          .fromTo(textSections[i], { opacity: 0, scale: 0.95, y: 30 }, 
                { opacity: 1, scale: 1, y: 0, duration: 0.4 }, 0);
        
        // 8. 이미지 모핑 애니메이션 (로컬 타임라인)
        const morphTL = gsap.timeline();
        morphTL
          .to(displacementFilter, { attr: { scale: 150 }, duration: 0.5 })
          .to(images[i - 1], { autoAlpha: 0 }, '<')
          .to(images[i], { autoAlpha: 1 }, '<')
          .to(displacementFilter, { attr: { scale: 0 }, duration: 0.5 });
          
        // 9. 로컬 타임라인을 마스터 타임라인의 '절대 시점'에 등록
        timeline.add(textTL, itemStartTime - 0.2);
        timeline.add(morphTL, itemStartTime - 0.5);
      });
    }, sectionRef.current); // <-- 'Scope' 적용

    return () => ctx.revert();
  }, [timeline, items, startTime, sectionDuration]); // <-- 의존성 배열

  return (
    // 10. 핀(pin) 효과: '악보' 30%~60% 동안 화면에 고정
    <div ref={sectionRef} className="h-screen sticky top-0">
      {/* 섹션 제목 (Supabase 데이터 사용) */}
      <h2 className="absolute top-16 left-1/2 -translate-x-1/2 text-3xl font-bold text-primary z-20">
        {content.title}
      </h2>

      {/* '소품' 렌더링: '배우'가 찾을 수 있도록 고유한 클래스 이름 전달 (수정됨) */}
      <SvgImageMorph imageUrls={imageList} imageClassName="research-image" />

      {/* '소품' 렌더링: 텍스트 UI */}
      <div className="absolute inset-0 z-10">
        {items.map((item: any, index: number) => (
          <ScrollyText_UI
            key={index}
            item={item}
            className={`research-text`} // 고유한 클래스 (수정됨)
          />
        ))}
      </div>
    </div>
  );
}