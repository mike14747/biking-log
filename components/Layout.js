import PropTypes from 'prop-types';

import Header from './Header';
import Authbar from './Authbar';
import Footer from './Footer';
import ScrollTop from './ScrollTop';

const Layout = ({ children }) => {
    return (
        <>
            <Header />

            <Authbar />

            <main className="main-container">
                {children}
                <ScrollTop />
            </main>

            <Footer />
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.object,
};

export default Layout;
