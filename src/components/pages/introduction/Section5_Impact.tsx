"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

// Supabase의 'impact' 객체를 받음
export function Section5_Impact({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // 1. '악보'에 정의된 이 섹션의 마스터 타임라인 시점 (source: 1)
  const startTime = 0.70; // 70%
  const endTime = 0.90; // 90%
  const sectionDuration = endTime - startTime; // 20% (0.20)
  const items = content.items || [];

  // 2. Level 2 'Hook' 접근 방식
  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current || items.length === 0) return;

    const ctx = gsap.context(() => {
      // 3. 'Scope' 내부에서 고유한 클래스 이름으로 GSAP 대상들을 찾음
      const impactCards = gsap.utils.toArray<HTMLElement>('.impact-card');
      
      if (impactCards.length === 0) return;

      // 4. '악보'대로(source: 1) "항목들을 전체적으로 보여주고" (시작 시점에 모두 보이게 설정)
      timeline.fromTo(impactCards, 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, stagger: 0.1 }, // 70% 시점에 카드들이 순서대로 등장
        startTime
      );

      // 5. "하나씩 스크롤에따라 확대 축소" 애니메이션 등록 (source: 1)
      items.forEach((_, i: number) => {
        // 6. 각 아이템이 하이라이트될 '절대' 시작 시점을 계산
        const itemHighlightTime = startTime + (i * (sectionDuration / items.length));
        
        const tl = gsap.timeline();
        tl
          // 모든 카드를 흐리게/작게
          .to(impactCards, { opacity: 0.3, scale: 0.95, ease: 'power2.inOut' }, 0)
          // 현재 카드(i)만 하이라이트 (확대/선명)
          .to(impactCards[i], { opacity: 1, scale: 1.05, ease: 'power2.inOut' }, 0);
          
        // 7. 마스터 타임라인에 하이라이트 애니메이션 등록
        timeline.add(tl, itemHighlightTime);
      });

      // 8. 섹션이 끝날 때 모든 카드가 원래대로 돌아오도록 설정
      timeline.to(impactCards, 
        { opacity: 1, scale: 1, ease: 'power2.out' }, 
        endTime - (sectionDuration / items.length) // 마지막 아이템 구간에서 복구
      );

    }, sectionRef.current); // <-- 'Scope' 적용

    return () => ctx.revert();
  }, [timeline, items, startTime, sectionDuration]); // <-- 의존성 배열

  return (
    // 9. 핀(pin) 효과: '악보' 70%~90% 동안 화면에 고정 (source: 1)
    <div ref={sectionRef} className="h-screen sticky top-0 flex flex-col justify-center items-center p-8">
      {/* 섹션 제목 (Supabase 데이터 사용) */}
      <h2 className="absolute top-16 text-3xl font-bold text-primary z-20">
        {content.title || "Our Impact"}
      </h2>

      {/* 10. Impact 카드들을 그리드로 배치 (GSAP이 제어할 컨테이너) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        {items.map((item: any, index: number) => (
          // 이 컴포넌트는 SvgImageMorph가 필요 없음
          <div
            key={index}
            className="impact-card bg-card p-6 rounded-lg shadow-lg border border-border" // 고유 클래스
          >
            {/* Supabase 데이터 기반 렌더링 */}
            <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}