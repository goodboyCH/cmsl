"use client";
import React from 'react';

// ReactBits Components
import GradientText from '@/components/reactbits/GradientText';
import InfiniteMenu from '@/components/reactbits/InfiniteMenu';

export function Section3_ResearchAreas({ content, loading }: { content: any, loading: boolean }) {
  // 데이터 안전 처리
  const rawItems = Array.isArray(content?.items) ? content.items : [];

  // InfiniteMenu 포맷으로 변환
  const menuItems = rawItems.map((item: any) => ({
    title: item.title,
    description: item.description,
    image: item.imageUrl || "https://placehold.co/600x400/18181b/FFF?text=No+Image",
    
    // 🛑 [수정 필수] 이 줄이 빠져있어서 링크가 안 넘어갔던 것입니다!
    // DB에 저장된 필드명(link 또는 url)을 확인하여 연결해주세요.
    link: item.link || item.url || "" 
  }));

  // 데이터가 너무 적으면 무한 스크롤 느낌이 안 나므로 강제로 늘려줄 수도 있습니다.
  // 여기서는 InfiniteMenu 내부에서 자동으로 복제하도록 처리했습니다.

  return (
    <section className="relative py-32 bg-zinc-950 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col">
        
        {/* --- 헤더 영역 --- */}
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold">
              {/* GradientText 적용 */}
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={5}
                showBorder={false}
              >
                {content.title || "Research Areas"}
              </GradientText>
            </h2>
          </div>
          
          <div className="text-sm text-gray-500 font-medium hidden md:block text-right">
            {loading ? (
                <span className="animate-pulse text-cyan-500">Syncing Data...</span>
            ) : (
                <span>SCROLL TO EXPLORE<br/>{rawItems.length} MAJOR FIELDS</span>
            )}
          </div>
        </div>

        {/* --- 무한 메뉴 영역 --- */}
        {/* 사용 예시처럼 높이를 지정해줘야 합니다. */}
        <div style={{ height: '600px', position: 'relative' }} className="w-full bg-zinc-900/20 rounded-2xl border border-white/5 overflow-hidden">
           {menuItems.length > 0 ? (
             <InfiniteMenu items={menuItems} />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-500">
               No Research Items Found
             </div>
           )}
        </div>

      </div>
    </section>
  );
}