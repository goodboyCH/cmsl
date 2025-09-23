import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function IntroductionPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-20 py-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Introduction</h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Computational Materials Science Laboratory (CMSL) is dedicated to advancing 
          materials science through computational modeling and simulation.
        </p>
      </div>

      {/* Mission Statement */}
      <section className="relative py-12 rounded-lg elegant-shadow overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="./images/scientific_visualization_1.jpeg" 
            alt="Scientific Visualization"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 academic-gradient opacity-95"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 px-6 text-white">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-2xl opacity-90 leading-relaxed">
            "미세조직의 물리로부터 예측가능한 재료설계를 구현한다"
          </p>
          <p className="text-xl opacity-80">
            "Implement predictable material design from the physics of microstructure"
          </p>
        </div>
      </section>

      {/* Research Philosophy */}
      <section className="grid lg:grid-cols-2 gap-8">
        <Card className="elegant-shadow smooth-transition hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Research Philosophy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Our laboratory focuses on <strong>clear, verifiable, and reproducible</strong> research 
              centered on computational materials science. We prioritize English-first communication 
              with Korean annotations to ensure global accessibility.
            </p>
            <div className="space-y-2">
              <Badge variant="outline" className="mr-2">Clarity</Badge>
              <Badge variant="outline" className="mr-2">Verification</Badge>
              <Badge variant="outline" className="mr-2">Reproducibility</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="elegant-shadow smooth-transition hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Target Audience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed text-muted-foreground">
              We welcome collaboration with diverse stakeholders in the materials science community.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Graduate Students</Badge>
                <span className="text-sm text-muted-foreground">Seeking advanced research opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Research Collaborators</Badge>
                <span className="text-sm text-muted-foreground">Materials/Computation/Alloys/Devices/Corrosion/Ferroelectrics/Magnets</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Industry R&D</Badge>
                <span className="text-sm text-muted-foreground">Technology transfer and application</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Undergraduate Interns</Badge>
                <span className="text-sm text-muted-foreground">Research experience and training</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Core Capabilities */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-primary">Core Capabilities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="elegant-shadow smooth-transition hover:shadow-lg text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">PF</span>
              </div>
              <CardTitle className="text-xl">Phase-Field Modeling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Multi-phase, multi-physics simulations for microstructure evolution prediction
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="elegant-shadow smooth-transition hover:shadow-lg text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-sm font-bold text-accent">CALPHAD</span>
              </div>
              <CardTitle className="text-xl">Thermodynamics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Computational thermodynamics and phase diagram calculations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="elegant-shadow smooth-transition hover:shadow-lg text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">AI</span>
              </div>
              <CardTitle className="text-xl">AI Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Machine learning for materials optimization and accelerated discovery
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="elegant-shadow smooth-transition hover:shadow-lg text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">📊</span>
              </div>
              <CardTitle className="text-xl">Open Science</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Data and code sharing for reproducible research and collaboration
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Research Impact */}
      <section className="py-12 bg-gradient-to-r from-secondary/50 to-muted/50 rounded-lg">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <h2 className="text-3xl font-bold text-center text-primary">Research Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50+</div>
              <p className="text-muted-foreground">Research Publications</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">10+</div>
              <p className="text-muted-foreground">Industry Collaborations</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">25+</div>
              <p className="text-muted-foreground">Graduated Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratory Vision */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-primary">Laboratory Vision</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-xl text-muted-foreground leading-relaxed">
            CMSL strives to be a leading research laboratory in computational materials science, 
            bridging fundamental physics with practical materials design through advanced modeling 
            and simulation techniques.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are committed to fostering international collaboration, training the next generation 
            of materials scientists, and contributing to sustainable materials development for 
            societal benefit.
          </p>
        </div>
      </section>
    </div>
  );
}