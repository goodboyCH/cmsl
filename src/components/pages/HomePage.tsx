import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../LanguageProvider';
import { ScrollAnimation } from '../ScrollAnimation';
import { ResearchHighlightsSlider } from '../ResearchHighlightsSlider';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

// --- Data for Interactive Sections ---
const capabilities = [
  { id: 1, title: "Phase-Field Modeling", description: "Advanced computational modeling of microstructure evolution, essential for predicting material properties and performance.", bgImage: "/images/capability_pfm.jpeg" },
  { id: 2, title: "AI-Accelerated Design", description: "Integration of machine learning and AI algorithms to dramatically speed up the materials discovery and design optimization cycle.", bgImage: "/images/capability_ai.jpeg" },
  { id: 3, title: "CALPHAD Thermodynamics", description: "Development and application of thermodynamic and kinetic databases for multi-component alloy systems, enabling precise phase stability analysis.", bgImage: "/images/capability_calphad.jpeg" },
  { id: 4, title: "Electrochemical Modeling", description: "Simulation of corrosion processes and electrochemical potential mapping, critical for designing durable and biodegradable materials.", bgImage: "/images/capability_electrochem.jpeg" }
];

// 1. researchTopics 배열의 path를 완전한 URL 경로로 수정
const researchTopics = [
    { title: "Casting Alloys", description: "Phase-field modeling for solidification microstructures in NdFeB, Al/Fe, and high-Si steel casting.", bgImage: "./images/phase_field_simulation_1.png", path: "/research/casting" },
    { title: "Ferroelectric Films", description: "HfO₂/HZO thin films with FE-AFE-DE transitions and domain engineering for memory applications.", bgImage: "./images/ferroelectric_films_1.png", path: "/research/films" },
    { title: "Biodegradable Alloys", description: "Mg-Zn alloy microstructure control and electrochemical potential mapping for biomedical applications.", bgImage: "./images/mg_zn_alloys_1.jpeg", path: "/research/biodegradable" }
];

interface HomePageProps {
  onPageChange: (path: string) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  const { t } = useLanguage();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      // Fetch 2 latest publications + 2 latest projects (total 4)
      const { data: pubs } = await supabase.from('publications').select('*').order('year', { ascending: false }).limit(2);
      const { data: projs } = await supabase.from('projects').select('*, created_at').order('created_at', { ascending: false }).limit(2);
      const combinedAchievements = [...(pubs || []), ...(projs || [])]
        .sort((a, b) => new Date(b.created_at || b.year).getTime() - new Date(a.created_at || a.year).getTime());
      setAchievements(combinedAchievements);

      // Fetch 2 latest news (non-pinned) + 2 latest gallery items (total 4)
      const { data: news } = await supabase.from('notices').select('id, created_at, title').eq('is_pinned', false).order('created_at', { ascending: false }).limit(2);
      const { data: gallery } = await supabase.from('gallery').select('id, created_at, title, thumbnail_url').order('created_at', { ascending: false }).limit(2);
      const combinedNews = [...(news || []).map(n => ({...n, type: 'Notice'})), ...(gallery || []).map(g => ({...g, type: 'Gallery'}))]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setLatestNews(combinedNews);
    };
    fetchLatestData();
  }, []);

  const selectedCapability = capabilities.find(c => c.id === selectedCapabilityId);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0"><img src="./images/dynamic_background_1.gif" alt="Computational Materials Science Animation" className="w-full h-full object-cover"/></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 text-center text-white">
          <div className="space-y-8 bg-black/40 backdrop-blur-sm rounded-2xl p-8 lg:p-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-center whitespace-pre-line">{t('home.hero.title')}</h1>
            <p className="text-xl md:text-2xl lg:text-3xl opacity-90 leading-relaxed max-w-5xl mx-auto whitespace-pre-line">{t('home.hero.subtitle')}</p>
            <p className="text-lg md:text-xl opacity-80 max-w-4xl mx-auto">{t('home.hero.capabilities')}</p>
            <div className="pt-6"><Badge variant="secondary" className="text-lg md:text-xl px-8 py-3 bg-white/20 text-white border-white/30 hover:bg-white/30 cursor-pointer transition-all" onClick={() => onPageChange('/contact')}>협업 및 인턴 모집중 | Collaboration & Internship Recruitment →</Badge></div>
          </div>
        </div>
      </section>

      {/* Section 1: Core Capabilities (White Background) */}
      <div className="w-full py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-16">
          <ScrollAnimation>
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-center text-primary">Core Capabilities</h2>
              <div className="relative" onMouseLeave={() => setSelectedCapabilityId(null)}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 min-h-[20rem]">
                  {capabilities.map((cap) => (
                    <motion.div key={cap.id} layoutId={`capability-card-${cap.id}`} onMouseEnter={() => setSelectedCapabilityId(cap.id)} className="relative h-full min-h-[20rem] rounded-lg overflow-hidden cursor-pointer elegant-shadow">
                      <motion.img layoutId={`capability-img-${cap.id}`} src={cap.bgImage} alt={cap.title} className="absolute inset-0 w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-black/50"/>
                      <motion.div layout="position" className="relative z-10 flex items-center justify-center h-full p-4">
                        <h3 className={`font-bold text-white text-xl text-center transition-opacity duration-200 ${selectedCapabilityId !== null ? 'opacity-0' : 'opacity-100'}`}>{cap.title}</h3>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                <AnimatePresence>
                  {selectedCapability && (
                    <motion.div layoutId={`capability-card-${selectedCapability.id}`} className="absolute inset-0 w-full h-full rounded-lg overflow-hidden elegant-shadow bg-card z-10">
                      <motion.img layoutId={`capability-img-${selectedCapability.id}`} src={selectedCapability.bgImage} alt={selectedCapability.title} className="absolute inset-0 w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"/>
                      <motion.div layout="position" className="relative z-10 p-8 md:p-12 text-white h-full flex flex-col justify-start items-start text-left">
                        <h3 className="font-bold text-3xl">{selectedCapability.title}</h3>
                        <p className="mt-2 max-w-md">{selectedCapability.description}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </ScrollAnimation>
        </div>
      </div>

      {/* Section 2: Research Topics (Blueish Background) */}
      <div className="w-full py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-16">
          <ScrollAnimation delay={200}>
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-center text-primary">Research Topics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {researchTopics.map((topic) => (
                  <Card 
                    key={topic.title} 
                    className="elegant-shadow smooth-transition hover:shadow-lg group cursor-pointer relative overflow-hidden h-80" 
                    // 2. onClick 핸들러가 수정된 topic.path를 직접 사용
                    onClick={() => onPageChange(topic.path)}
                  >
                    <div className="absolute inset-0"><img src={topic.bgImage} alt={topic.title} className="w-full h-full object-cover group-hover:scale-105 smooth-transition"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div></div>
                    <CardContent className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                      <h3 className="text-xl font-bold">{topic.title}</h3>
                      <p className="text-sm text-white/90 mt-2">{topic.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </ScrollAnimation>
        </div>
      </div>

      {/* Section 3: Research Highlights (Full Bleed Blue Background) */}
      <ScrollAnimation>
        <section className="w-full gradient-primary py-24 text-white scientific-pattern">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-16">
            <h2 className="text-3xl font-bold text-center mb-12">Research Highlights</h2>
            <ResearchHighlightsSlider />
          </div>
        </section>
      </ScrollAnimation>
      
      {/* Section 4: 2x2 Grid (White Background) */}
      <div className="w-full py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ScrollAnimation>
            <section className="h-full flex flex-col">
              <div className="text-center mb-8"><h2 className="text-3xl font-bold text-primary">Recent Research Achievements</h2></div>
              <Card className="flex-grow elegant-shadow"><CardContent className="p-6 space-y-6">
                {achievements.slice(0, 4).map(item => (
                  <div key={`${item.id}-${item.title}`} className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex-grow">
                      <Badge variant="outline" className="text-xs">{item.authors ? 'Publication' : 'Project'}</Badge>
                      <h4 className="font-semibold mt-1 leading-snug">{item.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{item.authors || item.pi}</p>
                    </div>
                    {(item.image_url || item.thumbnail_url) && (
                      <img src={item.image_url || item.thumbnail_url} alt={item.title} className="w-20 h-20 object-cover rounded-md border flex-shrink-0"/>
                    )}
                  </div>
                ))}
              </CardContent><CardFooter className="justify-center pt-4 border-t"><Button variant="outline" onClick={() => onPageChange('/publications')}>View More →</Button></CardFooter></Card>
            </section>
          </ScrollAnimation>

          <ScrollAnimation>
            <section className="h-full flex flex-col">
              <div className="text-center mb-8"><h2 className="text-3xl font-bold text-primary">Latest News</h2></div>
              <Card className="flex-grow elegant-shadow"><CardContent className="p-6 space-y-6">
                {latestNews.slice(0, 4).map(item => (
                  <div key={`${item.id}-${item.type}`} className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0 cursor-pointer" onClick={() => onPageChange(item.type === 'Notice' ? '/board/news' : '/board/gallery')}>
                    <div className="flex-grow">
                      <Badge variant={item.type === 'Notice' ? 'default' : 'secondary'} className="text-xs">{item.type}</Badge>
                      <h4 className="font-semibold mt-1 leading-snug hover:text-primary">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    {item.thumbnail_url && (
                       <img src={item.thumbnail_url} alt={item.title} className="w-20 h-20 object-cover rounded-md border flex-shrink-0"/>
                    )}
                  </div>
                ))}
              </CardContent><CardFooter className="justify-center pt-4 border-t"><Button variant="outline" onClick={() => onPageChange('/board/news')}>View More →</Button></CardFooter></Card>
            </section>
          </ScrollAnimation>
        </div>
      </div>

      {/* Section 5: Videos (Blueish Background) */}
      <div className="w-full py-24 bg-primary/5">
        <ScrollAnimation>
          <section className="max-w-5xl mx-auto px-6 lg:px-12 xl:px-16">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Research Video</h2>
            <Card className="elegant-shadow smooth-transition hover:shadow-lg overflow-hidden">
              <div className="aspect-video">
                <iframe className="w-full h-full" src="https://www.youtube.com/embed/eGm6wdU6cn4" title="CMSL Laboratory Introduction Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </div>
            </Card>
          </section>
        </ScrollAnimation>
      </div>
    </div>
  );
}