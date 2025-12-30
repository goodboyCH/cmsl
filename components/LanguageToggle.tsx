import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageProvider';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="text-xs"
      >
        EN
      </Button>
      <Button
        variant={language === 'ko' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('ko')}
        className="text-xs"
      >
        한국어
      </Button>
    </div>
  );
}