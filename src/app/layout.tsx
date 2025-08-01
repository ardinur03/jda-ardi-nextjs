
"use client";

import './globals.css';
import { Inter, Manrope } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from "@/components/ui/toaster"
import { ReduxProvider } from '@/redux/provider';
import AuthProvider from '@/components/auth-provider';
import { usePathname } from 'next/navigation';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Manrope({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-headline',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Build With Zelo</title>
        <meta name="description" content="A premium portfolio for a professional developer." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Manrope:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <AuthProvider>
            <ReduxProvider>
                <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                >
                {!isDashboardRoute && <Header />}
                {children}
                {!isDashboardRoute && <Footer />}
                <Toaster />
                </ThemeProvider>
            </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
