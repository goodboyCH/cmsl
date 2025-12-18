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
          <h2 className="text-sm font-bold text-cyan-500 uppercase mb-4 tracking-[0.2em] pl-1">
            Our Core Capabilities
          </h2>
          
          <div className="text-3xl md:text-6xl font-bold leading-[1.1]">
            {/* GradientText 적용: Cyan <-> White 순환 */}
            <GradientText
              colors={["#06b6d4", "#ffffff", "#06b6d4", "#ffffff", "#06b6d4"]}
              animationSpeed={5}
              showBorder={false}
              className="block"
            >
              Advanced Simulation & Data-Driven Design
            </GradientText>
            
            {/* 두 번째 줄은 은은하게 처리하거나 동일하게 적용 */}
            <div>
    
            </div>
          </div>
        </div>

        {/* --- 그리드 영역 (TiltedCard) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-center">
              <TiltedCard
                // 1. 배경 이미지 설정 (카드의 '몸체' 역할)
                // 어두운 질감의 이미지를 사용하거나, 투명 이미지를 쓰고 Overlay에 배경색을 줘도 됩니다.
                // 여기서는 깔끔한 다크 그라데이션 배경을 위해 투명 이미지를 쓰고 Overlay 스타일로 제어합니다.
                imageSrc="https://placehold.co/400x500/18181b/18181b.png?text=+" 
                altText={item.title}
                captionText="" // 캡션은 사용하지 않음
                
                // 2. 크기 설정
                containerHeight="420px"
                containerWidth="100%"
                imageHeight="420px"
                imageWidth="100%"
                
                // 3. 애니메이션 설정
                rotateAmplitude={10} // 회전 반경 (12는 너무 클 수 있어 10으로 조정)
                scaleOnHover={1.05}  // 호버 시 확대
                showMobileWarning={false}
                showTooltip={false}
                
                // 4. 오버레이 컨텐츠 (실제 내용)
                displayOverlayContent={true}
                overlayContent={
                  <div className="w-full h-full p-8 flex flex-col justify-between bg-zinc-900/90 backdrop-blur-sm border border-white/5 rounded-[15px]">
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