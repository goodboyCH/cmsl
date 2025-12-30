'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from '@/components/LanguageProvider';
import { Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LanguageProvider>
      {children}
      <Toaster />
    </LanguageProvider>
  );
}
