"use client";
import React from 'react';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import GradientText from '@/components/reactbits/GradientText';

interface Section5Props {
  items: { title: string; description: string }[];
  logos: { name: string; url: string }[];
  // ✅ [추가] 헤더 설명글을 받을 Prop 정의
  description: string; 
}

// ✅ [추가] description을 구조 분해 할당으로 받음
export function Section5_Impact({ items = [], logos = [], description }: Section5Props) {
  
  return (
    <section className="relative py-32 bg-black border-t border-white/10 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
         
         {/* --- 헤더 --- */}
         <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <GradientText
                 colors={["#06b6d4", "#ffffff", "#06b6d4", "#ffffff", "#06b6d4"]}
                 animationSpeed={6}
                 showBorder={false}
              >
                Global Impact
              </GradientText>
            </h2>
            {/* ✅ [수정] 하드코딩된 텍스트를 Prop으로 교체 */}
            {/* whitespace-pre-line: 데이터에 있는 \n을 줄바꿈으로 인식하되, 모바일 등 공간이 부족하면 자연스럽게 줄바꿈됨 */}
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed whitespace-pre-line">
              {description}
            </p>
         </div>
         
         {/* --- Bento Grid --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {items.map((item, idx) => {
              const isLarge = idx === 0 || idx === 3;
              return (
                <div key={idx} className={isLarge ? 'md:col-span-2' : ''}>
                  <SpotlightCard 
                    className="h-full p-10 flex flex-col justify-between"
                    spotlightColor="rgba(6, 182, 212, 0.2)"
                  >
                      <div>
                        <div className="text-cyan-500 mb-6 text-xl font-bold font-mono">0{idx + 1}</div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{item.title}</h3>
                      </div>
                      <p className="text-gray-400 text-base leading-relaxed mt-6">{item.description}</p>
                  </SpotlightCard>
                </div>
              );
            })}
         </div>

      </div>
    </section>
  );
}