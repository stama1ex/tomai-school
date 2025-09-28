import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/shared/header';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { AdminButton } from '@/components/shared/admin-button';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';

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
          <Header />
          <AdminButton />
          {children}
          <Toaster position="top-center" />
          <NextTopLoader color="var(--primary)" showSpinner={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
