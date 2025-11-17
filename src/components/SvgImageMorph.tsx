import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
// 1. ScrollTrigger 임포트 제거
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 2. useScrollytelling 훅 임포트
import { useScrollytelling } from '@bsmnt/scrollytelling';

// 3. props 인터페이스 변경 (sectionRefs -> allItems)
interface SvgImageMorphProps {
  imageUrls: string[];
  allItems: any[]; // <-- sectionRefs 대신 allItems 받기
}

export function SvgImageMorph({ imageUrls, allItems }: SvgImageMorphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // 4. <Scrollytelling.Root>의 메인 타임라인 가져오기
  const { timeline } = useScrollytelling();

  useLayoutEffect(() => {
    // 5. timeline이 준비되었는지, allItems가 있는지 확인
    if (!svgRef.current || !timeline || allItems.length === 0 || imageUrls.length === 0) return;

    // (GSAP 대상 선택은 동일)
    const images = gsap.utils.toArray<SVGImageElement>('.morph-image');
    const displacementFilter = svgRef.current.querySelector('#displacement-filter feDisplacementMap');
    
    // (첫 번째 이미지 보이게 설정하는 것은 동일)
    gsap.set(images[0], { autoAlpha: 1 });
    gsap.set(images.slice(1), { autoAlpha: 0 });

    const ctx = gsap.context(() => {
      
      // 6. sectionRefs 대신 allItems의 인덱스를 기준으로 순회
      allItems.forEach((_, i) => {
        // 마지막 이미지는 다음으로 전환할 것이 없으므로 제외
        if (i >= images.length - 1) return; 
        
        const prevImage = images[i];
        const currentImage = images[i + 1];

        // 7. 모핑 효과 자체를 정의하는 '로컬' 타임라인 생성 (ScrollTrigger 없음)
        const morphTL = gsap.timeline();
        morphTL
          .to(displacementFilter, { attr: { scale: 150 }, duration: 0.5 })
          .to(prevImage, { autoAlpha: 0, duration: 0.5 }, '<') // 이전 이미지 숨김
          .to(currentImage, { autoAlpha: 1, duration: 0.5 }, '<') // 다음 이미지 표시
          .to(displacementFilter, { attr: { scale: 0 }, duration: 0.5 });
        // (이 로컬 타임라인의 총 길이는 1.0초)

        // 8. 이 모핑(morphTL)이 시작될 '시점'을 계산 (메인 타임라인 기준)
        const totalItems = allItems.length;
        // (i+1)번째 아이템(텍스트)이 시작하는 시간과 일치시킴
        const transitionTime = (1 / totalItems) * (i + 1); 

        // 9. 메인 타임라인(timeline)에 로컬 타임라인(morphTL)을 '추가'
        //    전환 시점(transitionTime) 0.5초 '전'에 모핑을 시작해서
        //    전환 시점에 정확히 이미지 교체가 일어나도록 함.
        timeline.add(morphTL, transitionTime - 0.5);
      });

    }, svgRef); // 이 컴포넌트 내부에서만 gsap 작동

    return () => ctx.revert(); // 컴포넌트 unmount 시 정리

  }, [imageUrls, allItems, timeline]); // 10. 의존성 배열에 timeline 추가

  if (imageUrls.length === 0) return null;

  return (
    // (SVG 렌더링 로직은 변경 없음)
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
            opacity: 0, // GSAP이 제어하므로 기본값 0
          }}
        />
      ))}
    </svg>
  );
}