import { Inter } from 'next/font/google';
import ReduxProvider from '@/redux/redux-provider';

import "../src/assets/sass/index.scss";


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CoinRoutes App',
  description: 'Crypto data visualization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
