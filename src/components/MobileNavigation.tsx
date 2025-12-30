import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageProvider';
import { ChevronDown, Menu, X, Globe } from 'lucide-react'; // Globe 아이콘 추가

interface MobileNavigationProps {
  currentPage: string;
  onPageChange: (path: string) => void;
}

export function MobileNavigation({ currentPage, onPageChange }: MobileNavigationProps) {
  // 1. language와 toggleLanguage 가져오기
  const { t, language, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // 2. 메뉴명은 데스크톱과 동일하게 영어로 고정 (필요시 t() 사용 가능)
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
        { key: 'casting', path: '/research/pfm', label: 'Real Scale PFM' },
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
      isExternal: false // 외부 링크 여부에 따라 조정 (시뮬레이션 페이지는 내부 라우트이므로 false)
    },
  ];

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
                {navItems.map((item: any) => (
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
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedItems.includes(item.key) ? 'rotate-180' : ''
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

              {/* 3. 언어 전환 버튼 추가 */}
              <div className="mt-auto pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={toggleLanguage}
                >
                  <Globe className="h-4 w-4" />
                  {language === 'en' ? 'Switch to Korean' : 'Switch to English'}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
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