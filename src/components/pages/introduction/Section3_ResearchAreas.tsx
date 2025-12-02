"use client";
import React from 'react';
import { CipherImage } from '@/components/ui/CipherImage';
import { MagneticButton } from '@/components/ui/MagneticButton';

// ⭐️ 안전장치: Supabase 문자열 -> 실제 아이콘 컴포넌트 매핑
import { Cpu, Atom, FlaskConical, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users, Network } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  "Cpu": <Cpu />, "Atom": <Atom />, "FlaskConical": <FlaskConical />, 
  "TestTube2": <TestTube2 />, "BrainCircuit": <BrainCircuit />, "Car": <Car />, 
  "Film": <Film />, "HeartPulse": <HeartPulse />, "Magnet": <Magnet />, 
  "Building": <Building />, "Users": <Users />,
  "default": <Network /> // 매칭되는 게 없을 때 기본 아이콘
};

export function Section3_ResearchAreas({ content, loading }: { content: any, loading: boolean }) {
  const items = Array.isArray(content?.items) ? content.items : [];

  return (
    <section className="relative py-32 bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* 헤더 */}
        <div className="flex justify-end items-center gap-4 mb-24">
          <div className="text-right">
             <h2 className="text-3xl md:text-5xl font-bold text-white">
               {content.title || "Research Areas"}
             </h2>
             {loading && <p className="text-sm text-cyan-500 animate-pulse mt-2">Syncing with Server...</p>}
          </div>
          <span className="w-1 md:w-2 h-12 md:h-16 bg-cyan-500 block"></span>
        </div>

        <div className="space-y-32">
          {items.map((item: any, idx: number) => {
            // ⭐️ 안전하게 아이콘 꺼내기 (없으면 default)
            const IconComponent = ICON_MAP[item.icon] || ICON_MAP["default"];

            return (
              <div 
                key={idx} 
                className={`flex flex-col md:flex-row gap-12 md:gap-20 items-center ${
                  idx % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* 왼쪽(혹은 오른쪽): 이미지 (Cipher Effect) */}
                <div className="w-full md:w-1/2 aspect-[16/9] relative rounded-lg overflow-hidden border border-white/10 bg-zinc-900 group">
                  {item.imageUrl ? (
                    <CipherImage 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">No Image</div>
                  )}
                  
                  {/* 데코레이션 */}
                  <div className="absolute top-0 left-0 p-4 bg-black/50 backdrop-blur-md border-r border-b border-white/10">
                     <div className="text-cyan-500 w-6 h-6">{IconComponent}</div>
                  </div>
                </div>

                {/* 텍스트 영역 */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="text-cyan-500 font-mono text-sm tracking-widest border-b border-cyan-500/30 inline-block pb-1">
                    PROJECT_0{idx + 1}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-loose text-lg">
                    {item.description}
                  </p>
                  <MagneticButton>
                     <button className="text-sm font-bold text-white hover:text-cyan-400 transition-colors flex items-center gap-2">
                       VIEW DETAILS <span>&rarr;</span>
                     </button>
                  </MagneticButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}