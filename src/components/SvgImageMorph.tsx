import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SvgImageMorphProps {
  imageUrls: string[];
  scrollTriggerRef: React.RefObject<HTMLDivElement>;
}

export function SvgImageMorph({ imageUrls, scrollTriggerRef }: SvgImageMorphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useLayoutEffect(() => {
    if (!svgRef.current || !scrollTriggerRef.current || imageUrls.length < 2) return;

    const images = gsap.utils.toArray<SVGImageElement>('.morph-image');
    const displacementFilter = svgRef.current.querySelector('#displacement-filter feDisplacementMap');
    
    // 첫 번째 이미지를 제외하고 모두 숨김
    gsap.set(images.slice(1), { autoAlpha: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTriggerRef.current, // IntroductionPage의 스크롤 영역
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5, // 스크롤을 부드럽게 따라옴
        }
      });

      // 이미지를 순차적으로 전환
      imageUrls.forEach((url, i) => {
        if (i === 0) return; // 첫 번째 이미지는 건너뜀
        
        const prevImage = images[i - 1];
        const currentImage = images[i];
        
        // 1. 왜곡 필터(displacement) 강도를 0 -> 200 -> 0 으로 변경
        tl.to(displacementFilter, { attr: { scale: 200 }, duration: 0.5 }, '+=0.5')
          // 2. 필터가 최대일 때, 이전 이미지를 숨기고 새 이미지를 표시
          .set(prevImage, { autoAlpha: 0 })
          .set(currentImage, { autoAlpha: 1 })
          // 3. 필터 강도를 다시 0으로
          .to(displacementFilter, { attr: { scale: 0 }, duration: 0.5 });
      });
    }, svgRef); // 이 컴포넌트 내부에서만 gsap 작동

    return () => ctx.revert(); // 컴포넌트 unmount 시 정리

  }, [imageUrls, scrollTriggerRef]);

  if (imageUrls.length === 0) return null;

  return (
    // SVG 필터와 이미지를 렌더링
    <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="displacement-filter">
          {/* 'displacement-1.jpg' 파일이 변위 맵 역할을 합니다.
            이 파일이 /public/textures/에 반드시 있어야 합니다.
          */}
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* 이미지를 SVG 내부에 렌더링하고 필터를 적용 */}
      {imageUrls.map((url, index) => (
        <image
          key={url + index}
          href={url} // 이미지 URL
          x="0"
          y="0"
          width="100%"
          height="100%"
          className="morph-image"
          style={{ 
            filter: 'url(#displacement-filter)', // 모핑 필터 적용
            opacity: index === 0 ? 1 : 0 // 기본값: 첫 이미지만 표시
          }}
        />
      ))}
    </svg>
  );
}