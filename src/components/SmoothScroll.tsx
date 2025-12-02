"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Lenis 인스턴스 생성
    const lenis = new Lenis({
      duration: 1.2, // 스크롤 감속 시간 (길수록 부드러움)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 감속 커브
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // 2. Lenis와 GSAP ScrollTrigger 연동 (매우 중요: 핀 고정 떨림 방지)
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 3. Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return <>{children}</>;
}