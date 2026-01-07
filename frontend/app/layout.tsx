import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AbleSpace Library Explorer',
  description: 'A full-stack scraping and data visualization dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use the environment variable if available, otherwise fallback to the live Render URL
  const API_DOCS_URL = process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/docs` 
    : 'https://product-explorer-assignment.onrender.com/api/docs';

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 antialiased`}>
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
                AS
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-900">
                Library<span className="text-blue-600">Explorer</span>
              </span>
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Discover
              </Link>
              <a 
                href={API_DOCS_URL} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                API Docs
              </a>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                v1.0.0
              </span>
            </div>
          </div>
        </nav>

        <main className="flex flex-col min-h-[calc(100vh-4rem)]">
          {children}
        </main>

        <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-200 bg-white">
          <p>© 2026 AbleSpace Scraper Assessment. Built with NestJS & Next.js.</p>
        </footer>
      </body>
    </html>
  );
}