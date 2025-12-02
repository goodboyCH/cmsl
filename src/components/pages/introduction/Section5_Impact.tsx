"use client";
import React from 'react';

// ReactBits Components
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import LogoLoop from '@/components/reactbits/LogoLoop';
import GradientText from '@/components/reactbits/GradientText';

interface Section5Props {
  items: { title: string; description: string }[];
  logos: { name: string; url: string }[];
}

export function Section5_Impact({ items = [], logos = [] }: Section5Props) {
  
  // LogoLoop용 데이터 포맷 변환
  const loopLogos = logos.map(logo => ({
    src: logo.url,
    alt: logo.name,
    href: "#", // 실제 링크가 있다면 여기에 연결
  }));

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
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              우리의 연구는 실험실을 넘어, 실제 산업과 환경에<br className="hidden md:block"/> 
              구체적이고 측정 가능한 변화를 만들어냅니다.
            </p>
         </div>
         
         {/* --- Bento Grid (Spotlight Cards) --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-40">
            {items.map((item, idx) => {
              // 첫 번째와 마지막 아이템을 강조 (2칸 차지)
              const isLarge = idx === 0 || idx === 3;
              
              return (
                <div 
                  key={idx} 
                  className={isLarge ? 'md:col-span-2' : ''}
                >
                  <SpotlightCard 
                    className="h-full p-10 flex flex-col justify-between"
                    spotlightColor="rgba(6, 182, 212, 0.2)" // Cyan 색상 스포트라이트
                  >
                      <div>
                        <div className="text-cyan-500 mb-6 text-xl font-bold font-mono">
                          0{idx + 1}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                          {item.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-400 text-base leading-relaxed mt-6">
                        {item.description}
                      </p>
                  </SpotlightCard>
                </div>
              );
            })}
         </div>

         {/* --- Partners (Logo Loop) --- */}
         <div className="border-t border-white/10 pt-16">
            <p className="text-center text-gray-500 mb-12 text-xs font-bold uppercase tracking-[0.2em]">
              Trusted Partners
            </p>
            
            <div className="h-24 w-full">
              {/* LogoLoop 적용 */}
              <LogoLoop
                logos={loopLogos}
                speed={40}         // 천천히 흐르도록 설정
                direction="left"
                logoHeight={50}    // 로고 높이
                gap={80}           // 로고 간격 넓게
                scaleOnHover={true}
                fadeOut={true}     // 양끝 페이드 아웃
                fadeOutColor="#000000" // 배경색과 일치
              />
            </div>
         </div>

      </div>
    </section>
  );
}