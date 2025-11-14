import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageCarouselProps {
  images: {
    url: string;
    alt?: string;
  }[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  if (!images || images.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden elegant-shadow aspect-video w-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full elegant-shadow rounded-lg overflow-hidden">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="aspect-video">
              <img
                src={image.url}
                alt={image.alt || `Research slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {/* --- ⬇️ 화살표 버튼이 잘 보이도록 수정 ⬇️ --- */}
      <CarouselPrevious 
        className="left-4 bg-background/50 hover:bg-background/75 opacity-80 hover:opacity-100" 
      />
      <CarouselNext 
        className="right-4 bg-background/50 hover:bg-background/75 opacity-80 hover:opacity-100" 
      />
      {/* --- ⬆️ 수정 완료 ⬆️ --- */}
    </Carousel>
  );
}