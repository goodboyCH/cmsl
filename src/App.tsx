import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider, useLanguage } from '@/components/LanguageProvider'; // useLanguage 추가
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useIdleTimer } from '@/hooks/useIdleTimer';
import { SitePopup } from '@/components/SitePopup';

import { HomePage } from '@/components/pages/HomePage';
import { IntroductionPage } from '@/components/pages/IntroductionPage';
import { ProfessorPage } from '@/components/pages/ProfessorPage';
import { MembersPage } from '@/components/pages/MembersPage';
import { AlumniPage } from '@/components/pages/AlumniPage';
import { CastingAlloysPage } from '@/components/pages/CastingAlloysPage';
import { ThinFilmsPage } from '@/components/pages/ThinFilmsPage';
import { BiodegradableAlloysPage } from '@/components/pages/BiodegradableAlloysPage';
import { PublicationsPage } from '@/components/pages/PublicationsPage';
import { NoticeBoardPage } from '@/components/pages/NoticeBoardPage';
import { GalleryBoardPage } from '@/components/pages/GalleryBoardPage';
import { ContactPage } from '@/components/pages/ContactPage';
import { AdminPage } from '@/components/pages/AdminPage';
import { AdminPage2 } from '@/components/pages/AdminPage2';
import { LoginPage } from '@/components/pages/LoginPage';
import { ForgotPasswordPage } from '@/components/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/components/pages/ResetPasswordPage';
import { NoticeDetailPage } from '@/components/pages/NoticeDetailPage';
import { GalleryDetailPage } from '@/components/pages/GalleryDetailPage';
import { EditNoticePage } from '@/components/pages/EditNoticePage';
import { EditGalleryPage } from '@/components/pages/EditGalleryPage';
import { SimulationPage } from '@/components/pages/SimulationPage'; 
import { VtiViewerPage } from '@/components/pages/VtiViewerPage';

import { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);

// 🏗️ 내부 컴포넌트 분리: useLanguage 훅을 사용하기 위함
function AppContent() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage(); // ✅ 번역 훅 사용 가능

  useIdleTimer({
    onIdle: () => supabase.auth.signOut(),
    idleTime: 30,
    enabled: !!session,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handlePageChange = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate(path);
  };
  
  const currentPage = location.pathname.split('/')[1] || 'home';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 sm:h-20 px-4 sm:px-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => handlePageChange('/')} className="flex-shrink-0">
              <img 
                src="/images/logo1.png" 
                alt="CMSL Logo" 
                className="h-12 sm:h-16 w-auto"
              />
            </button>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              {/* 🌍 헤더 텍스트 번역 적용 */}
              <span className="font-bold text-sm lg:text-base text-muted-foreground">
                {t('header.line1')}
              </span>
              <span className="font-bold text-sm lg:text-base text-muted-foreground">
                {t('header.line2')}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex">
            <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage onPageChange={handlePageChange} />} />
          <Route path="/viewer" element={<VtiViewerPage />} />
          <Route path="/simulation" element={<SimulationPage />} /> 
          <Route path="/introduction" element={<IntroductionPage />} />
          <Route path="/people/professor" element={<ProfessorPage />} />
          <Route path="/people/members" element={<MembersPage />} />
          <Route path="/people/alumni" element={<AlumniPage />} />
          <Route path="/research/casting" element={<CastingAlloysPage />} />
          <Route path="/research/films" element={<ThinFilmsPage />} />
          <Route path="/research/biodegradable" element={<BiodegradableAlloysPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/board/news" element={<NoticeBoardPage session={session} />} />
          <Route path="/board/news/:id" element={<NoticeDetailPage session={session} />} /> 
          <Route path="/board/news/:id/edit" element={<EditNoticePage />} />
          <Route path="/board/gallery" element={<GalleryBoardPage session={session} />} />
          <Route path="/board/gallery/:id" element={<GalleryDetailPage session={session} />} />
          <Route path="/board/gallery/:id/edit" element={<EditGalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cmsl2004" element={session ? <AdminPage onNavigate={handlePageChange} /> : <LoginPage />} />
          <Route path="/cmsl20042" element={session ? <AdminPage2 onNavigate={handlePageChange} /> : <LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="border-t bg-muted/50 mt-16">
        <div className="container py-12 px-4 sm:px-8">
          <div className="flex flex-col md:flex-row gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start md:flex-1">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-primary mb-2">CMSL</h3>
                {/* 🌍 푸터 정보 번역 적용 */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('footer.lab')}<br/>
                  {t('footer.dept')}<br/>
                  {t('footer.univ')}
                </p>
              </div>
              <a href="https://cms.kookmin.ac.kr/mse/index.do" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/images/kmu-logo.png"
                  alt="Kookmin University Logo" 
                  className="h-14 sm:h-16 opacity-80"
                />
              </a>
            </div>
            <div className="md:flex-1">
              {/* 🌍 푸터 링크 번역 적용 */}
              <h3 className="text-lg font-semibold text-primary mb-4">{t('footer.links')}</h3>
              <div className="space-y-2 text-sm">
                <button onClick={() => handlePageChange('/research/casting')} className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">{t('footer.links.research')}</button>
                <button onClick={() => handlePageChange('/publications')} className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">{t('footer.links.pubs')}</button>
                <button onClick={() => handlePageChange('/people/members')} className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">{t('footer.links.members')}</button>
                <button onClick={() => handlePageChange('/contact')} className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">{t('footer.links.contact')}</button>
              </div>
            </div>
            <div className="md:flex-1">
              <h3 className="text-lg font-semibold text-primary mb-4">{t('footer.contact')}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Prof. Cha Pil-Ryung</p>
                <p>cprdream@kookmin.ac.kr</p>
                <p>+82-2-910-4656</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-xs sm:text-sm text-muted-foreground">
              <p className="mb-2">{t('footer.address')}</p>
            <p>{t('footer.rights')}</p>
          </div>
        </div>
      </footer>
      
      <div className="fixed top-4 right-4 lg:hidden z-50">
        <MobileNavigation currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

      <ScrollToTopButton />
      <Toaster />
      {location.pathname === '/' && <SitePopup />}
    </div>
  );
}

// 메인 App 컴포넌트에서 Provider로 감싸줌
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;