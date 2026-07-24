import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { UtilityBar } from '@/components/shared/utility-bar';
import { AdminHydrator } from '@/components/shared/admin-hydrator';
import { SWRProvider } from '@/components/shared/swr-provider';
import { ThemeProvider } from '@/components/shared/theme-provider';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ПУ Гимназия с. Томай',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SWRProvider>
            <AdminHydrator />
            <div className="flex min-h-screen flex-col">
              <UtilityBar />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SWRProvider>
          <Toaster position="top-center" />
          <NextTopLoader color="var(--primary)" showSpinner={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
