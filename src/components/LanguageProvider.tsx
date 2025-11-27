import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 📝 번역 사전 (우선순위 높은 항목 위주)
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.introduction': 'Introduction',
    'nav.people': 'People',
    'nav.professor': 'Professor',
    'nav.members': 'Members',
    'nav.alumni': 'Alumni',
    'nav.research': 'Research',
    'nav.publications': 'Publications',
    'nav.board': 'Board',
    'nav.news': 'Notices & News',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.simulation': 'PFM Calculation',

    'members.header.title': 'Our Team',
    'members.header.desc': 'Meet the talented researchers advancing computational materials science',
    
    'alumni.header.title': 'Alumni',
    'alumni.header.desc': 'Meet our distinguished graduates who are making an impact in their fields.',
    
    'publications.header.title': 'Publications',
    'publications.header.desc': 'Explore our research contributions to computational materials science.',


    // Home Page (Hero Section)
    'home.hero.title': 'Materials Science\n×\nComputational Thermodynamics',
    'home.hero.subtitle': 'We design predictable material systems based on microstructural physics,\ncontributing to innovation across various industries.',
    'home.hero.capabilities': 'Core Capabilities: Phase-Field (Multi-phase Multi-physics), CALPHAD, Data/Code Open, AI-based Optimization',
    'home.hero.join': 'Collaboration & Internship Recruitment',
    'home.btn.learn_more': 'Learn More',

    // Research Page Titles (정적 페이지용)
    'research.casting': 'High-Performance Casting Alloys',
    'research.films': 'Ferroelectric Thin Films',
    'research.biodegradable': 'Biodegradable Mg-Zn Alloys',

    // Contact Page
    'contact.title': 'Contact Us',
    'contact.desc': 'We welcome research collaborations and student inquiries.',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    
    // Common
    'common.loading': 'Loading...',
    'common.read_more': 'Read More',
  },
  ko: {
    // Navigation
    'nav.home': '홈',
    'nav.introduction': '연구실 소개',
    'nav.people': '구성원',
    'nav.professor': '지도교수',
    'nav.members': '연구원',
    'nav.alumni': '졸업생',
    'nav.research': '연구분야',
    'nav.publications': '논문성과',
    'nav.board': '게시판',
    'nav.news': '공지사항',
    'nav.gallery': '갤러리',
    'nav.contact': '문의하기',
    'nav.simulation': 'PFM 시뮬레이션',

    'members.header.title': '연구원 소개',
    'members.header.desc': '계산 재료 과학 연구를 선도하는 연구원들을 소개합니다.',
    
    'alumni.header.title': '졸업생',
    'alumni.header.desc': '각 분야에서 활약하고 있는 자랑스러운 졸업생들을 소개합니다.',
    
    'publications.header.title': '연구 논문',
    'publications.header.desc': '계산 재료 과학 분야의 연구 성과와 기여를 확인해보세요.',
    

    // Home Page
    'home.hero.title': '재료과학\n×\n계산열역학',
    'home.hero.subtitle': 'CMSL은 미세조직의 물리를 기반으로 예측 가능한 재료 시스템을 설계하여\n다양한 산업 분야의 혁신에 기여합니다.',
    'home.hero.capabilities': '핵심 역량: Phase-Field (다상 멀티피직스), CALPHAD, 데이터/코드 오픈소스, AI 기반 최적화',
    'home.hero.join': '공동 연구 및 인턴 연구원 모집 중',
    'home.btn.learn_more': '자세히 보기',

    // Research Page Titles
    'research.casting': '고성능 주조 합금 설계',
    'research.films': '강유전체 박막 연구',
    'research.biodegradable': '생분해성 Mg-Zn 합금',

    // Contact Page
    'contact.title': '문의하기',
    'contact.desc': '연구 협력 및 대학원 진학 문의를 환영합니다.',
    'contact.form.name': '이름',
    'contact.form.email': '이메일',
    'contact.form.subject': '제목',
    'contact.form.message': '내용',
    'contact.form.send': '메시지 보내기',

    // Common
    'common.loading': '로딩 중...',
    'common.read_more': '더 보기',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 1. 로컬 스토리지에서 언어 설정 불러오기 (기본값: en)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved === 'en' || saved === 'ko') ? saved : 'en';
  });

  // 2. 언어 변경 함수
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ko' : 'en';
    setLanguage(newLang);
    localStorage.setItem('app-language', newLang);
  };

  // 3. 번역 함수
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}