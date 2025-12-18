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
        {/* 1. mb-24 -> mb-32: 카드와의 간격을 더 넓혔습니다. */}
        <div className="mb-32 text-center md:text-left">
          <h2 className="text-sm font-bold text-cyan-500 uppercase mb-4 tracking-[0.2em] pl-1">
            Our Core Capabilities
          </h2>
          
          {/* 2. 폰트 사이즈 조정: text-4xl md:text-6xl -> text-3xl md:text-5xl lg:text-6xl
                (화면이 줄어들면 글자도 작아져서 '한 줄'을 유지하도록 함)
             3. leading-[1.1] -> leading-normal: 줄 간격을 넉넉하게 풀어 글자 겹침 방지
             4. pb-4: 그라데이션 텍스트 하단(g, p 등)이 잘리지 않도록 하단 여백 추가
          */}
          <div className="text-3xl md:text-5xl lg:text-6xl font-bold leading-normal pb-4">
            <GradientText
              colors={["#06b6d4", "#ffffff", "#06b6d4", "#ffffff", "#06b6d4"]}
              animationSpeed={5}
              showBorder={false}
              className="block"
            >
              Advanced Simulation & Data-Driven Design
            </GradientText>
            
            <div></div>
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