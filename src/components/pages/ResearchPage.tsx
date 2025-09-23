import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '../LanguageProvider';
import { ScrollAnimation } from '../ScrollAnimation';

interface ResearchPageProps {
  initialTab?: string;
}

export function ResearchPage({ initialTab = 'casting' }: ResearchPageProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update activeTab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (value: string) => {
    if (value === activeTab) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(value);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-20 py-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Research Areas</h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Our research focuses on computational materials science using phase-field modeling, 
          CALPHAD thermodynamics, and AI-driven optimization techniques.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="casting">Casting Alloys</TabsTrigger>
          <TabsTrigger value="films">Thin Films</TabsTrigger>
          <TabsTrigger value="biodegradable">Biodegradable Alloys</TabsTrigger>
        </TabsList>

        <TabsContent 
          value="casting" 
          className={`space-y-8 transition-all duration-300 ${
            isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">
                {t('research.casting.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We develop advanced phase-field models to predict solidification microstructures 
                in casting alloys, focusing on industrial applications and fundamental understanding 
                of solidification processes.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden elegant-shadow">
              <img 
                src="./images/phase_field_simulation_2.png" 
                alt="Phase-field simulation of casting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="elegant-shadow smooth-transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">NdFeB Strip Casting</CardTitle>
                <Badge variant="outline">Dong-Uk Kim</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Phase-field prediction of NdFeB and Al-Fe-Mn-Si solidification behavior in strip casting. 
                  Analysis of solidification microstructure according to temperature gradients in HC1/HC2 cases.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Key Achievements:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• High-resolution NdFeB PF simulation</li>
                    <li>• Al-Si eutectic process stability analysis</li>
                    <li>• Industrial collaboration with Hyundai Motors/Steel</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="elegant-shadow smooth-transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Al/Fe Casting Alloys</CardTitle>
                <Badge variant="outline">Eutectic Growth</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Development of Al/Fe-based casting alloy solidification microstructure prediction platform 
                  with in-depth study of eutectic structure growth.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Research Focus:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Magnin-Trivedi model with PF data fitting</li>
                    <li>• Jackson-Hunt theory extension</li>
                    <li>• Eutectic growth mechanism analysis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="elegant-shadow smooth-transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">CALPHAD Thermodynamics</CardTitle>
                <Badge variant="outline">Laves C14</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Phase-field thermodynamics research using CALPHAD, particularly focusing on 
                  Laves C14 phase in Al-Cu-Mg-Zn alloy systems.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Methodology:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• CALPHAD database integration</li>
                    <li>• Multi-component phase diagram calculation</li>
                    <li>• Thermodynamic property prediction</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent 
          value="films" 
          className={`space-y-8 transition-all duration-300 ${
            isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">
                {t('research.films.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Investigation of ferroelectric and antiferroelectric properties in hafnia-based 
                thin films using advanced characterization and computational modeling techniques.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden elegant-shadow">
              <img 
                src="./images/ferroelectric_films_2.jpeg" 
                alt="Ferroelectric thin films"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="elegant-shadow smooth-transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">HfO₂/HZO Thin Films</CardTitle>
                <Badge variant="outline">FE-AFE-DE</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Research on hafnia (HfO₂) and HZO-based ferroelectric (FE), antiferroelectric (AFE), 
                  and dielectric (DE) thin films for next-generation memory and logic devices.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Key Focus Areas:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Polycrystalline thin film characterization</li>
                    <li>• Phase transition mechanisms</li>
                    <li>• Device integration challenges</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="elegant-shadow smooth-transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Domain Evolution & Magnetism</CardTitle>
                <Badge variant="outline">PFM Analysis</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Study of ferroelectric domain evolution and magnetic behavior using 
                  Piezoresponse Force Microscopy (PFM) and advanced imaging techniques.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Techniques:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Piezoresponse Force Microscopy</li>
                    <li>• Domain switching dynamics</li>
                    <li>• Magnetoelectric coupling analysis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent 
          value="biodegradable" 
          className={`space-y-8 transition-all duration-300 ${
            isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">
                {t('research.alloys.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Development of biodegradable Mg-Zn alloys with enhanced corrosion resistance 
                through microstructure control and electrochemical potential mapping.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden elegant-shadow">
              <img 
                src="./images/mg_zn_alloys_2.jpeg" 
                alt="Mg-Zn biodegradable alloys"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="elegant-shadow smooth-transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Mg-Zn Alloy Design</CardTitle>
                <Badge variant="outline">Microstructure Control</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Research on microstructure evolution and corrosion characteristics of Mg-Zn alloys 
                  for biomedical applications, focusing on controlled biodegradation rates.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Research Objectives:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Microstructure-property relationships</li>
                    <li>• Corrosion mechanism understanding</li>
                    <li>• Biocompatibility optimization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="elegant-shadow smooth-transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Electrochemical Potential Mapping</CardTitle>
                <Badge variant="outline">Mg, Al-Si Systems</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Advanced electrochemical potential mapping techniques for corrosion-resistant 
                  alloy design, providing guidelines for improved material performance.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Capabilities:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• High-resolution potential mapping</li>
                    <li>• Corrosion prediction models</li>
                    <li>• Alloy composition optimization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}