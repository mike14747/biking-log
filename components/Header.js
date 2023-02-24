import Link from 'next/link';
import Authbar from './Authbar';

import styles from '../styles/Header.module.css';

export default function Header() {
    return (
        <div className={'container ' + styles.header}>
            <div className={styles.leftDiv}>
                <Link href="/">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/bicycle.png" alt="biking-log" />
                </Link>

            </div>

            <div className={styles.rightDiv}>
                <Authbar />
            </div>
        </div>
    );
}
