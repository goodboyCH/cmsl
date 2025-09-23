import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageProvider';
import { ChevronDown } from 'lucide-react';

interface MobileNavigationProps {
  currentPage: string;
  onPageChange: (page: string, subTab?: string) => void;
}

export function MobileNavigation({ currentPage, onPageChange }: MobileNavigationProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navItems = [
    { key: 'home', label: t('nav.home') },
    { key: 'introduction', label: t('nav.introduction') },
    { 
      key: 'people', 
      label: t('nav.people'),
      subItems: [
        { key: 'professor', label: t('nav.professor') },
        { key: 'members', label: t('nav.members') },
        { key: 'alumni', label: t('nav.alumni') }
      ]
    },
    { 
      key: 'research', 
      label: t('nav.research'),
      subItems: [
        { key: 'casting', label: 'Casting Alloys' },
        { key: 'films', label: 'Thin Films' },
        { key: 'biodegradable', label: 'Biodegradable Alloys' }
      ]
    },
    { key: 'publications', label: t('nav.publications') },
    { key: 'projects', label: t('nav.projects') },
    { 
      key: 'board', 
      label: t('nav.board'),
      subItems: [
        { key: 'news', label: 'Notices & News' },
        { key: 'gallery', label: 'Gallery' }
      ]
    },
    { key: 'contact', label: t('nav.contact') },
  ];

  const handlePageChange = (page: string, subTab?: string) => {
    onPageChange(page, subTab);
    setIsOpen(false);
  };

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev => 
      prev.includes(key) 
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-12 w-12"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-in fade-in-0 duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 z-50 bg-white dark:bg-gray-900 border-r shadow-xl animate-in slide-in-from-left duration-300">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-primary">CMSL</h2>
                  <p className="text-sm text-muted-foreground">Navigation</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <div key={item.key}>
                    {item.subItems ? (
                      <div>
                        <Button
                          variant="ghost"
                          onClick={() => toggleExpanded(item.key)}
                          className="w-full justify-between text-lg font-medium h-12 px-4 animate-in slide-in-from-left duration-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {item.label}
                          <ChevronDown className={`h-4 w-4 transition-transform ${
                            expandedItems.includes(item.key) ? 'rotate-180' : ''
                          }`} />
                        </Button>
                        {expandedItems.includes(item.key) && (
                          <div className="ml-6 mt-2 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Button
                                key={subItem.key}
                                variant="ghost"
                                onClick={() => handlePageChange(item.key, subItem.key)}
                                className="w-full justify-start text-sm h-10 px-4 text-muted-foreground hover:text-foreground"
                              >
                                {subItem.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button
                        variant={currentPage === item.key ? 'default' : 'ghost'}
                        onClick={() => handlePageChange(item.key)}
                        className="w-full justify-start text-lg font-medium h-12 px-4 animate-in slide-in-from-left duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {item.label}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="absolute bottom-6 left-6 right-6 pt-4 border-t text-center">
                <p className="text-xs text-muted-foreground">
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