import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'EnrollHire Pilot v1',
  description: 'Deploy-ready minimal Next.js project',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
