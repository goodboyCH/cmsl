"use client";
import React from 'react';

// ReactBits Components
import GradientText from '@/components/reactbits/GradientText';
import TiltedCard from '@/components/reactbits/TiltedCard';

export function Section2_CoreCapabilites({ items }: { items: any[] }) {
  return (
    <section className="relative py-32 px-6 bg-black border-b border-white/10 overflow-hidden">
      <div className="container mx-auto max-w-7xl z-10 relative">
        
        {/* --- 헤더 영역 --- */}
        {/* 1. mb-48: 카드와의 간격을 아주 넓게(약 12rem) 벌렸습니다. */}
        <div className="mb-48 text-center md:text-left">
          <h2 className="text-sm font-bold text-cyan-500 uppercase mb-4 tracking-[0.2em] pl-1">
            Our Core Capabilities
          </h2>
          
          {/* 2. whitespace-nowrap: 무조건 한 줄로 나오게 강제합니다. (줄바꿈 금지)
             3. text-[...]: 화면 크기에 맞춰 폰트가 꽉 차게 나오도록 vw 단위나 적절한 크기 사용
             4. leading-relaxed: 줄 간격을 넉넉히 주어 글자 겹침 방지
          */}
          <div className="relative font-bold leading-relaxed whitespace-nowrap">
            {/* 폰트 크기: 모바일(2xl) -> 태블릿(4xl) -> PC(5xl) */}
            <div className="text-2xl md:text-4xl lg:text-5xl inline-block">
              <GradientText
                colors={["#06b6d4", "#ffffff", "#06b6d4", "#ffffff", "#06b6d4"]}
                animationSpeed={5}
                showBorder={false}
                className="block"
              >
                Advanced Simulation & Data-Driven Design
              </GradientText>
            </div>

            {/* 5. [요청하신 빈 줄] 텍스트 잘림 방지용 투명 공간
               - h-8: 높이를 2rem(32px)이나 주어서 확실하게 공간을 띄웁니다.
               - select-none: 드래그 안 되게 처리
            */}
            <div className="h-8 w-full select-none" aria-hidden="true">
              &nbsp;
            </div>
          </div>
        </div>

        {/* --- 그리드 영역 (TiltedCard) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-center">
              <TiltedCard
                imageSrc="https://placehold.co/400x500/18181b/18181b.png?text=+" 
                altText={item.title}
                captionText=""
                
                containerHeight="420px"
                containerWidth="100%"
                imageHeight="420px"
                imageWidth="100%"
                
                rotateAmplitude={10}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={false}
                
                displayOverlayContent={true}
                overlayContent={
                  <div className="w-full h-full p-8 flex flex-col bg-zinc-900/90 backdrop-blur-sm border border-white/5 rounded-[15px]">
                    <div>
                      {/* 아이콘 */}
                      <div className="mb-6 text-white p-4 bg-white/5 rounded-xl inline-block shadow-inner ring-1 ring-white/10">
                        {item.icon}
                      </div>
                      
                      {/* 제목 */}
                      <h4 className="text-xl font-bold text-white mb-4">
                        {item.title}
                      </h4>
                      
                      {/* 설명 */}
                      <p className="text-gray-400 leading-relaxed text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                }
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}