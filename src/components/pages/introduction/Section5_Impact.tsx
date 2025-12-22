"use client";
import React from 'react';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import GradientText from '@/components/reactbits/GradientText';

interface Section5Props {
  items: { 
    title: string; 
    description: string;
    // icon Prop 제거됨
  }[];
  logos: { name: string; url: string }[];
  description: string; 
}

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
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed whitespace-pre-line">
              {description}
            </p>
         </div>
         
         {/* --- Bento Grid (3x2 Layout) --- */}
         {/* lg:grid-cols-3 으로 변경하여 6개 아이템이 3개씩 2줄로 꽉 차게 배치됨 */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {items.map((item, idx) => {
              return (
                <div key={idx} className="h-full">
                  <SpotlightCard 
                    className="h-full p-8 flex flex-col justify-between group"
                    spotlightColor="rgba(6, 182, 212, 0.15)"
                  >
                      <div>
                        {/* 번호 강조 */}
                        <div className="text-cyan-500/50 text-xl font-bold font-mono mb-6">
                            0{idx + 1}
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-100 transition-colors">
                            {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-4 border-t border-white/5 pt-4">
                        {item.description}
                      </p>
                  </SpotlightCard>
                </div>
              );
            })}
         </div>

      </div>
    </section>
  );
}