"use client";
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ReactBits Component
import GradientText from '@/components/reactbits/GradientText';

gsap.registerPlugin(ScrollTrigger);

const FPS = 30;

// 개별 비디오 아이템 타입 정의
interface DemoItem {
  title: string;
  videoUrl: string;
}

// 전체 Props 정의
interface Section4Props {
  title: string;
  description: string;
  items?: DemoItem[]; // items 배열 추가 (옵셔널 처리)
}

/**
 * 개별 비디오 블록 컴포넌트
 * - 각 비디오마다 별도의 ScrollTrigger를 생성합니다.
 */
const VideoBlock = ({ item, index }: { item: DemoItem; index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!videoRef.current || !containerRef.current) return;

      const video = videoRef.current;

      const handleMetadata = () => {
        const duration = video.duration || 5;
        const totalFrames = Math.floor(duration * FPS);
        const videoState = { frame: 0 };

        // 개별 비디오에 대한 타임라인 생성
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current, // 이 비디오 컨테이너가 트리거
            start: "center center",        // 화면 중앙에 오면 시작
            end: "+=200%",                 // 스크롤 길이 (조절 가능)
            pin: true,                     // 재생되는 동안 화면 고정
            scrub: 1,                      // 스크롤과 동기화
            // markers: true,              // 디버깅 필요 시 주석 해제
          }
        });

        tl.to(videoState, {
          frame: totalFrames,
          duration: duration,
          ease: "none",
          onUpdate: () => {
            if (video && Number.isFinite(videoState.frame)) {
              video.currentTime = videoState.frame / FPS;
            }
          }
        }, 0);
      };

      if (video.readyState >= 1) {
        handleMetadata();
      } else {
        video.onloadedmetadata = handleMetadata;
      }

    }, containerRef); // Scope를 이 컴포넌트로 한정

    return () => ctx.revert();
  }, [item.videoUrl]); // URL 변경 시 재실행

  return (
    <div ref={containerRef} className="py-24 flex flex-col items-center justify-center min-h-screen">

      {/* 개별 비디오 제목 (중앙 정렬) */}
      <h3 className="text-2xl md:text-4xl font-bold text-white mb-8 text-center">
        {item.title}
      </h3>

      {/* 비디오 컨테이너 */}
      <div className="relative w-full max-w-5xl aspect-video bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5">
        <video
          ref={videoRef}
          src={item.videoUrl}
          className="w-full h-full object-contain"
          playsInline
          muted
          preload="auto"
        />
        {/* 그라데이션 오버레이 (텍스트 배지 제거됨) */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

    </div>
  );
};

export function Section4_Demo({ title, description, items = [] }: Section4Props) {
  return (
    <section className="relative pt-32 pb-10 bg-black border-b border-white/10 overflow-hidden">

      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col items-center">

        {/* --- 메인 섹션 제목 및 설명 (중앙 정렬) --- */}
        <div className="w-full mb-12 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 flex justify-center">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={5}
              showBorder={false}
            >
              {title}
            </GradientText>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed break-keep whitespace-pre-wrap">
            {description}
          </p>
        </div>

        {/* --- 비디오 리스트 렌더링 --- */}
        <div className="w-full flex flex-col">
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <VideoBlock key={index} item={item} index={index} />
            ))
          ) : (
            // 데이터가 없을 경우 보여줄 기본 메시지
            <div className="text-center text-gray-500 py-10">
              No demo videos available.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
