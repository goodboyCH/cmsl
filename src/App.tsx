import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
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

// Lazy Load Pages
const HomePage = lazy(() => import('@/components/pages/HomePage').then(m => ({ default: m.HomePage })));
const IntroductionPage = lazy(() => import('@/components/pages/IntroductionPage').then(m => ({ default: m.IntroductionPage })));
const ProfessorPage = lazy(() => import('@/components/pages/ProfessorPage').then(m => ({ default: m.ProfessorPage })));
const MembersPage = lazy(() => import('@/components/pages/MembersPage').then(m => ({ default: m.MembersPage })));
const AlumniPage = lazy(() => import('@/components/pages/AlumniPage').then(m => ({ default: m.AlumniPage })));
const CastingAlloysPage = lazy(() => import('@/components/pages/CastingAlloysPage').then(m => ({ default: m.CastingAlloysPage })));
const ThinFilmsPage = lazy(() => import('@/components/pages/ThinFilmsPage').then(m => ({ default: m.ThinFilmsPage })));
const BiodegradableAlloysPage = lazy(() => import('@/components/pages/BiodegradableAlloysPage').then(m => ({ default: m.BiodegradableAlloysPage })));
const PublicationsPage = lazy(() => import('@/components/pages/PublicationsPage').then(m => ({ default: m.PublicationsPage })));
const NoticeBoardPage = lazy(() => import('@/components/pages/NoticeBoardPage').then(m => ({ default: m.NoticeBoardPage })));
const GalleryBoardPage = lazy(() => import('@/components/pages/GalleryBoardPage').then(m => ({ default: m.GalleryBoardPage })));
const ContactPage = lazy(() => import('@/components/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AdminPage = lazy(() => import('@/components/pages/AdminPage').then(m => ({ default: m.AdminPage })));
const AdminPage2 = lazy(() => import('@/components/pages/AdminPage2').then(m => ({ default: m.AdminPage2 })));
const LoginPage = lazy(() => import('@/components/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('@/components/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@/components/pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const NoticeDetailPage = lazy(() => import('@/components/pages/NoticeDetailPage').then(m => ({ default: m.NoticeDetailPage })));
const GalleryDetailPage = lazy(() => import('@/components/pages/GalleryDetailPage').then(m => ({ default: m.GalleryDetailPage })));
const EditNoticePage = lazy(() => import('@/components/pages/EditNoticePage').then(m => ({ default: m.EditNoticePage })));
const EditGalleryPage = lazy(() => import('@/components/pages/EditGalleryPage').then(m => ({ default: m.EditGalleryPage })));
const SimulationPage = lazy(() => import('@/components/pages/SimulationPage').then(m => ({ default: m.SimulationPage })));
const VtiViewerPage = lazy(() => import('@/components/pages/VtiViewerPage').then(m => ({ default: m.VtiViewerPage })));

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
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 selection:text-primary">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 transition-all duration-200">
        <div className="container flex items-center justify-between h-16 sm:h-20 px-4 xl:px-8">
          <div className="flex items-center gap-4 sm:gap-8">
            <button onClick={() => handlePageChange('/')} className="flex-shrink-0 group">
              <img
                src="/images/logo1.png"
                alt="CMSL Logo"
                className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
              />
            </button>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              {/* 🌍 Header Text Translation */}
              <span className="font-semibold text-sm lg:text-[15px] text-foreground/80 tracking-tight">
                {t('header.line1')}
              </span>
              <span className="font-semibold text-sm lg:text-[15px] text-foreground/80 tracking-tight">
                {t('header.line2')}
              </span>
            </div>
          </div>


          <div className="hidden min-[1280px]:flex">
            <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={
            <Suspense fallback={<div className="h-[80vh] w-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
              <HomePage onPageChange={handlePageChange} />
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<div className="h-[80vh] w-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
              <Routes>
                <Route path="/viewer" element={<VtiViewerPage />} />
                <Route path="/simulation" element={<SimulationPage />} />
                <Route path="/introduction" element={<IntroductionPage />} />
                <Route path="/people/professor" element={<ProfessorPage />} />
                <Route path="/people/members" element={<MembersPage />} />
                <Route path="/people/alumni" element={<AlumniPage />} />
                <Route path="/research/pfm" element={<CastingAlloysPage />} />
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
            </Suspense>
          } />
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
                  {t('footer.lab')}<br />
                  {t('footer.dept')}<br />
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
                <button onClick={() => handlePageChange('/research/pfm')} className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">{t('footer.links.research')}</button>
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

      <div className="fixed top-4 right-4 min-[1400px]:hidden z-50">
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