import React from 'react';
import './globals.css';
import ClientAnimations from '@/components/ClientAnimations';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientAnimations>
          {children}
        </ClientAnimations>
      </body>
    </html>
  );
}