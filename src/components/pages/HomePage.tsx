import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../LanguageProvider';
import { ScrollAnimation } from '../ScrollAnimation';
import { ResearchHighlightsSlider } from '../ResearchHighlightsSlider';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

// 1. 하드코딩된 capabilities와 researchTopics 배열을 삭제합니다.
// const capabilities = [ ... ];
// const researchTopics = [ ... ];

interface HomePageProps {
  onPageChange: (path: string) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  const { t } = useLanguage();
  // 2. 페이지 전체 콘텐츠를 담을 새로운 state를 만듭니다.
  const [pageContent, setPageContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // achievements와 latestNews state는 그대로 유지합니다.
  const [achievements, setAchievements] = useState<any[]>([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);

      // 3. 'pages' 테이블에서 'home' 키를 가진 콘텐츠를 불러옵니다.
      const { data: pageData } = await supabase
        .from('pages')
        .select('content')
        .eq('page_key', 'home')
        .single();
      
      if (pageData?.content) {
        setPageContent(pageData.content);
      }

      // Achievements와 News 데이터 페칭 로직은 그대로 유지합니다.
      const { data: pubs } = await supabase.from('publications').select('*, created_at').order('created_at', { ascending: false }).limit(4);
      const { data: projs } = await supabase.from('projects').select('*, created_at').order('created_at', { ascending: false }).limit(4);
      const combinedAchievements = [...(pubs || []), ...(projs || [])]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);
      setAchievements(combinedAchievements);

      const { data: news } = await supabase.from('notices').select('id, created_at, title, content').eq('is_pinned', false).order('created_at', { ascending: false }).limit(2);
      const { data: gallery } = await supabase.from('gallery').select('id, created_at, title, thumbnail_url, content').order('created_at', { ascending: false }).limit(2);
      const combinedNews = [...(news || []).map(n => ({...n, type: 'Notices & News'})), ...(gallery || []).map(g => ({...g, type: 'Gallery'}))]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setLatestNews(combinedNews);
      
      setLoading(false);
    };
    fetchPageData();
  }, []);

  // 4. selectedCapability 로직을 DB에서 불러온 데이터 기준으로 변경합니다.
  const selectedCapability = pageContent?.capabilities?.find((c: any) => c.id === selectedCapabilityId);

  const stripHtmlAndTruncate = (html: string, length: number) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').substring(0, length);
  };

  if (loading || !pageContent) {
    return <div className="text-center p-20">Loading Home Page...</div>;
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 5. 모든 하드코딩된 값을 pageContent state에서 가져옵니다. */}
        <div className="absolute inset-0 z-0"><video
          // pageContent에서 비디오 URL을 동적으로 가져옵니다.
          src={pageContent.hero.background_video_url} 
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        /></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 text-center text-white">
          <div className="space-y-8 bg-black/40 backdrop-blur-sm rounded-2xl p-8 lg:p-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-center whitespace-pre-line">{pageContent.hero.title}</h1>
            <p className="text-xl md:text-2xl lg:text-3xl opacity-90 leading-relaxed max-w-5xl mx-auto whitespace-pre-line">{pageContent.hero.subtitle}</p>
            <p className="text-lg md:text-xl opacity-80 max-w-4xl mx-auto">{pageContent.hero.capabilities_text}</p>
            <div className="pt-6"><Badge variant="secondary" className="text-lg md:text-xl px-8 py-3 bg-white/20 text-white border-white/30 hover:bg-white/30 cursor-pointer transition-all" onClick={() => onPageChange('/contact')}>{pageContent.hero.recruitment_text} →</Badge></div>
          </div>
        </div>
      </section>

      {/* Section 1: Core Capabilities */}
      <div className="w-full py-24 bg-background">
        <div className="container">
          <ScrollAnimation>
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-center text-primary">Core Capabilities</h2>
              <div className="relative" onMouseLeave={() => setSelectedCapabilityId(null)}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 min-h-[28rem]">
                  {/* 5. capabilities 배열을 pageContent.capabilities로 변경합니다. */}
                  {(pageContent.capabilities || []).map((cap: any) => (
                    <motion.div key={cap.id} layoutId={`capability-card-${cap.id}`} onMouseEnter={() => setSelectedCapabilityId(cap.id)} className="relative h-full rounded-lg overflow-hidden cursor-pointer elegant-shadow">
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
                        <p className="mt-2 max-w-xl text-lg whitespace-pre-line">{selectedCapability.description}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </ScrollAnimation>
        </div>
      </div>

      {/* Section 2: Research Topics */}
      <div className="w-full py-24 md:py-32 bg-primary/5">
        <div className="container">
          <ScrollAnimation delay={200}>
            <section className="space-y-12">
              <h2 className="text-3xl font-bold text-center text-primary">Research Topics</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {/* 5. researchTopics 배열을 pageContent.research_topics로 변경합니다. */}
                {(pageContent.research_topics || []).map((topic: any) => (
                  <Card key={topic.title} className="elegant-shadow smooth-transition hover:shadow-lg group cursor-pointer relative overflow-hidden h-96" onClick={() => onPageChange(topic.path)}>
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

      {/* Section 3: Research Highlights */}
      <ScrollAnimation>
        <section className="w-full gradient-primary py-24 text-white scientific-pattern">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-16">
            <h2 className="text-3xl font-bold text-center mb-12">Research Highlights</h2>
            {/* 6. ResearchHighlightsSlider에 DB에서 불러온 데이터를 prop으로 전달합니다. */}
            <ResearchHighlightsSlider highlights={pageContent.research_highlights || []} />
          </div>
        </section>
      </ScrollAnimation>
      
      {/* --- ⬇️ Achievements & News Section 수정 시작 ⬇️ --- */}
      <div className="w-full py-24 md:py-32 bg-background">
        <div className="container space-y-24">
          {/* Recent Achievements */}
          <ScrollAnimation>
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-primary">Recent Achievements</h2>
                <Button variant="link" onClick={() => onPageChange('/publications')}>View All →</Button>
              </div>
              {/* --- ⬇️ 모바일에서는 2열, 데스크톱에서는 4열 그리드로 변경 ⬇️ --- */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {achievements.map(item => (
                  // ⬇️ onClick 로직을 수정하여 모든 항목이 '/publications'로 이동하도록 변경 ⬇️
                  <div key={`${item.id}-${item.title}`} className="cursor-pointer group" onClick={() => onPageChange('/publications')}>
                    <div className="overflow-hidden rounded-lg mb-4 aspect-[4/3] border">
                      <img src={item.image_url || item.thumbnail_url || '/images/logo.png'} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.authors ? 'PUBLICATION' : 'PROJECT'} · {new Date(item.created_at).toLocaleDateString()}</p>
                    <h3 className="text-base sm:text-lg font-semibold mt-1 leading-snug group-hover:text-primary transition-colors">{item.title}</h3>
                    {/* 모바일에서는 긴 설명을 숨겨서 카드 높이를 맞춥니다. */}
                    <p className="text-sm sm:text-base text-muted-foreground mt-2 hidden sm:block">
                      {stripHtmlAndTruncate(item.abstract || item.description, 80)}...
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollAnimation>

          <div className="border-b-2 border-primary/20"></div>

          {/* Latest News */}
          <ScrollAnimation>
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-primary">Latest News</h2>
                <Button variant="link" onClick={() => onPageChange('/board/news')}>View All →</Button>
              </div>
              
              {latestNews.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-24">
                  <div 
                    className="cursor-pointer group flex flex-col h-full lg:col-span-11"
                    onClick={() => onPageChange(latestNews[0].type === 'Notices & News' ? `/board/news/${latestNews[0].id}` : `/board/gallery/${latestNews[0].id}`)}
                  >
                    <div className="overflow-hidden rounded-lg mb-4 aspect-video border">
                      <img src={latestNews[0].thumbnail_url || '/images/logo.png'} alt={latestNews[0].title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <p className="text-sm text-muted-foreground">{latestNews[0].type.toUpperCase()} · {new Date(latestNews[0].created_at).toLocaleDateString()}</p>
                      <h3 className="text-3xl font-bold mt-1 leading-tight group-hover:text-primary transition-colors">{latestNews[0].title}</h3>
                      <p className="text-base text-muted-foreground mt-3 leading-relaxed flex-grow">
                        {stripHtmlAndTruncate(latestNews[0].content, 120)}...
                      </p>
                    </div>
                  </div>

                  {/* --- ⬇️ 모바일에서 큰 항목과의 간격을 위해 mb-8 추가 ⬇️ --- */}
                  <div className="flex flex-col h-full space-y-4 lg:col-span-11 lg:col-start-14 mt-8 lg:mt-0">
                    {latestNews.slice(1, 4).map(item => (
                      <div key={`${item.id}-${item.type}`} className="flex-1 cursor-pointer group flex flex-col" onClick={() => onPageChange(item.type === 'Notices & News' ? `/board/news/${item.id}` : `/board/gallery/${item.id}`)}>
                        <div className="flex items-start gap-4 flex-grow">
                          <div className="flex-grow">
                            <p className="text-sm text-muted-foreground">{item.type.toUpperCase()} · {new Date(item.created_at).toLocaleDateString()}</p>
                            <h4 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">{item.title}</h4>
                          </div>
                          <div className="w-32 flex-shrink-0 aspect-video overflow-hidden rounded-lg border">
                            <img src={item.thumbnail_url || '/images/logo.png'} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          </div>
                        </div>
                        <div className="border-b mt-4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </ScrollAnimation>
        </div>
      </div>
      {/* --- ⬆️ Achievements & News Section 수정 완료 ⬆️ --- */}

      {/* Section 5: Videos */}
      <div className="w-full py-24 bg-primary/5">
        <ScrollAnimation>
          <section className="max-w-5xl mx-auto px-6 lg:px-12 xl:px-16">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Research Video</h2>
            <Card className="elegant-shadow smooth-transition hover:shadow-lg overflow-hidden">
              <div className="aspect-video">
                {/* 5. 비디오 src를 pageContent.video_src로 변경합니다. */}
                <iframe className="w-full h-full" src={pageContent.video_src} title="CMSL Laboratory Introduction Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </div>
            </Card>
          </section>
        </ScrollAnimation>
      </div>
    </div>
  );
}