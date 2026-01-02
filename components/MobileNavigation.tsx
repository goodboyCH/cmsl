'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageProvider';
import { ChevronDown, Menu, X, Globe } from 'lucide-react';

interface MobileNavigationProps {
  currentPage: string;
}

export function MobileNavigation({ currentPage }: MobileNavigationProps) {
  const router = useRouter();
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
    {
      key: 'pfm',
      path: '/simulation',
      label: 'PFM Calculation',
    },
  ];

  const handleItemClick = (path: string) => {
    router.push(path);
    setIsOpen(false);
    setExpandedItems([]);
  };

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev =>
      prev.includes(key)
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  useEffect(() => {
    if (isOpen) {
      const parentCategory = currentPage.split('/')[0];
      if (parentCategory && !expandedItems.includes(parentCategory)) {
        setExpandedItems([parentCategory]);
      }
    }
  }, [isOpen, currentPage]);


  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200" onClick={() => setIsOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-[85%] max-w-sm z-50 bg-white dark:bg-zinc-950 border-r shadow-xl animate-in slide-in-from-left-full duration-300 flex flex-col">
            <div className="p-4 flex flex-col h-full bg-white dark:bg-zinc-950">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">CMSL</h2>
                  <p className="text-xs text-zinc-500">Navigation</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </Button>
              </div>

              <nav className="flex-1 overflow-y-auto mt-4 space-y-1">
                {navItems.map((item: any) => (
                  <div key={item.key}>
                    {item.subItems ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => toggleExpanded(item.key)}
                          className="w-full justify-between text-base font-medium h-12 px-3 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          {item.label}
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedItems.includes(item.key) ? 'rotate-180' : ''}`} />
                        </Button>
                        {expandedItems.includes(item.key) && (
                          <div className="ml-4 pl-2 border-l-2 border-zinc-200 dark:border-zinc-700 space-y-1 py-1">
                            {item.subItems.map((subItem: any) => (
                              <Button
                                key={subItem.key}
                                variant={currentPage.endsWith(subItem.key) ? 'secondary' : 'ghost'}
                                onClick={() => handleItemClick(subItem.path)}
                                className="w-full justify-start text-sm h-10 px-3 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-normal hover:bg-zinc-50 dark:hover:bg-zinc-800"
                              >
                                {subItem.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Button
                        variant={currentPage === item.key ? 'default' : 'ghost'}
                        onClick={() => handleItemClick(item.path)}
                        className={`w-full justify-start text-base font-medium h-12 px-3 ${currentPage === item.key
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                      >
                        {item.label}
                      </Button>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-auto pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                  onClick={toggleLanguage}
                >
                  <Globe className="h-4 w-4" />
                  {language === 'en' ? 'Switch to Korean' : 'Switch to English'}
                </Button>

                <p className="text-xs text-zinc-400 text-center mt-4">
                  Computational Materials Science Laboratory
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
