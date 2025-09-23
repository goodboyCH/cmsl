import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollAnimation } from '../ScrollAnimation';
import { Mail, Phone, MapPin, Award, BookOpen, Users } from 'lucide-react';

export function ProfessorPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-8 space-y-8">
      {/* Header */}
      <ScrollAnimation>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Professor</h1>
          <p className="text-xl text-muted-foreground">
            Meet our distinguished faculty member leading computational materials science research
          </p>
        </div>
      </ScrollAnimation>

      {/* Professor Profile */}
      <ScrollAnimation delay={100}>
        <Card className="elegant-shadow">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Photo */}
              <div className="space-y-4">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">P.R.C</span>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-primary">Prof. Pil-Ryung Cha</h2>
                  <p className="text-muted-foreground">Principal Investigator</p>
                  <Badge className="bg-primary/10 text-primary">Director, CMSL</Badge>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-sm">prcha@kookmin.ac.kr</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-sm">+82-2-910-4656</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm">Room 932, Engineering Building</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Education</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">Ph.D. Materials Science & Engineering</p>
                      <p className="text-sm text-muted-foreground">Northwestern University, USA (1998)</p>
                    </div>
                    <div>
                      <p className="font-medium">M.S. Materials Science & Engineering</p>
                      <p className="text-sm text-muted-foreground">KAIST, Korea (1992)</p>
                    </div>
                    <div>
                      <p className="font-medium">B.S. Materials Science & Engineering</p>
                      <p className="text-sm text-muted-foreground">Seoul National University, Korea (1990)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Interests */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Research Interests</h3>
                  <div className="space-y-2">
                    <Badge variant="outline">Phase-Field Modeling</Badge>
                    <Badge variant="outline">Computational Thermodynamics</Badge>
                    <Badge variant="outline">Ferroelectric Materials</Badge>
                    <Badge variant="outline">Solidification Processes</Badge>
                    <Badge variant="outline">AI-Materials Integration</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Professional Experience</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">Professor (2008-Present)</p>
                      <p className="text-sm text-muted-foreground">Kookmin University</p>
                    </div>
                    <div>
                      <p className="font-medium">Associate Professor (2003-2008)</p>
                      <p className="text-sm text-muted-foreground">Kookmin University</p>
                    </div>
                    <div>
                      <p className="font-medium">Assistant Professor (1999-2003)</p>
                      <p className="text-sm text-muted-foreground">Kookmin University</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollAnimation>

      {/* Research Achievements */}
      <ScrollAnimation delay={200}>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="elegant-shadow text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <p className="text-muted-foreground">Publications</p>
            </CardContent>
          </Card>

          <Card className="elegant-shadow text-center">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 mx-auto text-primary mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <p className="text-muted-foreground">Awards & Honors</p>
            </CardContent>
          </Card>

          <Card className="elegant-shadow text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto text-primary mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Graduated Students</p>
            </CardContent>
          </Card>
        </div>
      </ScrollAnimation>

      {/* Recent Achievements */}
      <ScrollAnimation delay={300}>
        <Card className="elegant-shadow">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Recent Research Achievements</CardTitle>
            <CardDescription>
              Highlighting major contributions to computational materials science
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-bold text-lg">AI-Accelerated Phase-Field Modeling</h4>
                <p className="text-muted-foreground mb-2">Nature Materials (2024)</p>
                <p className="text-sm">
                  Pioneered the integration of machine learning with phase-field simulations, 
                  achieving unprecedented accuracy in ferroelectric domain prediction.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-bold text-lg">NRF Distinguished Research Grant</h4>
                <p className="text-muted-foreground mb-2">National Research Foundation (2024)</p>
                <p className="text-sm">
                  Awarded 5-year research grant for developing AI-accelerated materials design platform.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-bold text-lg">Samsung Electronics Collaboration</h4>
                <p className="text-muted-foreground mb-2">Industry Partnership (2024)</p>
                <p className="text-sm">
                  Leading joint research on ferroelectric memory device optimization using computational modeling.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollAnimation>
    </div>
  );
}