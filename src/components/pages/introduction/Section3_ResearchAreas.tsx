"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';
import { SvgImageMorph } from '../../SvgImageMorph';
import { ScrollyText_UI } from '../../ui/ScrollyText_UI';

export function Section3_ResearchAreas({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // '악보' 시점
  const startTime = 0.30; // 30%
  const endTime = 0.60; // 60%
  const sectionDuration = endTime - startTime; // 30% (0.30)
  // '악보' 30% = 1000%의 30% = 300vh '높이'
  const sectionHeight = `${sectionDuration * 1000}vh`; // "300vh"

  const items = content.items || [];
  const imageList = items.map((item: any) => item.imageUrl);

  useLayoutEffect(() => {
    // (GSAP 로직은 동일하게 유지됩니다. 수정 필요 없음)
    if (!timeline || !sectionRef.current || items.length === 0) return;
    const ctx = gsap.context(() => {
      const textSections = gsap.utils.toArray<HTMLElement>('.research-text', sectionRef.current);
      const images = gsap.utils.toArray<SVGImageElement>('.research-image', sectionRef.current);
      const displacementFilter = sectionRef.current?.querySelector('#displacement-filter feDisplacementMap');
      if (textSections.length === 0 || images.length === 0 || !displacementFilter) return;
      
      timeline.set(textSections[0], { opacity: 1, scale: 1, y: 0 }, startTime);
      timeline.set(images[0], { autoAlpha: 1 }, startTime);
      items.forEach((_, i: number) => {
        if (i === 0) return;
        const itemStartTime = startTime + (i * (sectionDuration / items.length));
        const textTL = gsap.timeline();
        textTL.to(textSections[i-1], { opacity: 0, scale: 0.95, y: -30, duration: 0.4 }).fromTo(textSections[i], { opacity: 0, scale: 0.95, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.4 }, 0);
        const morphTL = gsap.timeline();
        morphTL.to(displacementFilter, { attr: { scale: 150 }, duration: 0.5 }).to(images[i - 1], { autoAlpha: 0 }, '<').to(images[i], { autoAlpha: 1 }, '<').to(displacementFilter, { attr: { scale: 0 }, duration: 0.5 });
        timeline.add(textTL, itemStartTime - 0.2);
        timeline.add(morphTL, itemStartTime - 0.5);
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, [timeline, items, startTime, sectionDuration]);

  return (
    // 1. 'sticky'를 제거하고, '악보'에서 계산된 '높이(height)'를 할당
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* 2. '소품'(Visuals)들만 'sticky'를 사용해 화면에 고정 */}
      <div className="sticky top-0 h-screen">
        <h2 className="absolute top-16 left-1/2 -translate-x-1/2 text-3xl font-bold text-primary z-20">
          {content.title}
        </h2>
        <SvgImageMorph imageUrls={imageList} imageClassName="research-image" />
        <div className="absolute inset-0 z-10">
          {items.map((item: any, index: number) => (
            <ScrollyText_UI
              key={index}
              item={item}
              className={`research-text`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}