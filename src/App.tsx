import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/components/LanguageProvider';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

// 페이지 컴포넌트들 import...
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
import { UpdatePasswordPage } from '@/components/pages/UpdatePasswordPage';

// Quill 설정...
import { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
          <div className="w-full max-w-none px-6 lg:px-12 xl:px-16 py-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => handlePageChange('/')}
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

        <main>
          <Routes>
            {/* 기본 페이지 라우팅 */}
            <Route path="/" element={<HomePage onPageChange={handlePageChange} />} />
            <Route path="/introduction" element={<IntroductionPage />} />
            
            {/* People 관련 페이지들 */}
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/people/professor" element={<ProfessorPage />} />
            <Route path="/people/members" element={<MembersPage />} />
            <Route path="/people/alumni" element={<AlumniPage />} />

            {/* Research 관련 페이지들 */}
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/research/casting" element={<CastingAlloysPage />} />
            <Route path="/research/films" element={<ThinFilmsPage />} />
            <Route path="/research/biodegradable" element={<BiodegradableAlloysPage />} />
            
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />

            {/* Board 관련 페이지들 (추후 상세/수정 페이지 라우팅 추가 예정) */}
            <Route path="/board/news" element={<NoticeBoardPage session={session} />} />
            <Route path="/board/gallery" element={<GalleryBoardPage session={session} />} />

            <Route path="/contact" element={<ContactPage />} />

            {/* 관리자 페이지 (로그인 상태에 따라 접근 제어) */}
            <Route 
              path="/cmsl2004" 
              element={
                session 
                  ? <AdminPage session={session} onNavigate={handlePageChange} /> 
                  : <Navigate to="/login" replace /> 
              } 
            />
            <Route 
              path="/cmsl20042" 
              element={
                session 
                  ? <AdminPage2 session={session} onNavigate={handlePageChange} /> 
                  : <Navigate to="/login" replace />
              } 
            />
            
            {/* 로그인 페이지 경로를 명확하게 분리합니다. */}
            <Route path="/login" element={<LoginPage />} />

            <Route path="/update-password" element={session ? <UpdatePasswordPage /> : <Navigate to="/login" replace />} />

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