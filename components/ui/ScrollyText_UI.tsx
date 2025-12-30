import React from 'react';
import { Cpu, Atom, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Cpu, Atom, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users,
  "FlaskConical": TestTube2
};

interface ScrollyTextProps {
  item: any;
  className: string;
}

// ⬇️ GSAP, 훅, 로직이 모두 제거된 순수 UI 컴포넌트 ⬇️
export function ScrollyText_UI({ item, className }: ScrollyTextProps) {
  const IconComponent = iconMap[item.icon] || Atom;
  return (
    <div
      // '배우'가 찾을 수 있는 클래스 + GSAP이 제어하도록 opacity: 0
      className={`min-h-screen w-full flex flex-col items-center justify-center text-center p-8 text-white absolute inset-0 ${className}`}
      style={{ opacity: 0 }}
    >
      <IconComponent className="h-12 w-12 text-primary" />
      <h2 className="text-3xl md:text-5xl font-bold text-shadow-lg mt-4">{item.title}</h2>
      <p className="text-lg md:text-xl text-white/80 max-w-2xl mt-4 text-shadow-md">{item.description}</p>
    </div>
  );
}