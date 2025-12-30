import React from 'react';

interface SvgImageMorphProps {
  imageUrls: string[];
  // '배우'가 GSAP으로 이미지를 찾을 수 있도록 클래스 이름을 받습니다.
  imageClassName?: string;
}

// ⬇️ GSAP, 훅, 로직이 모두 제거된 순수 UI 컴포넌트 ⬇️
export function SvgImageMorph({ imageUrls, imageClassName = "morph-image" }: SvgImageMorphProps) {
  if (imageUrls.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
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
            scale="0" // GSAP이 제어
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </defs>

      {imageUrls.map((url, index) => (
        <image
          key={url + index}
          href={url}
          x="0"
          y="0"
          width="100%"
          height="100%"
          className={imageClassName} // '배우'가 찾을 수 있는 클래스
          style={{ 
            filter: 'url(#displacement-filter)',
            opacity: 0, // GSAP이 제어
          }}
        />
      ))}
    </svg>
  );
}