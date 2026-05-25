import type { Metadata } from 'next';
import { Syne, Epilogue } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-syne',
  display: 'swap',
});

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-epilogue',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TV Notes',
  description: 'TradingView Notes App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={`${syne.variable} ${epilogue.variable}`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}