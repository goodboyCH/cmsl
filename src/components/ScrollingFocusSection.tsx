import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideProps } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FocusItem {
  icon: React.ElementType<LucideProps>;
  title: string;
  description: string;
  imageUrl?: string;
}

interface ScrollingFocusSectionProps {
  sectionTitle: string;
  items: FocusItem[];
  backgroundColor?: string;
  textColor?: string;
}

export const ScrollingFocusSection: React.FC<ScrollingFocusSectionProps> = ({ 
  sectionTitle, 
  items,
  backgroundColor = 'bg-background',
  textColor = 'text-foreground'
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visualPanelRef = useRef<HTMLDivElement>(null);
  const textItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // GSAP 컨텍스트 내에서 모든 DOM 조작 및 애니메이션을 실행합니다.
    const ctx = gsap.context(() => {
      const itemTitles = textItemsRef.current.map(el => el?.querySelector('h3')).filter(Boolean) as HTMLElement[];
      const itemDescs = textItemsRef.current.map(el => el?.querySelector('p')).filter(Boolean) as HTMLElement[];
      
      const splitTitles = SplitType.create(itemTitles, { types: 'words' });
      const splitDescs = SplitType.create(itemDescs, { types: 'lines' });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${items.length * 100}%`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });
      
      timeline.fromTo(sectionRef.current?.querySelector('h2'), 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0
      );

      items.forEach((_, i) => {
        timeline.fromTo(textItemsRef.current[i],
          { opacity: 0, scale: 0.95, y: 30 },
          { 
            opacity: 1, scale: 1, y: 0,
            onStart: () => setActiveIndex(i),
            onReverseComplete: () => i > 0 && setActiveIndex(i - 1),
          },
          i + 0.5
        );

        // splitTitles와 splitDescs가 배열인 경우에만 애니메이션 적용
        if (splitTitles[i]?.words) {
            timeline.from(splitTitles[i].words, { opacity: 0, y: 20, stagger: 0.05 }, "<");
        }
        if (splitDescs[i]?.lines) {
            timeline.from(splitDescs[i].lines, { opacity: 0, y: 20, stagger: 0.1 }, "<0.2");
        }
        
        if (i < items.length - 1) {
          timeline.to(textItemsRef.current[i],
            { opacity: 0, scale: 0.95, y: -30 },
            i + 1.2
          );
        }
      });
    }, sectionRef);

    // Cleanup 함수
    return () => {
      // GSAP 컨텍스트를 정리하여 모든 애니메이션과 ScrollTrigger를 제거합니다.
      ctx.revert();
    };
  }, [items]);

  const ActiveIcon = items[activeIndex]?.icon;

  return (
    <section ref={sectionRef} className={`relative min-h-screen w-screen py-20 md:py-32 ${backgroundColor} ${textColor}`}>
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-primary mb-16 opacity-0">{sectionTitle}</h2>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Panel: Visuals (Sticky) */}
          <div ref={visualPanelRef} className="h-[50vh] flex items-center justify-center">
             <motion.div 
               key={activeIndex}
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6, ease: 'easeOut' }}
               className="w-full h-full flex items-center justify-center"
             >
                {items[activeIndex]?.imageUrl ? (
                    <img src={items[activeIndex].imageUrl} alt={items[activeIndex].title} className="max-w-full max-h-full object-contain rounded-lg elegant-shadow" />
                ) : (
                    ActiveIcon && <ActiveIcon className="w-48 h-48 text-primary/30" />
                )}
             </motion.div>
          </div>
          
          {/* Right Panel: Text Content */}
          <div className="relative h-[50vh]">
            {items.map((item, index) => (
              <div 
                key={index} 
                ref={el => {textItemsRef.current[index] = el}}
                className="absolute inset-0 flex items-center opacity-0"
              >
                <Card className="w-full bg-transparent border-none shadow-none">
                  <CardHeader>
                    <CardTitle className="text-3xl md:text-4xl font-bold text-primary">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};