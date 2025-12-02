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
         <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">Global Impact</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              우리의 연구는 실험실을 넘어, 실제 산업과 환경에 구체적이고 측정 가능한 변화를 만들어내고 있습니다.
            </p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {items.map((item, idx) => {
              const isLarge = idx === 0 || idx === 3;
              return (
                <SpotlightCard 
                  key={idx} 
                  className={`
                    flex flex-col justify-between text-left border border-white/10 p-8
                    ${isLarge ? 'md:col-span-2' : ''}
                    /* 📉 [최적화] blur 제거하고 투명도(alpha)만 사용 -> 성능 대폭 향상 */
                    bg-zinc-900/60 backdrop-blur-sm 
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
                </SpotlightCard>
              );
            })}
         </div>

         <div className="mt-40 pt-16 border-t border-white/5">
            <p className="text-center text-gray-600 mb-12 text-xs md:text-sm uppercase tracking-[0.3em] font-mono">
              Trusted Partners
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60">
              {logos.map((logo, idx) => (
                <div key={idx} className="group relative transition-all duration-300 hover:opacity-100">
                    <img 
                      src={logo.url} 
                      alt={logo.name} 
                      className="h-8 md:h-12 w-auto object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-500" 
                    />
                </div>
              ))}
            </div>
         </div>
      </div>
    </section>
  );
}