import React from 'react';
import { ScrollAnimation } from '../ScrollAnimation';
import { ProjectCard } from '../ProjectCard';

export function CastingAlloysPage() {
  const projects = [
    {
      title: "NdFeB Strip Casting Optimization",
      status: "Active",
      description: "Phase-field modeling of rare-earth permanent magnet strip casting.",
      keyFeatures: ["Multi-phase solidification", "CALPHAD coupling", "Microstructure prediction"],
    },
    {
      title: "Al/Fe Casting Alloy Development",
      status: "Active", 
      description: "Advanced modeling of aluminum-iron casting alloys for automotive applications.",
      keyFeatures: ["Eutectic growth modeling", "Defect prediction", "Property optimization"],
    },
    {
      title: "High-Si Steel Casting",
      status: "Completed",
      description: "Computational design of high-silicon steel casting processes for electrical applications.",
      keyFeatures: ["Silicon segregation", "Grain structure", "Magnetic property"],
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12 space-y-20">
      
      {/* 섹션 1: 핵심 연구 소개 */}
      <ScrollAnimation>
        <section className="grid md:grid-cols-2 gap-12 items-center">
          {/* 왼쪽: 설명 텍스트 (볼륨 확장) */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">Casting Alloys Research</h1>
            <p className="text-xl text-muted-foreground">
              Advanced computational modeling and optimization of casting processes for high-performance alloys.
            </p>
            <div className="text-base text-foreground/80 space-y-4 leading-relaxed">
              <p>
                Our laboratory pioneers the development and application of advanced phase-field models to predict and control solidification microstructures in industrial casting processes. This research is vital for creating high-performance materials used in critical sectors such as automotive, aerospace, and renewable energy. We tackle complex challenges like controlling eutectic growth in Al-Si alloys, optimizing magnetic properties in NdFeB permanent magnets, and minimizing defects in high-silicon steels. Our goal is to bridge the gap between fundamental scientific understanding and practical industrial application.
              </p>
              <p>
                To achieve this, we have built a powerful computational platform that integrates multi-physics simulations with CALPHAD (Calculation of Phase Diagrams) thermodynamic and kinetic databases. This allows us to accurately simulate the intricate interplay between heat transfer, fluid flow, and microstructure evolution during solidification. By leveraging high-performance computing and machine learning, we can explore vast design spaces and process parameters that would be impractical to investigate experimentally. This predictive capability enables us to design novel alloys and optimize manufacturing processes, ultimately reducing development time, cutting costs, and enhancing the performance and reliability of final components.
              </p>
            </div>
          </div>

          {/* 오른쪽: 대표 이미지 */}
          <div className="rounded-lg overflow-hidden elegant-shadow aspect-video">
            <img 
              src="https://images.unsplash.com/photo-1628328258334-153eb882110a?q=80&w=1920" 
              alt="Casting Alloys Simulation" 
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
              Key initiatives in our casting alloys research group.
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