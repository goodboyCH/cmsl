import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SvgImageMorphProps {
  imageUrls: string[];
  sectionRefs: React.RefObject<HTMLDivElement>[]; // 1. props 변경
}

export function SvgImageMorph({ imageUrls, sectionRefs }: SvgImageMorphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useLayoutEffect(() => {
    // 2. DOM 요소들이 준비되었는지 확인
    if (!svgRef.current || sectionRefs.length === 0 || imageUrls.length === 0) return;

    // 3. GSAP이 제어할 대상들을 선택
    const images = gsap.utils.toArray<SVGImageElement>('.morph-image');
    const displacementFilter = svgRef.current.querySelector('#displacement-filter feDisplacementMap');
    
    // 첫 번째 이미지만 보이게 설정
    gsap.set(images[0], { autoAlpha: 1 });
    gsap.set(images.slice(1), { autoAlpha: 0 });

    // 4. GSAP 컨텍스트 생성
    const ctx = gsap.context(() => {
      
      // 5. 각 섹션의 경계마다 ScrollTrigger를 생성
      sectionRefs.forEach((sectionRef, i) => {
        // 이미지가 더 이상 없으면(마지막 섹션) 애니메이션 없음
        if (i >= images.length - 1) return; 
        
        const prevImage = images[i];
        const currentImage = images[i + 1];

        // 6. 각 섹션이 화면 상단에 닿을 때 모핑 애니메이션 타임라인 생성
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current, // 기준: 각 섹션 div
            start: 'bottom top', // 섹션의 바닥이 뷰포트 상단에 닿을 때
            end: '+=300', // 300px 스크롤 동안 모핑 진행
            scrub: 1, // 스크롤에 부드럽게 연동
          }
        });

        // 7. 모핑 애니메이션 정의
        tl
          // A: 왜곡 필터 강도를 0 -> 150으로
          .to(displacementFilter, { attr: { scale: 150 }, duration: 0.5 })
          // B: 필터가 최대일 때, 이미지를 교체
          .to(prevImage, { autoAlpha: 0, duration: 0.5 }, '<') // 이전 이미지 숨김
          .to(currentImage, { autoAlpha: 1, duration: 0.5 }, '<') // 다음 이미지 표시
          // C: 왜곡 필터 강도를 150 -> 0으로
          .to(displacementFilter, { attr: { scale: 0 }, duration: 0.5 });
      });

    }, svgRef); // 이 컴포넌트 내부에서만 gsap 작동

    return () => ctx.revert(); // 컴포넌트 unmount 시 정리

  }, [imageUrls, sectionRefs]); // 8. 의존성 배열 수정

  if (imageUrls.length === 0) return null;

  return (
    // SVG 필터와 이미지를 렌더링
    <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="displacement-filter">
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
            opacity: 0, // 9. GSAP이 제어하므로 기본값 0 (useLayoutEffect에서 0번만 1로 설정)
          }}
        />
      ))}
    </svg>
  );
}