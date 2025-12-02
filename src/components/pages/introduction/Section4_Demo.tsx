"use client";
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ReactBits Component
import GradientText from '@/components/reactbits/GradientText';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/videos/demo-sequence1.mp4"; 
const FPS = 30; 

export function Section4_Demo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!videoRef.current || !sectionRef.current) return;

      const video = videoRef.current;

      const handleMetadata = () => {
        const duration = video.duration || 5; 
        const totalFrames = Math.floor(duration * FPS); 
        const videoState = { frame: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=5000%", 
            pin: true,
            scrub: 0.5,
          }
        });

        tl.to(videoState, {
          frame: totalFrames,
          duration: duration,
          ease: "none",
          onUpdate: () => {
            if (video) {
                video.currentTime = videoState.frame / FPS;
            }
          }
        }, 0); 

        if (textRef.current) {
          const fadeInTime = duration * 0.2;
          const fadeOutTime = duration * 0.8;
          
          tl.fromTo(textRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1 }, 
            fadeInTime
          )
          .to(textRef.current, 
            { opacity: 0, y: -50, duration: 1 }, 
            fadeOutTime
          );
        }
      };

      if (video.readyState >= 1) {
        handleMetadata();
      } else {
        video.onloadedmetadata = handleMetadata;
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative h-screen w-full bg-black overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="w-full h-full object-contain" 
          playsInline
          muted
          preload="auto"
        />
      </div>

      <div 
        ref={textRef} 
        className="absolute bottom-20 left-0 w-full text-center z-10 opacity-0 pointer-events-none"
      >
        <div className="inline-block bg-black/80 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 shadow-2xl">
          <div className="text-white text-lg md:text-3xl font-bold tracking-wide flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <span>Simulation Results:</span>
            
            {/* 🛑 [변경] GradientText 적용 */}
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={false}
              className="font-bold"
            >
              Predicted Microstructure
            </GradientText>
          
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 z-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
    </div>
  );
}