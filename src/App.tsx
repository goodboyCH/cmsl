import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/components/LanguageProvider';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useIdleTimer } from '@/hooks/useIdleTimer';

// 페이지 컴포넌트 import는 변경 없습니다.
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
import { SimulationPage } from '@/components/pages/SimulationPage'; // 새로 만든 페이지 임포트

import { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    <LanguageProvider>
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
                {/* --- ⬇️ 텍스트 색상을 text-muted-foreground로 통일합니다. ⬇️ --- */}
                <span className="font-bold text-sm lg:text-base text-muted-foreground">
                  Computational Materials
                </span>
                {/* --- ⬆️ 수정 완료 ⬆️ --- */}
                <span className="font-bold text-sm lg:text-base text-muted-foreground">
                  Science Laboratory
                </span>
              </div>
            </div>

            <div className="hidden lg:flex">
              <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
            
            {/* 모바일 네비게이션은 헤더에서 제외하고 바깥으로 이동시킵니다. */}
          </div>
        </header>

        <main>
          <Routes>
            {/* 라우팅 코드는 변경 없습니다. */}
            <Route path="/" element={<HomePage onPageChange={handlePageChange} />} />
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
            {/* --- ⬇️ Grid 대신 Flexbox를 사용하여 레이아웃을 수정합니다. ⬇️ --- */}
            <div className="flex flex-col md:flex-row gap-8 text-center md:text-left">
              {/* 각 항목에 md:flex-1을 추가하여 데스크톱에서 동일한 너비를 차지하도록 합니다. */}
              <div className="flex flex-col items-center md:items-start md:flex-1">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-primary mb-2">CMSL</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Computational Materials Science Laboratory<br/>
                    Dept. of Materials Science and Engineering<br/>
                    Kookmin University
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
                <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
                <div className="space-y-2 text-sm">
                  <button onClick={() => handlePageChange('/research/casting')} className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">Research Areas</button>
                  <button onClick={() => handlePageChange('/publications')} className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">Publications</button>
                  <button onClick={() => handlePageChange('/people/members')} className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">Team Members</button>
                  <button onClick={() => handlePageChange('/contact')} className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">Contact Us</button>
                </div>
              </div>
              <div className="md:flex-1">
                <h3 className="text-lg font-semibold text-primary mb-4">Contact</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Prof. Cha Pil-Ryung</p>
                  <p>cprdream@kookmin.ac.kr</p>
                  <p>+82-2-910-4656</p>
                </div>
              </div>
            </div>
            {/* --- ⬆️ 수정 완료 ⬆️ --- */}
            <div className="border-t mt-8 pt-8 text-center text-xs sm:text-sm text-muted-foreground">
               <p className="mb-2">77 Jeongneung-ro, Seongbuk-gu, Seoul, 02707, Republic of Korea</p>
              <p>&copy; 2024 CMSL - Computational Materials Science Laboratory. All rights reserved.</p>
            </div>
          </div>
        </footer>
        
        {/* --- ⬇️ 모바일 네비게이션을 원래 위치로 복원 (z-index 문제 해결) ⬇️ --- */}
        <div className="fixed top-4 right-4 lg:hidden z-50">
          <MobileNavigation currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
        {/* --- ⬆️ 수정 완료 ⬆️ --- */}

        <ScrollToTopButton />
        <Toaster />
      </div>
    </LanguageProvider>
  );
}

export default App;