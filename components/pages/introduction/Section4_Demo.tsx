"use client";
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ReactBits Component
import GradientText from '@/components/reactbits/GradientText';

gsap.registerPlugin(ScrollTrigger);

const FPS = 30;

interface DemoItem {
  title: string;
  videoUrl: string;
}

interface Section4Props {
  title: string;
  description: string;
  items?: DemoItem[];
}

/**
 * VideoBlock Component (CSS Sticky Implementation)
 * - Container: Acts as the scroll track (height = scroll duration).
 * - Sticky Wrapper: Stays fixed in the viewport while scrolling through the container.
 * - GSAP: Only handles the video scrubbing animation.
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

        // GSAP Scrubbing Animation
        // Note: No 'pin: true' because we use CSS position: sticky
        gsap.to(videoState, {
          frame: totalFrames,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",      // Start when container top hits viewport top
            end: "bottom bottom",  // End when container bottom hits viewport bottom
            scrub: 1,              // Smooth scrubbing
          },
          onUpdate: () => {
            if (video && Number.isFinite(videoState.frame)) {
              video.currentTime = videoState.frame / FPS;
            }
          }
        });
      };

      if (video.readyState >= 1) {
        handleMetadata();
      } else {
        video.onloadedmetadata = handleMetadata;
      }

    }, containerRef);

    return () => ctx.revert();
  }, [item.videoUrl]);

  return (
    // 1. Scroll Track (Height determines animation duration)
    // h-[200vh] provides ample scroll space for the video to play out
    // mb-40 creates the 'gap' between this video's finish and the next one's start
    <div ref={containerRef} className="relative h-[200vh] w-full mb-40 last:mb-0">

      {/* 2. Sticky Viewport: This stays fixed while user scrolls through the 300vh track */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* Title stays with the video */}
        <h3 className="text-2xl md:text-4xl font-bold text-white mb-8 text-center px-4 relative z-10">
          {item.title}
        </h3>

        {/* Video Player Container */}
        <div className="relative w-[90%] md:w-[80%] max-w-6xl aspect-video bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5 z-10">
          <video
            ref={videoRef}
            src={item.videoUrl}
            className="w-full h-full object-contain bg-black"
            playsInline
            muted
            preload="auto"
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

      </div>
    </div>
  );
};

export function Section4_Demo({ title, description, items = [] }: Section4Props) {
  return (
    // 'relative' allows standard flow. Removed 'overflow-hidden' from section to allow sticky to work.
    <section className="relative pt-32 pb-32 bg-black border-b border-white/10">

      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center">

        {/* Intro Text Block */}
        <div className="w-full mb-24 text-center">
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

        {/* Video List Wrapper */}
        <div className="w-full">
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <VideoBlock key={index} item={item} index={index} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-20 min-h-[50vh] flex items-center justify-center">
              No demo videos available.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
