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
};

export default async function RootLayout({ children, session }: RootLayoutProps) {
    return (
        <html lang='en'>
            <head />
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
