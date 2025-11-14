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
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}