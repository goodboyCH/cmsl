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
        <div className="mb-48 text-center md:text-left">
          <h2 className="text-sm font-bold text-cyan-500 uppercase mb-4 tracking-[0.2em] pl-1">
            Our Core Capabilities
          </h2>
          
          {/* 1. 폰트 크기 조절: text-[28px] 
               - 2xl(24px)와 3xl(30px)의 중간 정도 크기입니다.
               - md(태블릿) 이상에서는 text-4xl, lg(PC)에서는 text-5xl로 커지게 반응형 유지
            2. leading-relaxed: 줄 간격 넉넉하게
          */}
          <div className="text-[28px] md:text-4xl lg:text-5xl font-bold leading-relaxed">
            <GradientText
              colors={["#06b6d4", "#ffffff", "#06b6d4", "#ffffff", "#06b6d4"]}
              animationSpeed={5}
              showBorder={false}
              className="block"
            >
              Advanced Simulation & Data-Driven Design
            </GradientText>
            
            {/* 3. [요청하신 부분] 텍스트 잘림 방지용 '빈 줄' 추가 
               - 패딩 대신 물리적인 공간을 차지하는 투명한 줄을 넣어 
                 그라데이션 텍스트의 하단(g, p 등)이 잘리지 않게 합니다.
            */}
            <div className="h-4 select-none">&nbsp;</div>
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