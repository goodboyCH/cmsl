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
    { key: 'pfm_sim', path: '/simulation', label: 'PFM Calculation' },
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

  // Close nav when path changes (optional but good UI UX)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setIsOpen(true)}>
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <>
          {/* Overlay Background */}
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Body */}
          <div className="fixed left-0 top-0 h-full w-[80%] max-w-xs z-[70] bg-white dark:bg-zinc-900 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-zinc-900">
              <div>
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">CMSL</h2>
                <p className="text-xs text-zinc-500">Navigation</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation List Area */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2 bg-white dark:bg-zinc-900">
              {navItems.map((item) => (
                <div key={item.key} className="w-full">
                  {item.subItems ? (
                    <div className="flex flex-col w-full">
                      <Button
                        variant="ghost"
                        onClick={() => toggleExpanded(item.key)}
                        className="w-full justify-between text-base font-semibold h-12 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100"
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedItems.includes(item.key) ? 'rotate-180' : ''}`} />
                      </Button>
                      {expandedItems.includes(item.key) && (
                        <div className="ml-4 mt-1 border-l-2 border-zinc-200 dark:border-zinc-700 space-y-1">
                          {item.subItems.map((sub) => (
                            <Button
                              key={sub.key}
                              variant="ghost"
                              onClick={() => handleItemClick(sub.path)}
                              className={`w-full justify-start text-sm h-10 px-4 ${pathname === sub.path ? 'text-blue-600 font-bold dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400'}`}
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
                      onClick={() => item.path && handleItemClick(item.path)}
                      className={`w-full justify-start text-base font-semibold h-12 px-3 ${pathname === item.path ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-zinc-800 dark:text-zinc-100'}`}
                    >
                      {item.label}
                    </Button>
                  )}
                </div>
              ))}
            </nav>

            {/* Bottom Button Area */}
            <div className="p-4 border-t bg-zinc-50 dark:bg-zinc-800">
              <Button variant="outline" className="w-full gap-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300" onClick={toggleLanguage}>
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'Switch to Korean' : 'Switch to English'}
              </Button>
              <p className="text-[10px] text-zinc-400 text-center mt-4 uppercase tracking-tighter">
                Computational Materials Science Laboratory
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
