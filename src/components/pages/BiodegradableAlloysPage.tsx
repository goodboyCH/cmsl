import React from 'react';
import { ScrollAnimation } from '../ScrollAnimation';
import { ProjectCard } from '../ProjectCard';

export function BiodegradableAlloysPage() {
  const projects = [
    {
      title: "Mg-Zn Alloy Optimization",
      status: "Active",
      description: "Corrosion modeling for biodegradable magnesium-zinc alloys in biomedical use.",
      keyFeatures: ["Corrosion control", "Biocompatibility", "Electrochemical mapping"],
    },
    {
      title: "Fe-Based Biodegradable Stents",
      status: "Active", 
      description: "Computational design of iron-based alloys for cardiovascular stent applications.",
      keyFeatures: ["Controlled degradation", "Vascular compatibility", "Stent design"],
    },
    {
      title: "Zn-Ca Bone Implant Alloys",
      status: "Active",
      description: "Development of zinc-calcium alloys for orthopedic implants.",
      keyFeatures: ["Bone integration", "Degradation timing", "Mechanical matching"],
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12 space-y-20">

      {/* 섹션 1: 핵심 연구 소개 */}
      <ScrollAnimation>
        <section className="grid md:grid-cols-2 gap-12 items-center">
          {/* 왼쪽: 설명 텍스트 (볼륨 확장) */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">Biodegradable Alloys Research</h1>
            <p className="text-xl text-muted-foreground">
              Computational design of biodegradable metallic materials for biomedical applications.
            </p>
            <div className="text-base text-foreground/80 space-y-4 leading-relaxed">
              <p>
                Our research focuses on creating the next generation of biomedical implants using advanced biodegradable alloys. Unlike permanent implants, these materials—based on Magnesium (Mg), Iron (Fe), and Zinc (Zn)—are designed to perform a temporary function, such as supporting a healing bone or artery, and then safely dissolve and be absorbed by the body. This revolutionary approach eliminates the need for secondary removal surgeries, reducing patient trauma, lowering healthcare costs, and minimizing long-term complications associated with permanent foreign objects in the body.
              </p>
              <p>
                The primary challenge lies in precisely controlling the degradation (corrosion) rate to match the healing timeline of the target tissue. To achieve this, we employ a powerful combination of multi-physics phase-field simulations and electrochemical modeling. This allows us to predict how different alloy compositions and microstructures will behave in the complex physiological environment. Through our computational models, we systematically optimize these materials for enhanced biocompatibility, tailored mechanical strength, and predictable degradation profiles, paving the way for safer and more effective cardiovascular stents, orthopedic screws, and drug delivery systems.
              </p>
            </div>
          </div>

          {/* 오른쪽: 대표 이미지 */}
          <div className="rounded-lg overflow-hidden elegant-shadow aspect-video">
            <img 
              src="https://images.unsplash.com/photo-1579154341183-7a916cfe5a40?q=80&w=1920" 
              alt="Biodegradable Medical Stent" 
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
              Innovating for the future of biomedical implants.
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