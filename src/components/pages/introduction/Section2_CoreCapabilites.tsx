"use client";

import React from 'react';
import { Root, Pin, Animation } from '@bsmnt/scrollytelling';

// content 데이터 타입 정의 (필요시 수정)
interface SectionProps {
  content: {
    title?: string;
    items: Array<{
      title: string;
      desc?: string;    // 기존 데이터 필드명에 맞춰 조정 (description vs desc)
      description?: string;
      imageUrl?: string;
      // ... 기타 필드
    }>;
  };
}

export function Section2_CoreCapabilites({ content }: SectionProps) {
  // 데이터 안전장치
  const items = content.items || [];
  const TOTAL_CARDS = items.length;
  
  // 스크롤 길이 설정 (카드 개수에 따라 유동적으로 조절 가능)
  // 예: 카드당 100vh 정도의 스크롤 영역 배정
  const PIN_HEIGHT = `${TOTAL_CARDS * 100}vh`;

  if (TOTAL_CARDS === 0) return null;

  return (
    <section className="relative w-full bg-neutral-900 text-white">
      {/* scrub={true}: 스크롤 위치에 따라 애니메이션 프레임이 동기화됨 
      */}
      <Root scrub={true}>
        <Pin pinSpacerHeight={PIN_HEIGHT} top={0} childHeight={1}>
          {/* PinContainer: 화면에 고정되는 영역 */}
          <div className="h-screen w-full flex flex-col justify-center items-center overflow-hidden relative">
            
            {/* 섹션 제목 (선택 사항 - 상단 고정) */}
            {content.title && (
              <h2 className="absolute top-10 sm:top-20 text-3xl sm:text-4xl font-bold text-white/90 z-50 mix-blend-difference">
                {content.title}
              </h2>
            )}

            {/* CardStack: 모든 카드를 한곳에 겹쳐두는 Grid 컨테이너 */}
            <div className="grid grid-cols-1 grid-rows-1 place-items-center w-full h-full">
              {items.map((item, index) => {
                // --- 타임라인 계산 로직 ---
                const step = 100 / TOTAL_CARDS;
                const isFirstCard = index === 0;
                const isLastCard = index === TOTAL_CARDS - 1;

                // 1. 진입 (Entry): 이전 카드가 보여지는 동안 화면 아래에서 올라옴
                const startEnter = (index - 1) * step;
                const endEnter = index * step;

                // 2. 퇴장/축소 (Exit): 다음 카드가 올라오는 동안 뒤로 물러남
                const startExit = endEnter;
                const endExit = (index + 1) * step;

                const tweens = [];

                // 진입 애니메이션 설정 (첫 카드는 이미 중앙에 있으므로 제외)
                if (!isFirstCard) {
                  tweens.push({
                    start: startEnter,
                    end: endEnter,
                    from: { y: '120vh', opacity: 1, rotateX: -10 }, // 아래에서 시작
                    to: { y: '0vh', opacity: 1, rotateX: 0, ease: 'power3.out' }, // 중앙 안착
                  });
                }

                // 축소 애니메이션 설정 (마지막 카드는 가려질 필요 없으므로 제외)
                if (!isLastCard) {
                  tweens.push({
                    start: startExit,
                    end: endExit,
                    from: { scale: 1, filter: 'brightness(100%) blur(0px)' },
                    to: { scale: 0.92, filter: 'brightness(60%) blur(2px)', ease: 'linear' }, // 뒤로 빠지면서 어두워짐
                  });
                }

                return (
                  <Animation key={index} tween={tweens}>
                    {/* Card 스타일링 
                      - grid-area: 1/1/2/2 -> 모든 카드를 같은 셀에 겹침
                      - z-index: 순서대로 위로 쌓임
                    */}
                    <div
                      className="relative flex flex-col justify-end w-[85vw] max-w-[400px] h-[60vh] max-h-[550px] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden border border-white/10"
                      style={{
                        gridArea: '1 / 1 / 2 / 2',
                        zIndex: index + 1,
                        backgroundColor: '#1e1e1e', // 이미지 없을 경우 기본 배경
                        willChange: 'transform, opacity',
                      }}
                    >
                      {/* 배경 이미지 (있을 경우) */}
                      {item.imageUrl && (
                        <div 
                          className="absolute inset-0 z-0 transition-transform duration-700 hover:scale-105"
                          style={{
                            backgroundImage: `url(${item.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      )}
                      
                      {/* 그라데이션 오버레이 (텍스트 가독성용) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0" />

                      {/* 텍스트 콘텐츠 */}
                      <div className="relative z-10 translate-y-0 transition-transform">
                        <div className="w-10 h-1 bg-primary mb-4 rounded-full" /> {/* 장식용 바 */}
                        <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed line-clamp-4">
                          {item.description || item.desc}
                        </p>
                      </div>
                    </div>
                  </Animation>
                );
              })}
            </div>
          </div>
        </Pin>
      </Root>
    </section>
  );
}