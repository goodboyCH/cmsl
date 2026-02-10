'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Portal 기능 추가
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageProvider';
import { ChevronDown, Menu, X, Globe } from 'lucide-react';

export function MobileNavigation({ currentPage }: { currentPage: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false); // 서버 사이드 렌더링 방지용

  // 1. 마운트 확인 (Next.js Hydration 오류 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. 메뉴 열림 시 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

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
        { key: 'pfm', path: '/research/pfm', label: 'Real Scale PFM' },
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
    { key: 'pfm_calc', path: '/simulation', label: 'PFM Calculation' },
  ];

  const handleItemClick = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
    );
  };

  // 3. Portal에 렌더링될 실제 메뉴 컴포넌트
  const menuContent = (
    <div className="fixed inset-0 z-[10000] flex"> {/* 최상단 고정 */}
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* 사이드바 본체 */}
      <div className="relative w-[300px] h-full bg-white dark:bg-zinc-950 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        <div className="p-5 flex items-center justify-between border-b">
          <div>
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">CMSL</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Navigation</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.key}>
              {item.subItems ? (
                <div className="mb-1">
                  <Button
                    variant="ghost"
                    onClick={() => toggleExpanded(item.key)}
                    className="w-full justify-between text-base font-semibold h-12 px-3"
                  >
                    {item.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedItems.includes(item.key) ? 'rotate-180' : ''}`} />
                  </Button>
                  {expandedItems.includes(item.key) && (
                    <div className="ml-4 mt-1 border-l-2 border-zinc-100 space-y-1">
                      {item.subItems.map((sub) => (
                        <Button
                          key={sub.key}
                          variant="ghost"
                          onClick={() => handleItemClick(sub.path)}
                          className={`w-full justify-start text-sm h-10 px-4 ${pathname === sub.path ? 'text-blue-600 bg-blue-50' : 'text-zinc-600'}`}
                        >
                          {sub.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full justify-start text-base font-semibold h-12 px-3 mb-1 ${pathname === item.path ? 'bg-blue-50 text-blue-700' : 'text-zinc-800'}`}
                >
                  {item.label}
                </Button>
              )}
            </div>
          ))}
        </nav>

        <div className="p-5 border-t bg-zinc-50 dark:bg-zinc-900/50">
          <Button variant="outline" className="w-full gap-2" onClick={toggleLanguage}>
            <Globe className="h-4 w-4" />
            {language === 'en' ? 'Switch to Korean' : 'Switch to English'}
          </Button>
          <div className="mt-4 text-[10px] text-zinc-400 text-center leading-relaxed">
            Computational Materials Science Laboratory<br />Kookmin University
          </div>
        </div>
      </div>
    </div>
  );

  // 버튼은 원래 위치에, 메뉴는 body 바로 아래에 렌더링
  return (
    <>
      <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setIsOpen(true)}>
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && mounted && createPortal(menuContent, document.body)}
    </>
  );
}