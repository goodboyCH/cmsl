import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

const inter = Inter({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://cmsl.kookmin.ac.kr'),
  title: 'CMSL - 국민대학교 계산재료과학 연구실',
  description: 'CMSL(Computational Materials Science Laboratory)은 Phase-field 모델링, CALPHAD, AI 기반 소재 설계를 전문으로 하는 연구실입니다.',
  keywords: [
    'Phase-field', 'CALPHAD', 'HZO', 'alloy', 'Ferroelectric', 'PFM', 'Material Science', 'AI', 'CMSL',
    '계산재료과학', '국민대학교', '신소재공학', '국민대학교 신소재공학부', '인공지능', '차필령',
    '국민대학교 차필령', '차필령 교수', 'Pil-Ryung Cha', 'Kookmin University'
  ],
  authors: [{ name: 'CMSL Research Team' }],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
  openGraph: {
    type: 'website',
    url: 'https://cmsl.kookmin.ac.kr/',
    title: 'CMSL - 국민대학교 계산재료과학 연구실',
    description: 'Phase-field 모델링과 AI를 이용한 첨단 계산재료과학 연구실',
    images: [{ url: '/images/pfm.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CMSL - 국민대학교 계산재료과학 연구실',
    description: 'Advanced computational materials science research using phase-field modeling and AI.',
    images: ['/images/pfm.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CMSL",
    "alternateName": "국민대학교 계산재료과학 연구실",
    "url": "https://cmsl.kookmin.ac.kr/",
    "description": "Phase-field 모델링과 AI를 이용한 첨단 계산재료과학 연구실",
    "publisher": {
      "@type": "Organization",
      "name": "국민대학교"
    }
  };

  return (
    <html lang="ko-KR" suppressHydrationWarning>
      <body className={`${inter.className} ${jetbrainsMono.variable} min-h-screen bg-background font-sans selection:bg-primary/10 selection:text-primary`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <ScrollToTopButton />
        </Providers>
      </body>
    </html>
  );
}
