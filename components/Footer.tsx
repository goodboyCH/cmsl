'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/50 mt-16">
      <div className="container py-12 px-4 sm:px-8">
        <div className="flex flex-col md:flex-row gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start md:flex-1">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-primary mb-2">CMSL</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('footer.lab')}<br />
                {t('footer.dept')}<br />
                {t('footer.univ')}
              </p>
            </div>
            <a href="https://cms.kookmin.ac.kr/mse/index.do" target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/kmu-logo.png"
                alt="Kookmin University Logo"
                width={64}
                height={64}
                className="h-14 sm:h-16 w-auto opacity-80"
              />
            </a>
          </div>
          <div className="md:flex-1">
            <h3 className="text-lg font-semibold text-primary mb-4">{t('footer.links')}</h3>
            <div className="space-y-2 text-sm">
              <Link href="/research/casting" className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">
                {t('footer.links.research')}
              </Link>
              <Link href="/publications" className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">
                {t('footer.links.pubs')}
              </Link>
              <Link href="/people/members" className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">
                {t('footer.links.members')}
              </Link>
              <Link href="/contact" className="block w-full text-muted-foreground hover:text-primary smooth-transition md:text-left">
                {t('footer.links.contact')}
              </Link>
            </div>
          </div>
          <div className="md:flex-1">
            <h3 className="text-lg font-semibold text-primary mb-4">{t('footer.contact')}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Prof. Cha Pil-Ryung</p>
              <p>cprdream@kookmin.ac.kr</p>
              <p>+82-2-910-4656</p>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p className="mb-2">{t('footer.address')}</p>
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
