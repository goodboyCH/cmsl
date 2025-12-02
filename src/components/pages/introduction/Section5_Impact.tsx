"use client";
import React from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export function Section5_Impact({ content }: { content: any }) {
  const items = content.items || [];
  const logos = content.logos || [];

  return (
    <section className="relative py-40 bg-gradient-to-b from-black to-zinc-900">
      <div className="container mx-auto px-6">
         
         <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">Global Impact</h2>
            <p className="text-gray-500">우리의 연구가 세상에 미치는 영향</p>
         </div>
         
         {/* Bento Grid Layout */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto auto-rows-[minmax(250px,auto)]">
            
            {/* Impact Items */}
            {items.map((item: any, idx: number) => (
              <SpotlightCard 
                key={idx} 
                // 첫 번째와 네 번째 아이템은 크게(2칸 차지) 배치
                className={`p-8 flex flex-col justify-between text-left border border-white/5
                  ${(idx === 0 || idx === 3) ? 'md:col-span-2 bg-zinc-900/50' : 'bg-black'}
                `}
              >
                  <div>
                    <div className="text-cyan-500 mb-4 text-xl font-mono">0{idx + 1}</div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{item.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mt-4">{item.description}</p>
              </SpotlightCard>
            ))}

         </div>

         {/* Partners Section (하단 통합) */}
         <div className="mt-32 pt-16 border-t border-white/5">
            <p className="text-center text-gray-600 mb-10 text-sm uppercase tracking-[0.3em]">
              Trusted Partners
            </p>
            
            {/* 흐르는 로고 or 깔끔한 그리드 */}
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50">
              {logos.map((logo: any, idx: number) => (
                <div key={idx} className="group relative">
                    <img 
                      src={logo.url} 
                      alt={logo.name} 
                      className="h-8 md:h-12 invert transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 grayscale group-hover:grayscale-0" 
                    />
                </div>
              ))}
            </div>
         </div>

      </div>
    </section>
  );
}