"use client";
import React from 'react';

// ReactBits Components
import GradientText from '@/components/reactbits/GradientText';
import InfiniteMenu from '@/components/reactbits/InfiniteMenu';

// ✅ [추가] 언어 설정을 가져오기 위해 import
import { useLanguage } from '@/components/LanguageProvider';

export function Section3_ResearchAreas({ content, loading }: { content: any, loading: boolean }) {
  // ✅ [추가] 현재 언어 값('ko' or 'en') 가져오기
  const { language } = useLanguage();

  const rawItems = Array.isArray(content?.items) ? content.items : [];

  const menuItems = rawItems.map((item: any) => {
    // ✅ [수정] description이 객체인지 문자열인지 확인하여 처리
    // (기존 데이터가 문자열로 남아있을 경우를 대비한 안전 장치 포함)
    let descriptionText = "";
    
    if (typeof item.description === 'object' && item.description !== null) {
      // 1. 데이터가 { ko: "...", en: "..." } 객체인 경우 -> 현재 언어 선택
      descriptionText = item.description[language] || item.description['ko'] || "";
    } else {
      // 2. 데이터가 그냥 문자열인 경우 (구 데이터) -> 그대로 사용
      descriptionText = item.description || "";
    }

    return {
      title: item.title,
      description: descriptionText, // ✅ 변환된 텍스트 적용
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