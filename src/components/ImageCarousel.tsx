import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MediaItem {
  url: string;
  type?: 'image' | 'video';
  alt?: string;
}

interface ImageCarouselProps {
  items: MediaItem[];
}

export function ImageCarousel({ items }: ImageCarouselProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden elegant-shadow aspect-video w-full flex items-center justify-center bg-gray-50">
        <p className="text-muted-foreground text-sm">No media available</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full elegant-shadow rounded-lg overflow-hidden bg-white border">
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index}>
            {/* --- ⬇️ 4. 배경색을 흰색(bg-white)으로 설정 ⬇️ --- */}
            <div className="aspect-video bg-white relative flex items-center justify-center">
              {item.type === 'video' ? (
                /* --- ⬇️ 3. 동영상 자동/반복 재생 설정 ⬇️ --- */
                <video
                  src={item.url}
                  className="w-full h-full object-contain" // 비율 유지 (object-contain)
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.alt || `Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      <CarouselPrevious className="left-2 bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
      <CarouselNext className="right-2 bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
    </Carousel>
  );
}