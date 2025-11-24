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
    <Carousel className="w-full elegant-shadow rounded-lg overflow-hidden bg-white border relative group">
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index}>
            <div className="aspect-video bg-white relative flex items-center justify-center">
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-full object-contain"
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
      
      {/* --- ⬇️ 화살표 스타일 강화 (테두리, 배경, 그림자 추가) ⬇️ --- */}
      <CarouselPrevious 
        className="left-4 h-10 w-10 border border-border/50 bg-background/80 hover:bg-background shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200" 
      />
      <CarouselNext 
        className="right-4 h-10 w-10 border border-border/50 bg-background/80 hover:bg-background shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200" 
      />
      {/* --- ⬆️ 수정 완료 ⬆️ --- */}
    </Carousel>
  );
}