import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/components/LanguageProvider';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useIdleTimer } from '@/hooks/useIdleTimer'; // 1. 자동 로그아웃 훅을 import 합니다.

// 페이지 컴포넌트들 import...
import { HomePage } from '@/components/pages/HomePage';
import { IntroductionPage } from '@/components/pages/IntroductionPage';
import { ProfessorPage } from '@/components/pages/ProfessorPage';
import { MembersPage } from '@/components/pages/MembersPage';
import { AlumniPage } from '@/components/pages/AlumniPage';
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
import { ForgotPasswordPage } from '@/components/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/components/pages/ResetPasswordPage';
import { NoticeDetailPage } from '@/components/pages/NoticeDetailPage';
import { GalleryDetailPage } from '@/components/pages/GalleryDetailPage';
import { EditNoticePage } from '@/components/pages/EditNoticePage';
import { EditGalleryPage } from '@/components/pages/EditGalleryPage';

// Quill 설정...
import { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useIdleTimer({
    onIdle: () => supabase.auth.signOut(), // 30분 후 로그아웃 실행
    idleTime: 30,
    enabled: !!session, // session이 있을 때만 (로그인 상태일 때만) 타이머 활성화
  });

  useEffect(() => {
    // 가장 기본적인 세션 관리 로직만 남깁니다.
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
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
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full px-10 lg:px-24 py-6">
            <div className="flex items-center justify-between h-16">
              
              {/* 왼쪽: 로고와 연구실 이름 */}
              <div className="flex items-center space-x-4"> {/* space-x-6 -> space-x-4로 약간 줄임 */}
                <button 
                  onClick={() => handlePageChange('/')}
                  className="flex-shrink-0" // 로고가 줄어들지 않도록 설정
                >
                  {/* 2. 로고 크기를 키웁니다. (h-16 이상도 가능) */}
                  <img 
                    src="/images/logo1.png" 
                    alt="CMSL Logo" 
                    className="h-20 w-auto" // 헤더 높이(h-16)에 꽉 차도록 크기 조정
                  />
                </button>
                <span className="text-lg lg:text-xl text-muted-foreground hidden md:block">
                  Computational Materials Science Laboratory
                </span>
              </div>

              {/* 오른쪽: 네비게이션 메뉴 */}
              <div className="hidden lg:flex">
                <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
              </div>

            </div>
          </div>
        </header>

        <main>
          <Routes>
            {/* 기본 페이지 라우팅 */}
            <Route path="/" element={<HomePage onPageChange={handlePageChange} />} />
            <Route path="/introduction" element={<IntroductionPage />} />
            
            {/* People 관련 페이지들 */}
            <Route path="/people/professor" element={<ProfessorPage />} />
            <Route path="/people/members" element={<MembersPage />} />
            <Route path="/people/alumni" element={<AlumniPage />} />

            {/* Research 관련 페이지들 */}
            <Route path="/research/casting" element={<CastingAlloysPage />} />
            <Route path="/research/films" element={<ThinFilmsPage />} />
            <Route path="/research/biodegradable" element={<BiodegradableAlloysPage />} />
            
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />

            {/* ⬇️ Board 관련 페이지 라우트를 수정합니다. ⬇️ */}
            <Route path="/board/news" element={<NoticeBoardPage session={session} />} />
          <Route path="/board/news/:id" element={<NoticeDetailPage session={session} />} /> 
          <Route path="/board/news/:id/edit" element={<EditNoticePage />} />
          
          <Route path="/board/gallery" element={<GalleryBoardPage session={session} />} />
          <Route path="/board/gallery/:id" element={<GalleryDetailPage session={session} />} />
          <Route path="/board/gallery/:id/edit" element={<EditGalleryPage />} />
        
            <Route path="/contact" element={<ContactPage />} />

            {/* 관리자 페이지 (로그인 상태에 따라 접근 제어) */}
            <Route path="/cmsl2004" element={session ? <AdminPage onNavigate={handlePageChange} /> : <LoginPage />} />
            <Route path="/cmsl20042" element={session ? <AdminPage2 onNavigate={handlePageChange} /> : <LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* 위에 정의되지 않은 모든 경로는 홈으로 리디렉션 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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
                  {/* 'Research Areas' -> '/research/casting' 경로로 변경 */}
                  <button onClick={() => handlePageChange('/research/casting')} className="block text-muted-foreground hover:text-primary smooth-transition">Research Areas</button>
                  
                  {/* '/publications' 경로로 변경 */}
                  <button onClick={() => handlePageChange('/publications')} className="block text-muted-foreground hover:text-primary smooth-transition">Publications</button>
                  
                  {/* 'Team Members' -> '/people/members' 경로로 변경 */}
                  <button onClick={() => handlePageChange('/people/members')} className="block text-muted-foreground hover:text-primary smooth-transition">Team Members</button>
                  
                  {/* '/contact' 경로로 변경 */}
                  <button onClick={() => handlePageChange('/contact')} className="block text-muted-foreground hover:text-primary smooth-transition">Contact Us</button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Contact</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Prof. Cha Pil-Ryung</p>
                  <p>cprdream@kookmin.ac.kr</p>
                  <p>+82-2-910-4656</p>
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