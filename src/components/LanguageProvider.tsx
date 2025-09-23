import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 영어와 한국어를 적절히 배치한 고정 텍스트
const translations = {
  // Navigation - 영어 유지
  'nav.home': 'Home',
  'nav.introduction': 'Introduction',
  'nav.people': 'People',
  'nav.research': 'Research',
  'nav.publications': 'Publications',
  'nav.projects': 'Projects',
  'nav.board': 'Board',
  'nav.contact': 'Contact',
  
  // People sub-navigation
  'nav.professor': 'Professor',
  'nav.members': 'Members',
  'nav.alumni': 'Alumni',
  // Home - 영어/한국어 혼용
  'home.hero.title': 'Materials Science\n×\nComputational Thermodynamics',
  'home.hero.subtitle': 'CMSL은 미세조직의 물리를 기반으로 예측 가능한 재료 시스템을 설계하여\n다양한 산업 분야의 혁신에 기여합니다.',
  'home.hero.capabilities': 'Core Capabilities: Phase-Field (Multi-phase Multi-physics), CALPHAD, Data/Code Open, AI-based Optimization',
  'home.hero.join': '협업 및 인턴 모집중 | Collaboration & Internship Recruitment',
  
  // Mission
  'mission.title': 'Mission',
  'mission.text': '미세조직의 물리로부터 예측가능한 재료설계를 구현한다',
  
  // About
  'about.title': 'About CMSL',
  'about.text': 'CMSL은 Phase-Field Modeling + AI로 Al/Fe 응고, NdFeB 스트립캐스팅, 고Si강 응고, FE/AFE 박막, Mg-Zn 합금부식, Eutectic 성장, 전위맵핑을 연구합니다.',
  
  // Research Areas
  'research.casting.title': '주조 합금 — Phase-Field 기반 응고 미세조직',
  'research.films.title': '다결정 박막 및 강유전체',
  'research.alloys.title': '생분해성 Mg-Zn 합금 및 전기화학 전위 맵핑',
  
  // Recent Achievements
  'achievements.title': 'Recent Research Achievements',
  'achievements.subtitle': '최근 연구 성과 및 주요 성취',
  
  // People
  'people.professor': 'Professor',
  'people.postdoc': 'Postdoctoral Researcher',
  'people.phd': 'Graduate Student (PhD)',
  'people.ms': 'Graduate Student (MS)',
  'people.undergrad': 'Undergraduate Student',
  'people.admin': 'Administrative Staff',
  'people.alumni': 'Alumni',
  
  // Contact
  'contact.form.title': 'Contact Us',
  'contact.form.name': 'Name',
  'contact.form.email': 'Email',
  'contact.form.subject': 'Subject',
  'contact.form.message': 'Message',
  'contact.form.send': 'Send Message',
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const t = (key: string): string => {
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
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