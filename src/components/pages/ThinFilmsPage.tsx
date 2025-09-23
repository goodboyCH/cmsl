import React from 'react';
import { ScrollAnimation } from '../ScrollAnimation';
import { ProjectCard } from '../ProjectCard';

export function ThinFilmsPage() {
  const projects = [
    {
      title: "HfO₂ Ferroelectric Domain Engineering",
      status: "Active",
      description: "AI-accelerated modeling of ferroelectric domain evolution in hafnia-based thin films.",
      keyFeatures: ["Domain switching", "Wake-up free", "Memory optimization"],
    },
    {
      title: "HZO Polycrystalline Film Development",
      status: "Active", 
      description: "Computational design of HZO thin films for next-gen memory devices.",
      keyFeatures: ["Grain boundary effects", "Phase transition", "Property optimization"],
    },
    {
      title: "Multiferroic Thin Film Systems",
      status: "Active",
      description: "Investigating coupled ferroelectric-magnetic properties in oxide heterostructures.",
      keyFeatures: ["Magnetoelectric coupling", "Interface engineering", "Strain effects"],
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12 space-y-20">

      {/* 섹션 1: 핵심 연구 소개 */}
      <ScrollAnimation>
        <section className="grid md:grid-cols-2 gap-12 items-center">
          {/* 왼쪽: 설명 텍스트 (볼륨 확장) */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">Thin Films Research</h1>
            <p className="text-xl text-muted-foreground">
              Modeling of ferroelectric and multiferroic thin films for next-generation electronic devices.
            </p>
            <div className="text-base text-foreground/80 space-y-4 leading-relaxed">
              <p>
                Our laboratory specializes in the computational design and analysis of advanced thin film materials, with a primary focus on HfO₂/HZO-based ferroelectric systems. These materials are critical for the development of future technologies, including non-volatile memory (FeRAM), neuromorphic computing, and ultra-low-power electronics. We investigate the fundamental physics governing their behavior, such as domain switching dynamics, the "wake-up" effect in new devices, and the complex influence of polycrystalline grain boundaries on overall performance.
              </p>
              <p>
                To overcome the limitations of traditional trial-and-error experimentation, we employ a powerful suite of computational tools. By combining atomic-scale first-principles calculations (DFT), molecular dynamics, and mesoscale phase-field modeling, we can simulate material behavior across multiple scales. Furthermore, we leverage AI and machine learning techniques to dramatically accelerate the materials design cycle. This multi-scale, data-driven approach allows us to engineer novel thin film devices with enhanced performance, superior reliability, and unprecedented energy efficiency, paving the way for breakthroughs in quantum computing components, sensors, and actuators.
              </p>
            </div>
          </div>

          {/* 오른쪽: 대표 이미지 */}
          <div className="rounded-lg overflow-hidden elegant-shadow aspect-video">
            <img 
              src="https://images.unsplash.com/photo-1618493608248-3051d3493e84?q=80&w=1920" 
              alt="Thin Film Atomic Structure" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      </ScrollAnimation>

      {/* 섹션 2: 관련 프로젝트 현황 */}
      <ScrollAnimation delay={200}>
        <section className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary">Current Projects</h2>
            <p className="text-lg text-muted-foreground mt-2">
              Exploring the frontiers of thin film technology.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard 
                key={index}
                title={project.title}
                description={project.description}
                tags={project.keyFeatures}
                status={project.status as 'Active' | 'Completed'}
              />
            ))}
          </div>
        </section>
      </ScrollAnimation>

    </div>
  );
}