import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { RoleProvider } from '@/context/RoleContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import FloatingCartButton from '@/components/FloatingCartButton';
import AuthModal from '@/components/AuthModal';
import IndiaTranslatorModal from '@/components/IndiaTranslatorModal';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Nira — Direct Farm-to-Buyer Digital Agriculture Platform (SIH 2026)',
  description: 'Nira is an AI-powered direct agriculture commerce and logistics platform eliminating middlemen for SIH 2026 Problem Statement 26033. Features Computer Vision grading, fair price calculations, multi-stop route optimization, and dual-OTP escrow protection.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('kb_theme');
                  if (storedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.style.colorScheme = 'light';
                  }

                  // One-time purge of legacy local cached products, orders, and images
                  if (!localStorage.getItem('kb_data_purged_v2')) {
                    localStorage.removeItem('kb_custom_crops');
                    localStorage.removeItem('kb_buyer_active_orders');
                    localStorage.removeItem('kb_cart');
                    localStorage.removeItem('kb_verified_produce_registry');
                    localStorage.setItem('kb_data_purged_v2', '1');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-amber-200 selection:text-emerald-950 dark:selection:bg-amber-500/30 dark:selection:text-amber-200 bg-[#FAF5EB] dark:bg-[#07170f] text-[#1A2E26] dark:text-[#E2E8F0] transition-colors duration-200 w-full max-w-full overflow-x-hidden">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <RoleProvider>
                <CartProvider>
                  <div className="flex flex-col min-h-screen w-full max-w-full">
                    <Navbar />
                    <main className="flex-1 w-full max-w-full px-3 sm:px-8 lg:px-12 py-4 sm:py-6 overflow-x-hidden">
                      {children}
                    </main>
                    <CartDrawer />
                    <FloatingCartButton />
                    <AuthModal />
                    <IndiaTranslatorModal />
                    <Footer />
                  </div>
                </CartProvider>
              </RoleProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
