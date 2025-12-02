"use client";
import React from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface Section5Props {
  items: { title: string; description: string }[];
  logos: { name: string; url: string }[];
}

export function Section5_Impact({ items = [], logos = [] }: Section5Props) {
  
  return (
    <section className="relative py-40 bg-gradient-to-b from-black to-zinc-900 border-t border-white/5">
      <div className="container mx-auto px-6">
         
         {/* 헤더 */}
         <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Global Impact
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              우리의 연구는 실험실을 넘어, 실제 산업과 환경에<br className="hidden md:block"/> 
              구체적이고 측정 가능한 변화를 만들어내고 있습니다.
            </p>
         </div>
         
         {/* Bento Grid Layout */}
         {/* auto-rows를 사용하여 높이를 균형 있게 맞춥니다. */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            
            {items.map((item, idx) => {
              // 첫 번째(0)와 네 번째(3) 아이템을 2칸(col-span-2) 차지하게 하여 리듬감을 줍니다.
              const isLarge = idx === 0 || idx === 3;
              
              return (
                <SpotlightCard 
                  key={idx} 
                  className={`
                    flex flex-col justify-between text-left border border-white/10 p-8
                    ${isLarge ? 'md:col-span-2 bg-zinc-900/40' : 'bg-black/60'}
                  `}
                >
                    <div className="relative z-10">
                      <div className="text-cyan-500 mb-6 text-xl font-mono border-l-2 border-cyan-500 pl-3">
                        0{idx + 1}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-8 relative z-10">
                      {item.description}
                    </p>
                    
                    {/* 장식용 배경 텍스트 (은은하게) */}
                    <div className="absolute right-4 bottom-4 text-6xl font-bold text-white/5 pointer-events-none select-none">
                      {idx + 1}
                    </div>
                </SpotlightCard>
              );
            })}

         </div>

         {/* Partners Section (하단 통합) */}
         <div className="mt-40 pt-16 border-t border-white/5">
            <p className="text-center text-gray-600 mb-12 text-xs md:text-sm uppercase tracking-[0.3em] font-mono">
              Trusted Partners & Collaborators
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60">
              {logos.map((logo, idx) => (
                <div key={idx} className="group relative transition-all duration-300 hover:opacity-100">
                    {/* 로고 이미지가 흰색(invert)으로 보이도록 설정 (배경이 어두우므로) */}
                    {/* 실제 로고 이미지가 유색이라면 grayscale 등을 추가 조정하세요 */}
                    <img 
                      src={logo.url} 
                      alt={logo.name} 
                      className="h-8 md:h-12 w-auto object-contain brightness-0 invert opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                    />
                </div>
              ))}
            </div>
         </div>

      </div>
    </section>
  );
}