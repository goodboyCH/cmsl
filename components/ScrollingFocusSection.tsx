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
  const textItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const contentScrollDuration = 0.7; 
      const transitionScrollDuration = 0.3;
      
      // --- ⬇️ 마지막 항목이 머무를 시간을 포함하도록 전체 스크롤 길이 계산을 수정합니다. ⬇️ ---
      const totalDuration = (contentScrollDuration + transitionScrollDuration) * items.length;
      // --- ⬆️ 수정 완료 ⬆️ ---
      
      const itemTitles = textItemsRef.current.map(el => el?.querySelector('h3')).filter(Boolean) as HTMLElement[];
      const itemDescs = textItemsRef.current.map(el => el?.querySelector('p')).filter(Boolean) as HTMLElement[];
      
      const splitTitles = SplitType.create(itemTitles, { types: 'words' });
      const splitDescs = SplitType.create(itemDescs, { types: 'lines' });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalDuration * 100}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
      
      timeline.to(sectionRef.current?.querySelector('h2'), 
        { y: 0, opacity: 1, duration: 0.1 },
      );

      items.forEach((_, i) => {
        const startTime = (contentScrollDuration + transitionScrollDuration) * i;
        const endTime = startTime + contentScrollDuration;
        
        timeline.fromTo(textItemsRef.current[i],
          { opacity: 0, scale: 0.95, y: 30 },
          { 
            opacity: 1, scale: 1, y: 0,
            duration: contentScrollDuration * 0.4,
            onStart: () => setActiveIndex(i),
            onReverseComplete: () => i > 0 && setActiveIndex(i - 1),
          },
          startTime
        );

        if (splitTitles[i]?.words) {
            timeline.from(splitTitles[i].words, { opacity: 0, y: 20, stagger: 0.05, duration: 0.2 }, "<");
        }
        if (splitDescs[i]?.lines) {
            timeline.from(splitDescs[i].lines, { opacity: 0, y: 20, stagger: 0.1, duration: 0.2 }, "<0.1");
        }
        
        if (i < items.length - 1) {
          timeline.to(textItemsRef.current[i],
            { 
              opacity: 0, scale: 0.95, y: -30,
              duration: contentScrollDuration * 0.4,
            },
            endTime - (contentScrollDuration * 0.4)
          );
        }
      });

    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [items]);

  const ActiveIcon = items[activeIndex]?.icon;

  return (
    <section 
      ref={sectionRef} 
      className={`relative min-h-screen w-screen pt-24 pb-16 md:pt-40 md:pb-32 ${backgroundColor} ${textColor}`}
    >
      <div className="container mx-auto h-full flex flex-col">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-primary mb-8 md:mb-16 opacity-0" style={{transform: 'translateY(50px)'}}>{sectionTitle}</h2>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="h-[25vh] md:h-[50vh] flex items-center justify-center">
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
                  ActiveIcon && <ActiveIcon className="w-auto h-24 md:h-48 text-primary/30" />
                )}
             </motion.div>
          </div>
          
          <div className="relative h-[40vh] md:h-[50vh]">
            {items.map((item, index) => (
              <div 
                key={index} 
                ref={el => {textItemsRef.current[index] = el}}
                className="absolute inset-0 flex items-center opacity-0 text-center md:text-left"
              >
                <Card className="w-full bg-transparent border-none shadow-none">
                  <CardHeader className="items-center md:items-start"> 
                    <CardTitle className="text-2xl md:text-4xl font-bold text-primary">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base md:text-xl leading-relaxed text-muted-foreground">{item.description}</p>
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