"use client";
import { useEffect, useRef, useState } from "react";

export function CipherImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = src;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      let frame = 0;
      const totalFrames = 30; // 애니메이션 지속 프레임

      const animate = () => {
        if (frame > totalFrames) {
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          return;
        }

        // 원본 그리기
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // 픽셀레이트/글리치 효과
        const blockSize = (totalFrames - frame) * 2 + 1; // 점점 작아지는 블록
        if (blockSize > 1) {
            // 모자이크 처리 로직 (간단 구현)
            for (let y = 0; y < canvas.height; y += blockSize) {
              for (let x = 0; x < canvas.width; x += blockSize) {
                // 랜덤하게 픽셀을 섞거나 색상을 왜곡
                if(Math.random() > 0.5) {
                    const color = ctx?.getImageData(x, y, 1, 1).data;
                    if(color) {
                         ctx!.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
                         ctx!.fillRect(x, y, blockSize, blockSize);
                    }
                } else {
                    ctx!.fillStyle = '#000'; // 일부는 검정 노이즈
                    ctx!.fillRect(x, y, blockSize, blockSize);
                }
              }
            }
        }
        
        frame++;
        requestAnimationFrame(animate);
      };
      animate();
    };
  }, [src]);

  return <canvas ref={canvasRef} className={`${className} w-full h-full object-cover`} />;
}