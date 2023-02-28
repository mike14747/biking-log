import Link from 'next/link';
import Authbar from './Authbar';

import styles from '../../styles/Header.module.css';

export default function Header() {
    return (
        <header className={'container ' + styles.header}>
            <div className={styles.leftDiv}>
                <Link href="/">
                    <img src="/images/bicycle.png" alt="biking-log" />
                </Link>

            </div>

            <div className={styles.rightDiv}>
                <Authbar />
            </div>
        </header>
    );
}