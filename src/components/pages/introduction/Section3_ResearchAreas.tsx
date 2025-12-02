"use client";
import React from 'react';
import { CipherImage } from '@/components/ui/CipherImage';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function Section3_ResearchAreas({ content }: { content: any }) {
  const items = content.items || [];

  return (
    <section className="relative py-32 bg-zinc-950">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-24 text-right flex items-center justify-end gap-4">
          <span className="w-20 h-1 bg-cyan-500 block"></span>
          Research Areas
        </h2>

        <div className="space-y-32">
          {items.map((item: any, idx: number) => (
            <div 
              key={idx} 
              className={`flex flex-col md:flex-row gap-12 md:gap-20 items-center ${
                idx % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* 이미지 영역: 암호화 해독 효과 */}
              <div className="w-full md:w-1/2 aspect-[16/9] relative rounded-lg overflow-hidden border border-white/10 bg-zinc-900">
                {/* CipherImage 사용: 이미지가 노이즈와 함께 등장 */}
                <CipherImage 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                />
                
                {/* 장식용 코너 UI */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-500"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-cyan-500"></div>
                <div className="absolute top-4 right-4 font-mono text-xs text-cyan-500">SYS_IMG_0{idx+1}</div>
              </div>

              {/* 텍스트 영역 */}
              <div className="w-full md:w-1/2 space-y-6">
                <div className="text-cyan-500 font-mono text-sm tracking-widest">
                  AREA 0{idx + 1}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-loose text-lg">
                  {item.description}
                </p>
                <MagneticButton>
                   <span className="inline-block border-b border-cyan-500 text-cyan-400 pb-1 cursor-pointer hover:text-white hover:border-white transition-colors">
                     View Research Detail &rarr;
                   </span>
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}