'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

    'news.header.title': 'Notices & News',
    'news.header.desc': 'Stay updated with the latest news and announcements.',

    'gallery.header.title': 'Gallery',
    'gallery.header.desc': 'Explore our lab\'s activities and achievements.',

    // Home Page (Hero Section)
    'home.hero.title': 'Materials Science\n×\nComputational Thermodynamics',
    'home.hero.subtitle': 'We design predictable material systems based on microstructural physics,\ncontributing to innovation across various industries.',
    'home.hero.capabilities': 'Core Capabilities: Phase-Field (Multi-phase Multi-physics), CALPHAD, Data/Code Open, AI-based Optimization',
    'home.hero.join': 'Collaboration & Internship Recruitment',
    'home.btn.learn_more': 'Learn More',

    // Research Page Titles
    'research.casting': 'Real Scale PFM',
    'research.films': 'Ferroelectric Thin Films',
    'research.biodegradable': 'Biodegradable Mg-Zn Alloys',

    // Contact Page
    'contact.header.title': 'Contact Us',
    'contact.header.desc': 'Get in touch with our lab for collaborations, inquiries, or visits.',
    'contact.info.title': 'Laboratory Information',
    'contact.info.location': 'Location',
    'contact.info.pi': 'Principal Investigator',
    'contact.info.phone': 'Phone',
    'contact.map.title': 'Our Location on Map',
    'contact.form.title': 'Send us a Message',
    'contact.form.desc': 'Please fill out the form below and we will get back to you shortly.',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Your Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your Message',
    'contact.form.send': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.success': 'Message sent successfully!',
    'contact.fail': 'Failed to send message:',
    'contact.addr.dept': 'School of Materials Science & Engineering',
    'contact.addr.building': 'Kookmin University Engineering building Room 443',
    'contact.addr.street': '77 Jeongneung-ro, Seongbuk-gu, Seoul, 02707, Korea',

    // Simulation Page
    'sim.header.title': 'Multi-Physics Simulation Service',
    'sim.header.desc': 'Powered by Python on Google Colab',
    'sim.control.title': 'Simulation Control',
    'sim.tab.gs': 'Grain Shrinkage',
    'sim.tab.dg': 'Dendrite Growth',
    'sim.desc.gs': 'A 2D PFM model simulating the shrinkage of a circular grain.',
    'sim.desc.dg': 'A 2D PFM model simulating dendritic crystal growth.',
    'sim.label.grid': 'Grid Size',
    'sim.label.steps': 'Total Timesteps',
    'sim.label.interval': 'Output Interval',
    'sim.label.drive': 'Driving Force',
    'sim.label.symmetry': 'N-fold Symmetry',
    'sim.label.aniso': 'Anisotropy Magnitude',
    'sim.label.latent': 'Latent Heat Coef.',
    'sim.btn.start': 'Start Simulation',
    'sim.btn.running': 'Running...',
    'sim.result.title': 'Result',
    'sim.result.placeholder': 'Result will be displayed here',
    'sim.status.ready': 'Status: Ready. Please select a simulation type.',
    // Header & Footer
    'header.line1': 'Computational Materials',
    'header.line2': 'Science Laboratory',

    'footer.lab': 'Computational Materials Science Laboratory',
    'footer.dept': 'Dept. of Materials Science and Engineering',
    'footer.univ': 'Kookmin University',
    'footer.links': 'Quick Links',
    'footer.links.research': 'Research Areas',
    'footer.links.pubs': 'Publications',
    'footer.links.members': 'Team Members',
    'footer.links.contact': 'Contact Us',
    'footer.contact': 'Contact',
    'footer.address': '77 Jeongneung-ro, Seongbuk-gu, Seoul, 02707, Republic of Korea',
    'footer.rights': '© 2024 CMSL - Computational Materials Science Laboratory. All rights reserved.',
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

    'news.header.title': '공지사항',
    'news.header.desc': '연구실의 최신 소식과 공지사항을 확인하세요.',

    'gallery.header.title': '갤러리',
    'gallery.header.desc': '연구실의 다양한 활동과 성과를 사진으로 만나보세요.',

    // Home Page
    'home.hero.title': '재료과학\n×\n계산열역학',
    'home.hero.subtitle': 'CMSL은 미세조직의 물리를 기반으로 예측 가능한 재료 시스템을 설계하여\n다양한 산업 분야의 혁신에 기여합니다.',
    'home.hero.capabilities': '핵심 역량: Phase-Field (다상 멀티피직스), CALPHAD, 데이터/코드 오픈소스, AI 기반 최적화',
    'home.hero.join': '공동 연구 및 인턴 연구원 모집 중',
    'home.btn.learn_more': '자세히 보기',

    // Research Page Titles
    'research.casting': 'Real Scale PFM',
    'research.films': '강유전체 박막 연구',
    'research.biodegradable': '생분해성 Mg-Zn 합금',

    // Contact Page
    'contact.header.title': '문의하기',
    'contact.header.desc': '연구 협력, 대학원 진학 문의 및 방문을 환영합니다.',
    'contact.info.title': '연구실 정보',
    'contact.info.location': '위치',
    'contact.info.pi': '지도교수',
    'contact.info.phone': '전화번호',
    'contact.map.title': '오시는 길',
    'contact.form.title': '메시지 보내기',
    'contact.form.desc': '아래 양식을 통해 문의사항을 보내주시면 확인 후 회신 드립니다.',
    'contact.form.name': '이름',
    'contact.form.email': '이메일',
    'contact.form.subject': '제목',
    'contact.form.message': '내용',
    'contact.form.send': '전송하기',
    'contact.form.sending': '전송 중...',
    'contact.success': '메시지가 성공적으로 전송되었습니다!',
    'contact.fail': '전송 실패:',

    'contact.addr.dept': '국민대학교 신소재공학부',
    'contact.addr.building': '공학관 443호',
    'contact.addr.street': '02707 서울특별시 성북구 정릉로 77',

    // Simulation Page
    'sim.header.title': '멀티피직스 시뮬레이션 서비스',
    'sim.header.desc': 'Google Colab 기반 Python 연산 엔진 구동',
    'sim.control.title': '시뮬레이션 제어',
    'sim.tab.gs': '결정립 수축',
    'sim.tab.dg': '수지상 성장',
    'sim.desc.gs': '원형 결정립의 수축 과정을 모사하는 2D PFM 모델입니다.',
    'sim.desc.dg': '수지상 결정 성장을 모사하는 2D PFM 모델입니다.',
    'sim.label.grid': '격자 크기',
    'sim.label.steps': '총 시간 스텝',
    'sim.label.interval': '출력 간격',
    'sim.label.drive': '구동력',
    'sim.label.symmetry': '대칭성 (N-fold)',
    'sim.label.aniso': '이방성 크기',
    'sim.label.latent': '잠열 계수',
    'sim.btn.start': '시뮬레이션 시작',
    'sim.btn.running': '실행 중...',
    'sim.result.title': '결과',
    'sim.result.placeholder': '결과 이미지가 여기에 표시됩니다.',
    'sim.status.ready': '상태: 준비됨. 시뮬레이션 타입을 선택하세요.',

    'header.line1': '국민대학교 신소재공학부',
    'header.line2': '계산재료과학 연구실',
    'footer.lab': '계산재료과학 연구실',
    'footer.dept': '국민대학교 신소재공학부',
    'footer.univ': ' ',
    'footer.links': '바로가기',
    'footer.links.research': '연구 분야',
    'footer.links.pubs': '논문 성과',
    'footer.links.members': '연구원 소개',
    'footer.links.contact': '문의하기',
    'footer.contact': '연락처',
    'footer.address': '02707 서울특별시 성북구 정릉로 77',
    'footer.rights': '© 2024 CMSL - Computational Materials Science Laboratory. All rights reserved.',
    // Common
    'common.loading': '로딩 중...',
    'common.read_more': '더 보기',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 클라이언트에서만 localStorage 접근
    const saved = localStorage.getItem('app-language');
    if (saved === 'en' || saved === 'ko') {
      setLanguage(saved);
    }
    setIsHydrated(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ko' : 'en';
    setLanguageValue(newLang);
  };

  const setLanguageValue = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage: setLanguageValue, t }}>
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
