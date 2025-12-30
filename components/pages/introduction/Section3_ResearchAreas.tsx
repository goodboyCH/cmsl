"use client";
import React from 'react';

// ReactBits Components
import GradientText from '@/components/reactbits/GradientText';
import InfiniteMenu from '@/components/reactbits/InfiniteMenu';

import { useLanguage } from '@/components/LanguageProvider';

export function Section3_ResearchAreas({ content, loading }: { content: any, loading: boolean }) {
  const { language } = useLanguage();

  const rawItems = Array.isArray(content?.items) ? content.items : [];

  const menuItems = rawItems.map((item: any) => {
    let descriptionText = "";

    if (typeof item.description === 'object' && item.description !== null) {
      descriptionText = item.description[language] || item.description['ko'] || "";
    } else {
      descriptionText = item.description || "";
    }

    return {
      title: item.title,
      // ✅ [수정] 스크롤바 및 높이 제한 로직 변경
      description: (
        <div
          className="
            block text-xs sm:text-sm md:text-base leading-relaxed text-gray-400
            max-w-[95%] mx-auto

            /* 📱 모바일: 120px 넘으면 스크롤 발생 */
            max-h-[200px]
            overflow-y-auto

            /* 💻 PC (md 이상): 높이 제한 해제 (전체 텍스트 표시) & 스크롤 숨김 */
            md:max-h-none
            md:overflow-visible

            pr-2 /* 스크롤바와 텍스트 간격 */
          "
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b5563 transparent' }}
        >
          {descriptionText}
        </div>
      ),
      image: item.imageUrl || "https://placehold.co/600x400/18181b/FFF?text=No+Image",
      link: item.link || item.url || ""
    };
  });

  return (
    <section className="relative py-32 bg-zinc-950 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col">

        {/* --- 헤더 영역 --- */}
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold">
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
