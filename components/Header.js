import styles from '../styles/Header.module.css';

export default function Header() {
    return (
        <div className={'container ' + styles.header}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/bicycle.png" alt="biking-log" />
        </div>
    );
}
