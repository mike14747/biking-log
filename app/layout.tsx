import { ReactNode } from 'react';
import type { Metadata } from 'next';
// eslint-disable-next-line camelcase
import { Open_Sans } from 'next/font/google';
import ClientSessionProvider from '@/components/ClientSessionProvider';
import Header from '@/components/Header';
// import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollTop from '@/components/ScrollTop';
import SkipToMain from '@/components/SkipToMain';
import { Session } from 'next-auth';

import '@/styles/mg_base.css';
import '@/styles/globals.css';

type RootLayoutProps = {
    children: ReactNode;
    session: Session;
};

const openSans = Open_Sans({
    variable: '--font-openSans',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Biking Log',
    description: 'Log all your bike riding data',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
    icons: {
        icon: [
            {
                url: '/images/biking_log_favicon-16x16.png',
                sizes: '16x16',
            },
            {
                url: '/images/biking_log_favicon-32x32.png',
                sizes: '32x32',
            },
        ],
    },
};

export default async function RootLayout({ children, session }: RootLayoutProps) {
    return (
        <html lang="en" className={openSans.variable}>
            <body id="appWrapper">
                <ClientSessionProvider session={session}>
                    <SkipToMain />
                    <Header />
                    {/* <Navbar /> */}

                    <div className="page-container">
                        {children}
                        <ScrollTop />
                    </div>

                    <Footer />
                </ClientSessionProvider>
            </body>
        </html>
    );
}
