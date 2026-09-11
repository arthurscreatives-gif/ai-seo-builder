import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AI SEO Love — AI-Powered SEO & Growth by Arthur’s Creatives',
  description: 'AI-powered SEO and business growth platform owned by Arthur’s Creatives for website audits, LOVE Brain AI assistant, keyword research, content engine, competitor analysis, and local SEO.',
  openGraph: {
    title: 'AI SEO Love — AI-Powered SEO & Growth by Arthur’s Creatives',
    description: 'AI-powered SEO and business growth platform owned by Arthur’s Creatives for website audits, LOVE Brain AI assistant, keyword research, content engine, competitor analysis, and local SEO.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI SEO Love — AI-Powered SEO & Growth by Arthur’s Creatives',
    description: 'AI-powered SEO and business growth platform owned by Arthur’s Creatives.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
