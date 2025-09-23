import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../LanguageProvider';
import { ScrollAnimation } from '../ScrollAnimation';
import { ProfessorPage } from './ProfessorPage';
import { MembersPage } from './MembersPage';
import { AlumniPage } from './AlumniPage';

export function PeoplePage() {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<'overview' | 'professor' | 'members' | 'alumni'>('overview');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleViewChange = (view: 'overview' | 'professor' | 'members' | 'alumni') => {
    if (view === currentView) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  if (currentView === 'professor') {
    return (
      <div className={`max-w-[1400px] mx-auto px-8 lg:px-20 py-8 transition-all duration-300 ${
        isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
      }`}>
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => handleViewChange('overview')}
            className="mb-4"
          >
            ← Back to People Overview
          </Button>
        </div>
        <ProfessorPage />
      </div>
    );
  }

  if (currentView === 'members') {
    return (
      <div className={`max-w-[1400px] mx-auto px-8 lg:px-20 py-8 transition-all duration-300 ${
        isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
      }`}>
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => handleViewChange('overview')}
            className="mb-4"
          >
            ← Back to People Overview
          </Button>
        </div>
        <MembersPage />
      </div>
    );
  }

  if (currentView === 'alumni') {
    return (
      <div className={`max-w-[1400px] mx-auto px-8 lg:px-20 py-8 transition-all duration-300 ${
        isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
      }`}>
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => handleViewChange('overview')}
            className="mb-4"
          >
            ← Back to People Overview
          </Button>
        </div>
        <AlumniPage />
      </div>
    );
  }

  return (
    <div className={`max-w-[1400px] mx-auto px-8 lg:px-20 py-8 space-y-12 transition-all duration-300 ${
      isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
    }`}>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">People</h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Meet our research team - from our distinguished faculty to talented students and dedicated staff, 
          all working together to advance computational materials science.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Professor Card */}
        <Card 
          className="elegant-shadow smooth-transition hover:shadow-lg cursor-pointer group"
          onClick={() => handleViewChange('professor')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 smooth-transition">
              <span className="text-3xl font-bold text-primary">차</span>
            </div>
            <CardTitle className="text-2xl text-primary">{t('nav.professor')}</CardTitle>
            <CardDescription>Principal Investigator</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Prof. Cha Pil-Ryung leads our laboratory with expertise in phase-field modeling 
              and computational materials science.
            </p>
            <div className="space-y-2">
              <Badge variant="outline" className="mr-2">Director</Badge>
              <Badge variant="outline" className="mr-2">Phase-Field Expert</Badge>
              <Badge variant="outline">CALPHAD Specialist</Badge>
            </div>
            <Button className="w-full academic-gradient text-white group-hover:shadow-lg smooth-transition">
              View Profile →
            </Button>
          </CardContent>
        </Card>

        {/* Members Card */}
        <Card 
          className="elegant-shadow smooth-transition hover:shadow-lg cursor-pointer group"
          onClick={() => handleViewChange('members')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 smooth-transition">
              <span className="text-2xl font-bold text-accent">👥</span>
            </div>
            <CardTitle className="text-2xl text-primary">{t('nav.members')}</CardTitle>
            <CardDescription>Current Research Team</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Our diverse team of postdocs, PhD students, MS students, and staff members 
              working on cutting-edge research projects.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-primary/10 rounded p-2">
                <div className="font-bold text-primary">5</div>
                <div className="text-muted-foreground">Postdocs</div>
              </div>
              <div className="bg-accent/10 rounded p-2">
                <div className="font-bold text-accent">3</div>
                <div className="text-muted-foreground">PhD Students</div>
              </div>
              <div className="bg-secondary/50 rounded p-2">
                <div className="font-bold text-primary">3</div>
                <div className="text-muted-foreground">MS Students</div>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <div className="font-bold text-accent">2</div>
                <div className="text-muted-foreground">Staff</div>
              </div>
            </div>
            <Button className="w-full academic-gradient text-white group-hover:shadow-lg smooth-transition">
              Meet the Team →
            </Button>
          </CardContent>
        </Card>

        {/* Alumni Card */}
        <Card 
          className="elegant-shadow smooth-transition hover:shadow-lg cursor-pointer group"
          onClick={() => handleViewChange('alumni')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-secondary/30 to-muted/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 smooth-transition">
              <span className="text-2xl font-bold text-primary">🎓</span>
            </div>
            <CardTitle className="text-2xl text-primary">{t('nav.alumni')}</CardTitle>
            <CardDescription>Our Graduate Network</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Our alumni have gone on to successful careers in academia, industry, 
              and research institutions worldwide.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Alumni:</span>
                <span className="font-bold text-primary">25+</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Countries:</span>
                <span className="font-bold text-accent">15+</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Industry:</span>
                <span className="font-bold text-primary">60%</span>
              </div>
            </div>
            <Button className="w-full academic-gradient text-white group-hover:shadow-lg smooth-transition">
              Alumni Network →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Overview */}
      <section className="py-12 bg-gradient-to-r from-secondary/50 to-muted/50 rounded-lg">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <h2 className="text-3xl font-bold text-center text-primary">Research Excellence</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center elegant-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">120+</div>
                <p className="text-sm text-muted-foreground">Publications</p>
              </CardContent>
            </Card>
            <Card className="text-center elegant-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">3,500+</div>
                <p className="text-sm text-muted-foreground">Citations</p>
              </CardContent>
            </Card>
            <Card className="text-center elegant-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <p className="text-sm text-muted-foreground">Countries</p>
              </CardContent>
            </Card>
            <Card className="text-center elegant-shadow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <p className="text-sm text-muted-foreground">Industry Partners</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Areas by Team */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-primary">Research Expertise</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Phase-Field Modeling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Advanced computational techniques for microstructure evolution prediction.
              </p>
              <div className="space-y-1 text-xs">
                <p><span className="font-medium">Lead:</span> Prof. Cha, Dr. Kim D.U.</p>
                <p><span className="font-medium">Students:</span> Jang H.U., Jo H.J.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Ferroelectric Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                HfO₂-based thin films and domain engineering for memory applications.
              </p>
              <div className="space-y-1 text-xs">
                <p><span className="font-medium">Lead:</span> Dr. Pankaj, Dr. Pritan</p>
                <p><span className="font-medium">Students:</span> Bang J.H.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-primary">AI & Materials Informatics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Machine learning integration for accelerated materials discovery.
              </p>
              <div className="space-y-1 text-xs">
                <p><span className="font-medium">Lead:</span> Prof. Cha</p>
                <p><span className="font-medium">Students:</span> Tariq Ali</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}