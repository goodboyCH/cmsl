import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider'; // 경로 주의
import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button'; // 버튼 컴포넌트 import

interface NavigationProps {
  currentPage: string;
  onPageChange: (path: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { t, language, toggleLanguage } = useLanguage(); // toggleLanguage 추가
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 라벨을 동적으로 가져오도록 수정
  const navItems = [
    { key: 'home', path: '/', label: t('nav.home') },
    { key: 'introduction', path: '/introduction', label: t('nav.introduction') },
    { 
      key: 'people', 
      label: t('nav.people'),
      subItems: [
        { key: 'professor', path: '/people/professor', label: t('nav.professor') },
        { key: 'members', path: '/people/members', label: t('nav.members') },
        { key: 'alumni', path: '/people/alumni', label: t('nav.alumni') }
      ]
    },
    { 
      key: 'research', 
      label: t('nav.research'),
      subItems: [
        { key: 'casting', path: '/research/casting', label: 'High-Performance Alloys' },
        { key: 'films', path: '/research/films', label: 'Ferroelectric Films' },
        { key: 'biodegradable', path: '/research/biodegradable', label: 'Biodegradable Alloys' }
      ]
    },
    { key: 'publications', path: '/publications', label: t('nav.publications') },
    { 
      key: 'board', 
      label: t('nav.board'),
      subItems: [
        { key: 'news', path: '/board/news', label: t('nav.news') },
        { key: 'gallery', path: '/board/gallery', label: t('nav.gallery') }
      ]
    },
    { key: 'contact', path: '/contact', label: t('nav.contact') },
    { key: 'simulation', path: '/simulation', label: t('nav.simulation') },
  ];

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const handleSubItemClick = (path: string) => {
    onPageChange(path);
    setOpenDropdown(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <nav className="flex items-center">
      {navItems.map((item) => (
        <div 
          key={item.key} 
          className="relative"
          onMouseEnter={() => item.subItems && handleMouseEnter(item.key)}
          onMouseLeave={handleMouseLeave}
        >
          {(item as any).isExternal ? (
            <a
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-4 text-lg font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 flex items-center gap-1"
            >
              {item.label}
            </a>
          ) : item.subItems ? (
            <div className="relative">
              <div
                className={`px-4 py-4 text-lg font-medium cursor-pointer transition-all duration-200 flex items-center gap-1 ${
                  currentPage === item.key 
                    ? 'text-primary bg-primary/5 border-b-2 border-primary' 
                    : 'text-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.label}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === item.key ? 'rotate-180' : ''}`} />
              </div>
              
              {openDropdown === item.key && (
                <div className="absolute top-full left-0 min-w-48 bg-background border border-border rounded-lg shadow-lg z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.key}
                      onClick={() => handleSubItemClick(subItem.path)}
                      className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors duration-150"
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => onPageChange(item.path)}
              className={`px-4 py-4 text-lg font-medium cursor-pointer transition-all duration-200 ${
                (currentPage === item.key || (item.key === 'home' && currentPage === ''))
                  ? 'text-primary bg-primary/5 border-b-2 border-primary' 
                  : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              {item.label}
            </div>
          )}
        </div>
      ))}

      {/* 🌍 언어 전환 버튼 추가 */}
      <div className="ml-4 pl-4 border-l h-6 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleLanguage}
          className="font-semibold text-muted-foreground hover:text-primary gap-1 px-2"
        >
          <Globe className="w-4 h-4" />
          {language === 'en' ? 'EN' : 'KO'}
        </Button>
      </div>
    </nav>
  );
}