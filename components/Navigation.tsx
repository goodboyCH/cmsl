'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from './LanguageProvider';
import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentPage: string;
}

export function Navigation({ currentPage }: NavigationProps) {
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    { key: 'simulation', path: '/simulation', label: 'PFM Calculation' },
  ];

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const handleSubItemClick = (path: string) => {
    router.push(path);
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
          {item.subItems ? (
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
            <Link
              href={item.path}
              className={`px-4 py-4 text-lg font-medium cursor-pointer transition-all duration-200 block ${
                (currentPage === item.key || (item.key === 'home' && currentPage === ''))
                  ? 'text-primary bg-primary/5 border-b-2 border-primary'
                  : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}

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
