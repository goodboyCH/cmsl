import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../LanguageProvider'; // 경로 확인 필요
import { ScrollAnimation } from '../ScrollAnimation';
import { ResearchHighlightsSlider } from '../ResearchHighlightsSlider';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

interface HomePageProps {
  onPageChange: (path: string) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  const { t, language } = useLanguage(); // language 상태 가져오기
  const [pageContent, setPageContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [achievements, setAchievements] = useState<any[]>([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<number | null>(null);

  // 🌍 언어 선택 헬퍼 함수 (JSON 데이터용)
  const getContent = (data: any, field: string) => {
    if (!data) return '';
    // 한국어 모드이고, 해당 필드의 _ko 버전이 존재하고 비어있지 않다면 반환
    if (language === 'ko' && data[`${field}_ko`]) {
      return data[`${field}_ko`];
    }
    // 기본값(영어) 반환
    return data[field] || '';
  };

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);

      const { data: pageData } = await supabase
        .from('pages')
        .select('content')
        .eq('page_key', 'home')
        .single();

      if (pageData?.content) {
        setPageContent(pageData.content);
      }

      // Achievements & News 로직 (기존 동일)
      const { data: pubs } = await supabase.from('publications').select('*, created_at').order('created_at', { ascending: false }).limit(4);
      const { data: projs } = await supabase.from('projects').select('*, created_at').order('created_at', { ascending: false }).limit(4);
      const combinedAchievements = [...(pubs || []), ...(projs || [])]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);
      setAchievements(combinedAchievements);

      const { data: news } = await supabase.from('notices').select('id, created_at, title, title_ko, content, content_ko').eq('is_pinned', false).order('created_at', { ascending: false }).limit(4);
      const { data: gallery } = await supabase.from('gallery').select('id, created_at, title, title_ko, thumbnail_url, content, content_ko').order('created_at', { ascending: false }).limit(4);

      // 뉴스/갤러리 데이터 매핑 시 언어 처리 미리 적용 가능 (여기서는 렌더링 시 처리)
      const combinedNews = [...(news || []).map(n => ({ ...n, type: 'notice' })), ...(gallery || []).map(g => ({ ...g, type: 'gallery' }))]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setLatestNews(combinedNews);

      setLoading(false);
    };
    fetchPageData();
  }, []); // language가 바뀌어도 다시 fetch할 필요는 없음 (렌더링 시 처리하므로)

  const selectedCapability = pageContent?.capabilities?.find((c: any) => c.id === selectedCapabilityId);

  const stripHtmlAndTruncate = (html: string, length: number) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').substring(0, length);
  };

  if (loading || !pageContent) {
    return <div className="text-center p-20">{t('common.loading')}</div>;
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 select-none">
          <video
            src={pageContent.hero.background_gif_url}
            className="absolute inset-0 w-full h-full object-cover z-0"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Softer overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center text-white">
          <ScrollAnimation>
            <div className="space-y-8 py-10">
              {/* 🌍 getContent 적용 */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-center whitespace-pre-line drop-shadow-xl">
                {getContent(pageContent.hero, 'title')}
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl font-light opacity-90 leading-relaxed max-w-4xl mx-auto whitespace-pre-line drop-shadow-md">
                {getContent(pageContent.hero, 'subtitle')}
              </p>
              <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onPageChange('/contact')}
                  className="px-10 py-4 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
                >
                  {getContent(pageContent.hero, 'recruitment_text')}
                </button>
                <button
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 text-lg font-medium rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  Explore More
                </button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Section 1: Core Capabilities */}
      <div className="w-full py-24 lg:py-32 bg-background">
        <div className="container">
          <ScrollAnimation>
            <section className="space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Core Capabilities</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  We combine advanced simulation with data-driven approaches to solve complex materials challenges.
                </p>
              </div>

              <div className="relative" onMouseLeave={() => setSelectedCapabilityId(null)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 min-h-[32rem]">
                  {(pageContent.capabilities || []).map((cap: any) => (
                    <motion.div
                      key={cap.id}
                      layoutId={`capability-card-${cap.id}`}
                      onMouseEnter={() => setSelectedCapabilityId(cap.id)}
                      className="relative h-full rounded-2xl overflow-hidden cursor-pointer elegant-shadow smooth-transition group bg-card border border-border/50 hover:-translate-y-1"
                    >
                      <motion.img
                        layoutId={`capability-img-${cap.id}`}
                        src={cap.bgImage}
                        alt={cap.title}
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 smooth-transition scale-100 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-60 smooth-transition" />

                      <motion.div layout="position" className="relative z-10 flex flex-col items-center justify-end h-full p-8 pb-12 text-center">
                        <div className="w-12 h-1 bg-primary mb-6 rounded-full opacity-0 group-hover:opacity-100 smooth-transition" />
                        {/* 🌍 getContent 적용 */}
                        <h3 className={`font-bold text-white text-2xl smooth-transition ${selectedCapabilityId !== null ? 'opacity-0' : 'opacity-100'}`}>
                          {getContent(cap, 'title')}
                        </h3>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                <AnimatePresence>
                  {selectedCapability && (
                    <motion.div
                      layoutId={`capability-card-${selectedCapability.id}`}
                      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-card z-20"
                    >
                      <motion.img
                        layoutId={`capability-img-${selectedCapability.id}`}
                        src={selectedCapability.bgImage}
                        alt={selectedCapability.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="relative z-10 p-8 md:p-16 text-white h-full flex flex-col justify-center items-start text-left max-w-4xl"
                      >
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Core Capability</span>
                        {/* 🌍 getContent 적용 */}
                        <h3 className="font-bold text-4xl md:text-5xl mb-6">{getContent(selectedCapability, 'title')}</h3>
                        <p className="text-lg md:text-xl leading-relaxed text-gray-200 whitespace-pre-line max-w-2xl">
                          {getContent(selectedCapability, 'description')}
                        </p>
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
      <div className="w-full py-24 md:py-32 bg-secondary/30">
        <div className="container">
          <ScrollAnimation delay={200}>
            <section className="space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Research Topics</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Exploring the frontiers of materials science through computational innovation.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {(pageContent.research_topics || []).map((topic: any) => (
                  <div
                    key={topic.title}
                    className="group cursor-pointer relative overflow-hidden h-[28rem] rounded-2xl elegant-shadow hover:shadow-2xl smooth-transition bg-white"
                    onClick={() => onPageChange(topic.path)}
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src={topic.bgImage}
                        alt={topic.title}
                        className="w-full h-full object-cover smooth-transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 smooth-transition group-hover:opacity-80"></div>
                    </div>

                    <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
                      <div className="transform translate-y-4 group-hover:translate-y-0 smooth-transition">
                        {/* 🌍 getContent 적용 */}
                        <h3 className="text-2xl font-bold mb-4">{getContent(topic, 'title')}</h3>
                        <p className="text-base text-gray-200 opacity-0 group-hover:opacity-100 smooth-transition delay-100 line-clamp-3 leading-relaxed">
                          {getContent(topic, 'description')}
                        </p>
                        <div className="mt-6 flex items-center text-sm font-medium text-primary-foreground opacity-0 group-hover:opacity-100 smooth-transition delay-200">
                          Explore Topic <span className="ml-2">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollAnimation>
        </div>
      </div>

      {/* Section 3: Research Highlights (논문이라 영어 유지 또는 description만 번역) */}
      <ScrollAnimation>
        <section className="w-full gradient-primary py-24 text-white scientific-pattern">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-16">
            <h2 className="text-3xl font-bold text-center mb-12">Research Highlights</h2>
            {/* ⚠️ HighlightsSlider 내부도 수정이 필요할 수 있습니다. 우선 데이터는 그대로 전달 */}
            <ResearchHighlightsSlider highlights={pageContent.research_highlights || []} />
          </div>
        </section>
      </ScrollAnimation>

      {/* Achievements & News Section */}
      <div className="w-full py-24 md:py-32 bg-background">
        <div className="container space-y-32">
          {/* Recent Achievements */}
          <ScrollAnimation>
            <section>
              <div className="flex justify-between items-end mb-10 border-b pb-4 border-border">
                <h2 className="text-3xl font-bold text-foreground">Recent Achievements</h2>
                <Button variant="ghost" className="text-primary hover:bg-primary/5 font-medium" onClick={() => onPageChange('/publications')}>
                  View All Publications →
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {achievements.map(item => (
                  <div
                    key={`${item.id}-${item.title}`}
                    className="cursor-pointer group flex flex-col h-full hover:-translate-y-1 transition-transform duration-300"
                    onClick={() => onPageChange('/publications')}
                  >
                    <div className="overflow-hidden rounded-xl mb-5 aspect-[4/3] border border-border/50 shadow-sm bg-muted/20">
                      <img src={item.image_url || item.thumbnail_url || '/images/logo.png'} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <p className="text-xs font-bold text-primary tracking-wide mb-2 uppercase">{item.authors ? 'PUBLICATION' : 'PROJECT'} · {new Date(item.created_at).toLocaleDateString()}</p>
                      <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-3 text-foreground/90">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {stripHtmlAndTruncate(item.abstract || item.description, 100)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollAnimation>

          {/* Latest News */}
          <ScrollAnimation>
            <section>
              <div className="flex justify-between items-end mb-10 border-b pb-4 border-border">
                <h2 className="text-3xl font-bold text-foreground">Latest News</h2>
                <Button variant="ghost" className="text-primary hover:bg-primary/5 font-medium" onClick={() => onPageChange('/board/news')}>
                  View All News →
                </Button>
              </div>

              {latestNews.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Main Featured News */}
                  <div
                    className="cursor-pointer group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 h-[24rem] lg:h-auto"
                    onClick={() => onPageChange(latestNews[0].type === 'notice' ? `/board/news/${latestNews[0].id}` : `/board/gallery/${latestNews[0].id}`)}
                  >
                    <img
                      src={latestNews[0].thumbnail_url || '/images/logo.png'}
                      alt={latestNews[0].title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                      <p className="text-sm font-medium opacity-80 mb-2">{latestNews[0].type === 'notice' ? 'NOTICE' : 'GALLERY'} · {new Date(latestNews[0].created_at).toLocaleDateString()}</p>
                      <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4 group-hover:text-primary-foreground transition-colors">
                        {getContent(latestNews[0], 'title')}
                      </h3>
                      <p className="text-base md:text-lg opacity-90 line-clamp-2 max-w-xl">
                        {stripHtmlAndTruncate(getContent(latestNews[0], 'content'), 150)}
                      </p>
                    </div>
                  </div>

                  {/* Side List */}
                  <div className="flex flex-col gap-6">
                    {latestNews.slice(1, 4).map(item => (
                      <div
                        key={`${item.id}-${item.type}`}
                        className="flex gap-6 cursor-pointer group bg-card hover:bg-muted/50 p-4 rounded-xl transition-colors border border-transparent hover:border-border/50"
                        onClick={() => onPageChange(item.type === 'notice' ? `/board/news/${item.id}` : `/board/gallery/${item.id}`)}
                      >
                        <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg shadow-sm border border-border/10 order-first">
                          <img src={item.thumbnail_url || '/images/logo.png'} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">{item.type === 'notice' ? 'NOTICE' : 'GALLERY'} · {new Date(item.created_at).toLocaleDateString()}</p>
                          <h4 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2 text-foreground/90">
                            {getContent(item, 'title')}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {stripHtmlAndTruncate(getContent(item, 'content'), 60)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </ScrollAnimation>
        </div>
      </div>

      {/* Section 5: Videos */}
      <div className="w-full py-24 bg-primary/5">
        <ScrollAnimation>
          <section className="max-w-5xl mx-auto px-6 lg:px-12 xl:px-16">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Research Video</h2>
            <Card className="elegant-shadow smooth-transition hover:shadow-lg overflow-hidden">
              <div className="aspect-video">
                <iframe className="w-full h-full" src={pageContent.video_src} title="CMSL Laboratory Introduction Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </div>
            </Card>
          </section>
        </ScrollAnimation>
      </div>
    </div>
  );
}