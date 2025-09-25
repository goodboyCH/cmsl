import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollAnimation } from '../ScrollAnimation';
import { supabase } from '@/lib/supabaseClient';
import { Aperture, Atom, FlaskConical, Users, LucideProps } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType<LucideProps> } = {
  Clarity: Aperture,
  Collaboration: Users,
  Industry: Atom,
  Talent: FlaskConical,
};

interface IntroductionContent {
  mission_section?: { image_url: string; title: string; korean_mission: string; english_mission: string; };
  core_values_section?: { title: string; values: { icon: string; title: string; description: string }[]; };
  vision_section?: { title: string; paragraphs: string[]; };
}

export function IntroductionPage() {
  const [content, setContent] = useState<IntroductionContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data } = await supabase.from('pages').select('content').eq('page_key', 'introduction').single();
      if (data?.content) {
        setContent(data.content);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  if (loading) return <p className="text-center p-20">Loading Introduction...</p>;
  if (!content) return <p className="text-center p-20">Failed to load content. Please add data in the admin panel.</p>;

  return (
    <div className="container py-12 space-y-24">
      {/* Mission Section */}
      {content.mission_section && (
        <ScrollAnimation>
          <section className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden elegant-shadow aspect-video">
              <img src={content.mission_section.image_url} alt="Mission" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-primary">{content.mission_section.title}</h2>
              <p className="text-2xl font-semibold leading-relaxed">"{content.mission_section.korean_mission}"</p>
              <p className="text-xl text-muted-foreground">"{content.mission_section.english_mission}"</p>
            </div>
          </section>
        </ScrollAnimation>
      )}
      
      {/* Core Values Section */}
      {content.core_values_section && (
        <ScrollAnimation delay={100}>
          <section className="space-y-12">
            <h2 className="text-3xl font-bold text-center text-primary">{content.core_values_section.title}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(content.core_values_section.values || []).map((value, index) => {
                const IconComponent = iconMap[value.icon] || Atom;
                return (
                  <Card key={index} className="elegant-shadow text-center">
                    <CardHeader>
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent><CardDescription>{value.description}</CardDescription></CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </ScrollAnimation>
      )}

      {/* Vision Section */}
      {content.vision_section && (
        <ScrollAnimation delay={200}>
          <section className="text-center space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary">{content.vision_section.title}</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              {(content.vision_section.paragraphs || []).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        </ScrollAnimation>
      )}
    </div>
  );
}