import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MainNav from '@/components/MainNav';
import Provider from '@/provider/Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Chess | Let's have fun",
  description: 'chess game live-chess chess chess-nepal play chess in nepal ',
  verification: {
    google: 'g4fkHswoWzzQ4C6BKI-frRO5ssRnTelcN8AsOTQrbRo',
  },
  icons: {
    icon: '/favicon.ico',
    // apple: '/favicons/apple-touch-icon.png',
  },
  applicationName: 'Chessconnect',
  creator: 'Samir Neupane',
  keywords: [
    'Chess',
    'Chessconnect',
    'Chess Nepal',
    'play chess with friends',
    'Earn money playing chess',
  ],
  metadataBase: new URL('https://chessconnect.vercel.app/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} flex   bg-black h-screen w-screen`}>
        <Provider>
          <div className="flex  flex-col sm-phone:flex-row   w-full   ">
            <header className="sm-phone:w-28 p-2 sm-phone:p-0  sm-phone:h-screen  phone:w-56 laptop:w-60 sm-phone:sticky sm-phone:top-0 sm-phone:left-0  block border-b-[1px] border-gray-500 sm-phone:border-r-[1px]  sm-phone:border-b-[0px] sticky top-0 left-0 bg-black z-10 ">
              <MainNav />
            </header>
            <main className="w-full overflow-y-scroll ">{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}

<meta
  name="google-site-verification"
  content="g4fkHswoWzzQ4C6BKI-frRO5ssRnTelcN8AsOTQrbRo"
/>;
