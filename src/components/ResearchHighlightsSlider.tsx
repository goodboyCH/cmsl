import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Pause, Play, ExternalLink } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ResearchHighlight {
  title: string;
  authors: string;
  journal: string;
  year: string;
  description: string;
  description_ko?: string;
  category: string;
  image?: string;
  doi: string;
}

interface SliderProps {
  highlights: ResearchHighlight[];
}

export function ResearchHighlightsSlider({ highlights }: SliderProps) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000); // Slightly longer duration for better readability
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % highlights.length);
  }, [highlights.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + highlights.length) % highlights.length);
  }, [highlights.length]);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handleCardClick = () => {
    if (highlights[currentIndex].doi) {
      window.open(highlights[currentIndex].doi, '_blank');
    }
  };

  if (!highlights || highlights.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-white/50">
        No highlights available.
      </div>
    );
  }

  const currentHighlight = highlights[currentIndex];

  const getDescription = () => {
    if (language === 'ko' && currentHighlight.description_ko) {
      return currentHighlight.description_ko;
    }
    return currentHighlight.description;
  };

  // Animation Variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    })
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.5, staggerChildren: 0.1 }
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto py-8">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl -z-10">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 transform scale-125"
            style={{ backgroundImage: `url(${currentHighlight.image})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
      </div>

      <div className="relative px-4 md:px-12">
        <div className="relative min-h-[500px] md:min-h-[450px] flex items-center">

          {/* Navigation Buttons (Left) */}
          <button
            onClick={() => { handlePrev(); setIsAutoPlaying(false); }}
            className="absolute left-0 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 hidden md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Navigation Buttons (Right) */}
          <button
            onClick={() => { handleNext(); setIsAutoPlaying(false); }}
            className="absolute right-0 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 hidden md:flex"
            aria-label="Next slide"
          >
            <ChevronRight size={32} />
          </button>

          <div className="w-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <Card className="bg-black/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl rounded-3xl mx-auto">
                  <div className="flex flex-col md:flex-row h-full">

                    {/* Image Section - Adjusted for 16:9 approximation */}
                    <div className="md:w-3/5 relative aspect-video md:aspect-auto md:h-auto overflow-hidden bg-black/50 group cursor-pointer" onClick={handleCardClick}>
                      <motion.img
                        src={currentHighlight.image}
                        alt={currentHighlight.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white flex items-center gap-2 font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                          Read Paper <ExternalLink size={16} />
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-center text-white relative bg-gradient-to-l from-transparent to-black/20">
                      <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <Badge className="bg-primary/80 hover:bg-primary text-white border-none px-3 py-1 text-sm font-medium shadow-lg shadow-primary/20 backdrop-blur-sm">
                            {currentHighlight.category}
                          </Badge>
                          <span className="text-white/40 text-sm font-mono">{currentHighlight.year}</span>
                        </div>

                        <h3
                          className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight cursor-pointer hover:text-primary-foreground transition-colors"
                          onClick={handleCardClick}
                        >
                          {currentHighlight.title}
                        </h3>

                        <p className="text-base md:text-lg text-white/80 leading-relaxed line-clamp-4 md:line-clamp-none font-light">
                          {getDescription()}
                        </p>

                        <div className="pt-6 border-t border-white/10 space-y-2">
                          <div className="flex items-start gap-2 text-sm text-white/60">
                            <span className="font-semibold text-white/80 shrink-0">Authors:</span>
                            <span className="line-clamp-1">{currentHighlight.authors}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <span className="font-semibold text-white/80">Published in:</span>
                            <span className="italic">{currentHighlight.journal}</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between px-4">
          {/* Autoplay Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider"
          >
            {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isAutoPlaying ? 'Pause' : 'Play'}
          </button>

          {/* Dots */}
          <div className="flex space-x-3">
            {highlights.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="w-16"></div> {/* Spacer for balance */}
        </div>
      </div>
    </div>
  );
}