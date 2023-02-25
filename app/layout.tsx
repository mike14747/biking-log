import { ReactNode } from 'react';
import ClientSessionProvider from './components/ClientSessionProvider';
import Header from './components/Header';
// import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import SkipToMain from './components/SkipToMain';
import { Session } from 'next-auth';

import '../styles/mg_base.css';
import '../styles/globals.css';

type RootLayoutProps = {
    children: ReactNode;
    session: Session;
};

export const metadata = {
    title: 'Biking Log',
    description: 'Log all your bike riding data',
};

export default async function RootLayout({ children, session }: RootLayoutProps) {
    return (
        <html lang="en">
            <head>
                <meta content="width=device-width, initial-scale=1" name="viewport" />
                {/* <link rel="icon" href="data:," /> */}
                <link rel="icon" type="image/png" href="/images/biking_log_favicon-16x16.png" sizes="16x16" />
                <link rel="icon" type="image/png" href="/images/biking_log_favicon-32x32.png" sizes="32x32" />
            </head>

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
