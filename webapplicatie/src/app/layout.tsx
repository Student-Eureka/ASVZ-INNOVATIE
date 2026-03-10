import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'ASVZ Sonde Dashboard',
  description: 'Dashboard voor pompen, live status en servo-bediening via MQTT.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
