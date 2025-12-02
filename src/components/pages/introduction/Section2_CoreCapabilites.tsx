"use client";
import React from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { MagneticButton } from '@/components/ui/MagneticButton';

// items 배열 안에는 이미 <Cpu /> 같은 컴포넌트가 들어있으므로 바로 렌더링 가능
export function Section2_CoreCapabilites({ items }: { items: any[] }) {
  return (
    <section className="relative py-32 px-6 md:px-12 bg-black z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 border-b border-white/10 pb-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Core <span className="text-cyan-500">Capabilities</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <SpotlightCard key={idx} className="h-full bg-zinc-900/30 p-8 border border-white/5 group">
              <div className="mb-6 text-cyan-500 transition-transform duration-500 group-hover:scale-110 group-hover:text-white">
                {/* ⭐️ 여기가 핵심: 문자열 변환 없이 바로 사용 */}
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-100 group-hover:text-cyan-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {item.description}
              </p>
              
              <div className="mt-8">
                <MagneticButton>
                  <button className="text-xs font-bold text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors">
                    EXPLORE
                  </button>
                </MagneticButton>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}