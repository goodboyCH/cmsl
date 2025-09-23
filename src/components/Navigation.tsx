import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { ChevronDown } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  // onPageChange의 두 번째 인자(subTab)는 이제 필요 없습니다.
  onPageChange: (path: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { t } = useLanguage();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        { key: 'casting', path: '/research/casting', label: 'Casting Alloys' },
        { key: 'films', path: '/research/films', label: 'Thin Films' },
        { key: 'biodegradable', path: '/research/biodegradable', label: 'Biodegradable Alloys' }
      ]
    },
    { key: 'publications', path: '/publications', label: t('nav.publications') },
    { key: 'projects', path: '/projects', label: t('nav.projects') },
    { 
      key: 'board', 
      label: t('nav.board'),
      subItems: [
        { key: 'news', path: '/board/news', label: 'Notices & News' },
        { key: 'gallery', path: '/board/gallery', label: 'Gallery' }
      ]
    },
    { key: 'contact', path: '/contact', label: t('nav.contact') },
  ];

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  // subItem 클릭 시 해당 path로 바로 이동
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
    <nav className="flex">
      {navItems.map((item) => (
        <div 
          key={item.key} 
          className="relative"
          onMouseEnter={() => item.subItems && handleMouseEnter(item.key)}
          onMouseLeave={handleMouseLeave}
        >
          {item.subItems ? (
            <div className="relative">
              <div
                onClick={() => onPageChange(`/${item.key}`)} // 상위 메뉴 클릭 시 해당 경로로 이동
                className={`px-6 py-4 text-lg font-medium cursor-pointer transition-all duration-200 flex items-center gap-1 ${
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
              onClick={() => onPageChange(item.path)} // subItems가 없는 경우 path로 이동
              className={`px-6 py-4 text-lg font-medium cursor-pointer transition-all duration-200 ${
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
    </nav>
  );
}