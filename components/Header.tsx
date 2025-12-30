'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { useLanguage } from '@/components/LanguageProvider';

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const currentPage = pathname.split('/')[1] || 'home';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 transition-all duration-200">
      <div className="container flex items-center justify-between h-16 sm:h-20 px-4 xl:px-8">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/" className="flex-shrink-0 group">
            <Image
              src="/images/logo1.png"
              alt="CMSL Logo"
              width={48}
              height={48}
              className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
              priority
            />
          </Link>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="font-semibold text-sm lg:text-[15px] text-foreground/80 tracking-tight">
              {t('header.line1')}
            </span>
            <span className="font-semibold text-sm lg:text-[15px] text-foreground/80 tracking-tight">
              {t('header.line2')}
            </span>
          </div>
        </div>

        <div className="hidden min-[1280px]:flex">
          <Navigation currentPage={currentPage} />
        </div>
      </div>

      <div className="fixed top-4 right-4 min-[1400px]:hidden z-50">
        <MobileNavigation currentPage={currentPage} />
      </div>
    </header>
  );
}
