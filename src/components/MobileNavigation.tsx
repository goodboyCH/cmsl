import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageProvider';
import { ChevronDown, Menu, X } from 'lucide-react';

interface MobileNavigationProps {
  currentPage: string;
  onPageChange: (path: string) => void;
}

export function MobileNavigation({ currentPage, onPageChange }: MobileNavigationProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
    { 
      key: 'board',
      label: t('nav.board'),
      subItems: [
        { key: 'news', path: '/board/news', label: 'Notices & News' },
        { key: 'gallery', path: '/board/gallery', label: 'Gallery' }
      ]
    },
    { key: 'contact', path: '/contact', label: t('nav.contact') },
    // 1. ⬇️ 여기에 'PFM Calculation' 항목을 추가합니다. ⬇️
    { 
      key: 'pfm', 
      path: '/simulation', 
      label: 'PFM Calculation', 
      isExternal: true 
    },
  ];

  // 2. ⬇️ 내부/외부 링크를 모두 처리할 수 있도록 핸들러를 수정합니다. ⬇️
  const handleItemClick = (path: string, isExternal = false) => {
    if (isExternal) {
      window.open(path, '_blank');
    } else {
      onPageChange(path);
    }
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
  
  React.useEffect(() => {
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
          <div 
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-in fade-in-0 duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-[85%] max-w-sm z-50 bg-background border-r shadow-xl animate-in slide-in-from-left-full duration-300">
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h2 className="text-xl font-bold text-primary">CMSL</h2>
                  <p className="text-xs text-muted-foreground">Navigation</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto mt-4 space-y-1">
                {/* 3. ⬇️ isExternal 속성을 확인하는 렌더링 로직을 추가합니다. ⬇️ */}
                {navItems.map((item: any, index) => (
                  <div key={item.key}>
                    {item.isExternal ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleItemClick(item.path, true)}
                        className="w-full justify-start text-base font-medium h-11 px-3"
                      >
                        {item.label}
                      </Button>
                    ) : item.subItems ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => toggleExpanded(item.key)}
                          className="w-full justify-between text-base font-medium h-11 px-3"
                        >
                          {item.label}
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                            expandedItems.includes(item.key) ? 'rotate-180' : ''
                          }`} />
                        </Button>
                        {expandedItems.includes(item.key) && (
                          <div className="ml-4 pl-2 border-l-2 space-y-1 py-1">
                            {item.subItems.map((subItem: any) => (
                              <Button
                                key={subItem.key}
                                variant={currentPage.endsWith(subItem.key) ? 'secondary' : 'ghost'}
                                onClick={() => handleItemClick(subItem.path)}
                                className="w-full justify-start text-sm h-9 px-3 text-muted-foreground hover:text-foreground font-normal"
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
                        className="w-full justify-start text-base font-medium h-11 px-3"
                      >
                        {item.label}
                      </Button>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-auto pt-4 border-t text-center">
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