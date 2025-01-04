import '@/assets/styles/globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shirtology',
  description:
    "Shop premium men's and women's shirts at Shirtology. From classic dress shirts to trendy casual styles, explore high-quality fabrics, perfect fits, and timeless designs. Elevate your wardrobe with our expertly crafted shirts today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
