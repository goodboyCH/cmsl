'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageProvider';
import { ChevronDown, Menu, X, Globe } from 'lucide-react';

interface MobileNavigationProps {
  currentPage: string;
}

export function MobileNavigation({ currentPage }: MobileNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // 네비게이션 항목 (기존 유지, 중복 키 수정)
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
    { key: 'pfm_calc', path: '/simulation', label: 'PFM Calculation' }, // key 중복 방지
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

  // 메뉴가 열릴 때 본문 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* 햄버거 버튼 */}
      <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setIsOpen(true)}>
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999]"> {/* 최상위 컨테이너 강제 고정 */}
          {/* 어두운 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* 사이드바 본체: h-screen과 w-full/max-w 적용 */}
          <div className="absolute left-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 border-r border-zinc-200 dark:border-zinc-800">

            {/* 상단 헤더 영역 */}
            <div className="p-5 flex items-center justify-between border-b bg-white dark:bg-zinc-950">
              <div>
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">CMSL</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Navigation</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* 네비게이션 스크롤 영역: flex-1과 overflow-y-auto로 공간 확보 */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1 bg-white dark:bg-zinc-950">
              {navItems.map((item) => (
                <div key={item.key}>
                  {item.subItems ? (
                    <div className="mb-1">
                      <Button
                        variant="ghost"
                        onClick={() => toggleExpanded(item.key)}
                        className="w-full justify-between text-base font-semibold h-12 px-3 text-zinc-800 dark:text-zinc-200"
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedItems.includes(item.key) ? 'rotate-180' : ''}`} />
                      </Button>
                      {expandedItems.includes(item.key) && (
                        <div className="ml-4 mt-1 border-l-2 border-zinc-100 dark:border-zinc-800 space-y-1">
                          {item.subItems.map((sub) => (
                            <Button
                              key={sub.key}
                              variant="ghost"
                              onClick={() => handleItemClick(sub.path)}
                              className={`w-full justify-start text-sm h-10 px-4 ${pathname === sub.path ? 'text-blue-600 bg-blue-50/50' : 'text-zinc-600'}`}
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

            {/* 하단 설정 영역 */}
            <div className="p-5 border-t bg-zinc-50 dark:bg-zinc-900/50">
              <Button
                variant="outline"
                className="w-full gap-2 border-zinc-200 dark:border-zinc-700"
                onClick={toggleLanguage}
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'Switch to Korean' : 'Switch to English'}
              </Button>
              <div className="mt-4 text-[10px] text-zinc-400 text-center leading-relaxed">
                Computational Materials Science Laboratory<br />
                Kookmin University
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}