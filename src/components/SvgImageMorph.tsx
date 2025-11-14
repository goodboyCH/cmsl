import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 1. GSAP에 ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

interface SvgImageMorphProps {
  imageUrls: string[];
  scrollTriggerRef: React.RefObject<HTMLDivElement>; // 스크롤 기준이 될 부모
}

export function SvgImageMorph({ imageUrls, scrollTriggerRef }: SvgImageMorphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useLayoutEffect(() => {
    // 2. DOM 요소들이 준비되었는지 확인
    if (!svgRef.current || !scrollTriggerRef.current || imageUrls.length < 2) return;

    // 3. GSAP이 제어할 대상들을 선택
    const images = gsap.utils.toArray<SVGImageElement>('.morph-image');
    const displacementFilter = svgRef.current.querySelector('#displacement-filter feDisplacementMap');
    
    // 첫 번째 이미지를 제외하고 모두 숨김
    gsap.set(images.slice(1), { autoAlpha: 0 });

    // 4. GSAP 컨텍스트 생성 (unmount 시 자동 정리)
    const ctx = gsap.context(() => {
      // 5. 스크롤에 연결된 타임라인 생성
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTriggerRef.current, // IntroductionPage의 스크롤 영역
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5, // 1.5초 지연으로 부드럽게 스크롤을 따라옴
        }
      });

      // 6. 이미지를 순차적으로 모핑하며 전환
      imageUrls.forEach((url, i) => {
        if (i === 0) return; // 첫 번째 이미지는 건너뜀
        
        const prevImage = images[i - 1];
        const currentImage = images[i];
        
        // 7. 모핑 애니메이션 정의
        tl
          // A: 왜곡 필터 강도를 0 -> 150으로 (이미지가 일그러짐)
          .to(displacementFilter, { attr: { scale: 150 }, duration: 0.4 }, `+=${i === 1 ? 0.2 : 0.8}`) // 첫 전환은 빠르게, 다음부턴 여유있게
          // B: 필터가 최대일 때, 이미지를 교체 (opacity 0 -> 1)
          .to(prevImage, { autoAlpha: 0, duration: 0.4 }, '<')
          .to(currentImage, { autoAlpha: 1, duration: 0.4 }, '<')
          // C: 왜곡 필터 강도를 150 -> 0으로 (새 이미지로 안정화)
          .to(displacementFilter, { attr: { scale: 0 }, duration: 0.4 });
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
          {/* displacement-1.jpg 파일 대신, SVG가 직접 노이즈를 생성합니다.
              이제 텍스처 파일이 없어도 100% 작동합니다.
          */}
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.01 0.03" 
            numOctaves="2" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="0" // GSAP이 이 'scale' 값을 애니메이션합니다.
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
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