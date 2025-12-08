// src/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Mijn Project',
  description: 'Next.js + Tailwind demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
