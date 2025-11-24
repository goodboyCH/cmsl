import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MediaItem {
  url: string;
  type?: 'image' | 'video'; // 타입 추가 (기존 데이터 호환을 위해 optional)
  alt?: string;
}

interface ImageCarouselProps {
  items: MediaItem[]; // 'images' -> 'items'로 변경하여 범용성 표현
}

export function ImageCarousel({ items }: ImageCarouselProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden elegant-shadow aspect-video w-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">No media available</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full elegant-shadow rounded-lg overflow-hidden">
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index}>
            <div className="aspect-video bg-black/5 relative flex items-center justify-center">
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-full object-contain"
                  controls // 재생 컨트롤 표시
                  playsInline
                  preload="metadata"
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
      
      <CarouselPrevious 
        className="left-4 bg-background/50 hover:bg-background/75 opacity-80 hover:opacity-100 transition-opacity" 
      />
      <CarouselNext 
        className="right-4 bg-background/50 hover:bg-background/75 opacity-80 hover:opacity-100 transition-opacity" 
      />
    </Carousel>
  );
}