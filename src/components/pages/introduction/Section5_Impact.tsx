"use client";
import React from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface Section5Props {
  items: { title: string; description: string }[];
  logos: { name: string; url: string }[];
}

export function Section5_Impact({ items = [], logos = [] }: Section5Props) {
  return (
    <section className="relative py-40 bg-gradient-to-b from-black to-zinc-950 border-t border-white/5">
      <div className="container mx-auto px-6">
         
         <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Global Impact
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              우리의 연구는 실험실을 넘어, 실제 산업과 환경에<br className="hidden md:block"/> 
              구체적이고 측정 가능한 변화를 만들어내고 있습니다.
            </p>
         </div>
         
         {/* Cards Grid */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {items.map((item, idx) => {
              const isLarge = idx === 0 || idx === 3;
              
              return (
                <SpotlightCard 
                  key={idx} 
                  // 1. font-mono 제거 -> 글로벌 폰트 적용
                  // 2. backdrop-blur 제거 및 배경색 불투명하게(zinc-900) 변경 -> 가독성 해결
                  className={`
                    flex flex-col justify-between text-left border border-white/10 p-8
                    ${isLarge ? 'md:col-span-2' : ''}
                    bg-zinc-900 text-white shadow-xl z-10
                  `}
                >
                    <div className="relative z-10">
                      {/* 번호 스타일: 폰트 유지하되 색상만 포인트 */}
                      <div className="text-cyan-500 mb-6 text-xl font-bold border-l-4 border-cyan-500 pl-3">
                        0{idx + 1}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                        {item.title}
                      </h3>
                    </div>
                    {/* 설명 텍스트: 회색조 밝게 조정 */}
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-8 relative z-10 font-normal">
                      {item.description}
                    </p>
                </SpotlightCard>
              );
            })}
         </div>

         {/* Partners Section */}
         <div className="mt-40 pt-16 border-t border-white/10">
            <p className="text-center text-gray-500 mb-12 text-sm font-bold uppercase tracking-widest">
              Trusted Partners
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70">
              {logos.map((logo, idx) => (
                <div key={idx} className="group relative transition-all duration-300 hover:opacity-100">
                    <img 
                      src={logo.url} 
                      alt={logo.name} 
                      className="h-8 md:h-12 w-auto object-contain brightness-0 invert group-hover:scale-110 transition-transform duration-500" 
                    />
                </div>
              ))}
            </div>
         </div>

      </div>
    </section>
  );
}