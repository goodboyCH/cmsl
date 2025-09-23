import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollAnimation } from '../ScrollAnimation';
import { GraduationCap, Briefcase, Calendar, Award } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Alumni {
  id: number;
  name: string;
  degree: string;
  thesis: string;
  current_position: string;
  achievements: string[];
  year_range: string;
}

export function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      const { data } = await supabase.from('alumni').select('*').order('created_at', { ascending: false });
      setAlumni(data || []);
      setLoading(false);
    };
    fetchAlumni();
  }, []);

  const getDegreeColor = (degree: string) => {
    if (degree.includes('Ph.D.')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  };

  const getPositionType = (position: string) => {
    if (position.includes('Professor') || position.includes('Assistant Professor')) return 'academic';
    if (position.includes('Student')) return 'student';
    return 'industry';
  };

  const getPositionIcon = (position: string) => {
    const type = getPositionType(position);
    if (type === 'academic' || type === 'student') return <GraduationCap className="h-4 w-4" />;
    return <Briefcase className="h-4 w-4" />;
  };

  if (loading) return <p className="text-center p-12">Loading alumni...</p>;

  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-8 space-y-8">
      <ScrollAnimation>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Alumni</h1>
          <p className="text-xl text-muted-foreground">
            Celebrating the achievements of our graduated researchers
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation delay={100}>
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="elegant-shadow text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {alumni.filter(a => a.degree.includes('Ph.D.')).length}
              </div>
              <p className="text-muted-foreground">Ph.D. Graduates</p>
            </CardContent>
          </Card>
          <Card className="elegant-shadow text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {alumni.filter(a => a.degree.includes('M.S.')).length}
              </div>
              <p className="text-muted-foreground">M.S. Graduates</p>
            </CardContent>
          </Card>
          <Card className="elegant-shadow text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {alumni.filter(a => getPositionType(a.current_position) === 'academic' || getPositionType(a.current_position) === 'student').length}
              </div>
              <p className="text-muted-foreground">In Academia</p>
            </CardContent>
          </Card>
          <Card className="elegant-shadow text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {alumni.filter(a => getPositionType(a.current_position) === 'industry').length}
              </div>
              <p className="text-muted-foreground">In Industry</p>
            </CardContent>
          </Card>
        </div>
      </ScrollAnimation>

      <ScrollAnimation delay={200}>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Our Graduates</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {alumni.map((alum, index) => (
              <ScrollAnimation key={alum.id} delay={index * 50}>
                <Card className="elegant-shadow smooth-transition hover:shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getDegreeColor(alum.degree)}>
                        {alum.degree}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {alum.year_range}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{alum.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-primary mb-2">Thesis</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {alum.thesis}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-primary mb-2 flex items-center gap-2">
                        {getPositionIcon(alum.current_position)}
                        Current Position
                      </h4>
                      <p className="text-sm font-medium">
                        {alum.current_position}
                      </p>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-3 w-3 text-primary" />
                        <span className="text-sm font-medium text-primary">Achievements</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(alum.achievements || []).map((achievement, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </ScrollAnimation>

      <ScrollAnimation delay={300}>
        <Card className="elegant-shadow">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Career Paths</CardTitle>
            <CardDescription>
              Where our alumni are making their mark in the world
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h4 className="font-bold text-lg text-primary">Academia</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Assistant/Associate Professors</li>
                  <li>• Postdoctoral Researchers</li>
                  <li>• Ph.D. Students (Continuing)</li>
                  <li>• Research Scientists</li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h4 className="font-bold text-lg text-primary">Industry</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Samsung Electronics</li>
                  <li>• POSCO Holdings</li>
                  <li>• LG Chem</li>
                  <li>• Hyundai Motor Group</li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h4 className="font-bold text-lg text-primary">Research Institutes</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• KIMS (Korea Institute of Materials Science)</li>
                  <li>• KIST (Korea Institute of Science and Technology)</li>
                  <li>• KAIST (Korea Advanced Institute of Science and Technology)</li>
                  <li>• International Universities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollAnimation>
    </div>
  );
}