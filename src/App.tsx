import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/components/LanguageProvider';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { HomePage } from '@/components/pages/HomePage';
import { IntroductionPage } from '@/components/pages/IntroductionPage';
import { PeoplePage } from '@/components/pages/PeoplePage';
import { ProfessorPage } from '@/components/pages/ProfessorPage';
import { MembersPage } from '@/components/pages/MembersPage';
import { AlumniPage } from '@/components/pages/AlumniPage';
import { ResearchPage } from '@/components/pages/ResearchPage';
import { CastingAlloysPage } from '@/components/pages/CastingAlloysPage';
import { ThinFilmsPage } from '@/components/pages/ThinFilmsPage';
import { BiodegradableAlloysPage } from '@/components/pages/BiodegradableAlloysPage';
import { PublicationsPage } from '@/components/pages/PublicationsPage';
import { ProjectsPage } from '@/components/pages/ProjectsPage';
import { NoticeBoardPage } from '@/components/pages/NoticeBoardPage';
import { GalleryBoardPage } from '@/components/pages/GalleryBoardPage';
import { ContactPage } from '@/components/pages/ContactPage';
import { AdminPage } from '@/components/pages/AdminPage';
import { AdminPage2 } from '@/components/pages/AdminPage2';
import { LoginPage } from '@/components/pages/LoginPage';
import { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentSubPage, setCurrentSubPage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [researchTab, setResearchTab] = useState('casting');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/cmsl2004') {
      handlePageChange('admin');
    }
  }, []);

  const handlePageChange = (page: string, subTab?: string) => {
    if (page === currentPage && subTab === currentSubPage) return;
    if (subTab) {
      if (page === 'research') { setResearchTab(subTab); }
      setCurrentSubPage(subTab);
    } else {
      setCurrentSubPage(null);
    }
    
    if (page === 'admin' || page === 'admin2') {
      window.history.pushState({}, '', '/cmsl2004');
    } else if (page === 'home') {
      window.history.pushState({}, '', '/');
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  const renderPage = () => {
    if (currentSubPage) {
      switch (currentPage) {
        case 'people':
          switch (currentSubPage) {
            case 'professor': return <ProfessorPage />;
            case 'members': return <MembersPage />;
            case 'alumni': return <AlumniPage />;
            default: return <PeoplePage />;
          }
        case 'board':
          switch (currentSubPage) {
            case 'news': return <NoticeBoardPage session={session} />; 
            case 'gallery': return <GalleryBoardPage session={session} />;
            default: return <h2>Board Main</h2>;
          }
        case 'research':
          switch (currentSubPage) {
            case 'casting': return <CastingAlloysPage />;
            case 'films': return <ThinFilmsPage />;
            case 'biodegradable': return <BiodegradableAlloysPage />;
            default: return <ResearchPage initialTab={researchTab} />;
          }
      }
    }

    switch (currentPage) {
      case 'home': return <HomePage onPageChange={handlePageChange} />;
      case 'introduction': return <IntroductionPage />;
      case 'people': return <PeoplePage />;
      case 'research': return <ResearchPage initialTab={researchTab} />;
      case 'publications': return <PublicationsPage />;
      case 'projects': return <ProjectsPage />;
      case 'board': return <h2>Board Main Page</h2>;
      case 'contact': return <ContactPage />;
      case 'admin': 
        return session ? <AdminPage onNavigate={handlePageChange} /> : <LoginPage />;
      case 'admin2':
        return session ? <AdminPage2 onNavigate={handlePageChange} /> : <LoginPage />;
      default: return <HomePage onPageChange={handlePageChange} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full max-w-none px-6 lg:px-12 xl:px-16 py-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => handlePageChange('home')}
                  className="text-3xl lg:text-4xl font-bold text-primary hover:text-primary/80 smooth-transition"
                >
                  CMSL
                </button>
                <span className="text-lg lg:text-xl text-muted-foreground hidden md:block">
                  Computational Materials Science Laboratory
                </span>
              </div>
              <div className="hidden lg:flex justify-end">
                <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
              </div>
            </div>
          </div>
        </header>

        <main className={`w-full max-w-none transition-all duration-300 ${
          isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}>
          {renderPage()}
        </main>

        <footer className="border-t bg-muted/50 mt-16">
          <div className="w-full max-w-none px-6 lg:px-12 xl:px-16 py-8">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-primary mb-4">CMSL</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Computational Materials Science Laboratory<br/>
                    Department of Materials Science and Engineering<br/>
                    Kookmin University
                  </p>
                </div>
                <a href="https://cms.kookmin.ac.kr/mse/index.do" target="_blank" rel="noopener noreferrer">
                  <img 
                    src="/images/kmu-logo.png"
                    alt="Kookmin University Logo" 
                    className="h-16 opacity-80"
                  />
                </a>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
                <div className="space-y-2 text-sm">
                  <button onClick={() => handlePageChange('research', 'casting')} className="block text-muted-foreground hover:text-primary smooth-transition">Research Areas</button>
                  <button onClick={() => handlePageChange('publications')} className="block text-muted-foreground hover:text-primary smooth-transition">Publications</button>
                  <button onClick={() => handlePageChange('people', 'members')} className="block text-muted-foreground hover:text-primary smooth-transition">Team Members</button>
                  <button onClick={() => handlePageChange('contact')} className="block text-muted-foreground hover:text-primary smooth-transition">Contact Us</button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Contact</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Prof. Cha Pil-Ryung</p>
                  <p>pilryung.cha@university.edu</p>
                  <p>+82-XX-XXXX-XXXX</p>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
               <p className="mb-2">77 Jeongneung-ro, Seongbuk-gu, Seoul, 02707, Republic of Korea</p>
              <p>&copy; 2024 CMSL - Computational Materials Science Laboratory. All rights reserved.</p>
            </div>
          </div>
        </footer>
        
        <div className="fixed top-6 right-6 lg:hidden z-50">
          <MobileNavigation currentPage={currentPage} onPageChange={handlePageChange} />
        </div>

        <ScrollToTopButton />

        <Toaster />
      </div>
    </LanguageProvider>
  );
}

export default App;