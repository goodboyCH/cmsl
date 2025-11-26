import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentPage: string;
  onPageChange: (path: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  // 1. t 함수는 제거하고, 언어 상태와 토글 함수만 가져옵니다.
  const { language, toggleLanguage } = useLanguage();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 2. 메뉴명을 영어로 고정합니다. (번역 제거)
  const navItems = [
    { key: 'home', path: '/', label: 'Home' },
    { key: 'introduction', path: '/introduction', label: 'Introduction' },
    { 
      key: 'people', 
      label: 'People',
      subItems: [
        { key: 'professor', path: '/people/professor', label: 'Professor' },
        { key: 'members', path: '/people/members', label: 'Members' },
        { key: 'alumni', path: '/people/alumni', label: 'Alumni' }
      ]
    },
    { 
      key: 'research', 
      label: 'Research',
      subItems: [
        { key: 'casting', path: '/research/casting', label: 'High-Performance Alloys' },
        { key: 'films', path: '/research/films', label: 'Ferroelectric Films' },
        { key: 'biodegradable', path: '/research/biodegradable', label: 'Biodegradable Alloys' }
      ]
    },
    { key: 'publications', path: '/publications', label: 'Publications' },
    { 
      key: 'board', 
      label: 'Board',
      subItems: [
        { key: 'news', path: '/board/news', label: 'Notices & News' },
        { key: 'gallery', path: '/board/gallery', label: 'Gallery' }
      ]
    },
    { key: 'contact', path: '/contact', label: 'Contact' },
    { key: 'simulation', path: '/simulation', label: 'PFM Calculation', isExternal: false },
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

      {/* 3. 언어 전환 버튼은 그대로 유지 */}
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