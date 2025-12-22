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
        <div className="mb-24 text-center md:text-left">
          <h2 className="text-sm md:text-base font-bold text-cyan-500 uppercase mb-4 tracking-[0.2em] pl-1">
            Our Core Capabilities
          </h2>
          
          <div className="relative font-bold leading-tight whitespace-normal md:whitespace-nowrap">
            {/* ✅ [수정] clamp()를 사용하여 화면 폭에 비례해 폰트 크기가 부드럽게 조절되도록 변경 */}
            {/* 최소 2rem(32px) ~ 최대 5rem(80px) 사이에서 5.5vw 비율로 유지 */}
            <div className="text-[clamp(2rem,5.5vw,5rem)] inline-block">
              <GradientText
                colors={["#06b6d4", "#ffffff", "#06b6d4", "#ffffff", "#06b6d4"]}
                animationSpeed={5}
                showBorder={false}
                className="block"
              >
                Advanced Simulation & Data-Driven Design
              </GradientText>
            </div>

            <div className="h-4 md:h-8 w-full select-none" aria-hidden="true">
              &nbsp;
            </div>
          </div>
        </div>

        {/* --- 그리드 영역 --- */}
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