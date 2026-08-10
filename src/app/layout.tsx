import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/store/auth-context';
import { CartProvider } from '@/lib/store/cart-context';
import { ThemeProvider } from '@/lib/store/theme-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'Quality Glass Emporium & Photo Framing Center | Raebareli',
  description: 'Raebareli\'s premier photo framing center and glass dealers. Handcrafted picture frames, museum glass, optical acrylic fronts, and custom framing services.',
  keywords: ['glass dealers raebareli', 'photo framing center', 'picture frames', 'museum glass', 'acrylic float frame', 'quality glass emporium'],
  openGraph: {
    title: 'Quality Glass Emporium & Photo Framing Center',
    description: 'Frame your memories in perfect clarity with museum-grade glass and handcrafted picture frames.',
    url: 'https://qualityglassemporium.com',
    siteName: 'Quality Glass Emporium',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-background text-on-background">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <MobileNav />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
