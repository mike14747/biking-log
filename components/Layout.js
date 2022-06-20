import PropTypes from 'prop-types';

import Header from './Header';
import Footer from './Footer';
import ScrollTop from './ScrollTop';

const Layout = ({ children }) => {
    return (
        <>
            <Header />

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
