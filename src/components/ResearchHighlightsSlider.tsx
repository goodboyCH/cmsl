import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResearchHighlight {
  title: string;
  authors: string;
  journal: string;
  year: string;
  description: string;
  category: string;
  image?: string;
  doi: string;
}

// 1. props 인터페이스를 추가합니다.
interface SliderProps {
  highlights: ResearchHighlight[];
}

// 2. 하드코딩된 highlights 배열을 삭제합니다.

export function ResearchHighlightsSlider({ highlights }: SliderProps) { // 3. props로 highlights를 받습니다.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slideTo = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      slideTo((currentIndex + 1) % highlights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  const goToPrevious = () => { slideTo((currentIndex - 1 + highlights.length) % highlights.length); setIsAutoPlaying(false); };
  const goToNext = () => { slideTo((currentIndex + 1) % highlights.length); setIsAutoPlaying(false); };
  
  const handleCardClick = () => { if (highlights[currentIndex].doi) window.open(highlights[currentIndex].doi, '_blank'); };

  if (!highlights || highlights.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-center p-8">
        <p>No highlights to display.</p>
      </Card>
    );
  }
  
  const currentHighlight = highlights[currentIndex];

  return (
    <div className="relative">
      <div onClick={handleCardClick} className="cursor-pointer group">
        {/* ⬇️ 테두리 박스 스타일 복원 ⬇️ */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
          <CardContent className="p-0">
            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <div className="grid md:grid-cols-5 gap-0 items-center">
                <div className="relative h-64 md:h-96 overflow-hidden md:col-span-2">
                  {currentHighlight.image && (
                    <img src={currentHighlight.image} alt={currentHighlight.title} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg"/>
                  )}
                </div>
                <div className="p-8 flex flex-col justify-center space-y-4 md:col-span-3">
                  <div className="space-y-3">
                    <Badge variant="secondary" className="w-fit bg-white/20 text-white border-white/30">{currentHighlight.category}</Badge>
                    <h3 className="text-2xl font-bold leading-tight">{currentHighlight.title}</h3>
                    <p className="text-white/90 leading-relaxed">{currentHighlight.description}</p>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-white/20">
                    <p className="text-sm text-white/80"><span className="font-medium">Authors:</span> {currentHighlight.authors}</p>
                    <p className="text-sm text-white/80"><span className="font-medium">Published in:</span> {currentHighlight.journal} ({currentHighlight.year})</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Button variant="ghost" size="icon" onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm z-10"><ChevronLeft className="h-6 w-6" /></Button>
      <Button variant="ghost" size="icon" onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm z-10"><ChevronRight className="h-6 w-6" /></Button>
      <div className="flex justify-center space-x-2 mt-6">
        {highlights.map((_, index) => (
          <button key={index} onClick={() => { slideTo(index); setIsAutoPlaying(false); }} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`} />
        ))}
      </div>
      <div className="absolute top-4 right-4 z-10">
        <button onClick={() => setIsAutoPlaying(!isAutoPlaying)} className="text-xs text-white/70 hover:text-white transition-colors">{isAutoPlaying ? '⏸️ Auto' : '▶️ Manual'}</button>
      </div>
    </div>
  );
}