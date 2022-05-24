import styles from '../styles/Footer.module.css';

export default function Footer() {
    return (
        <div className={'container ' + styles.footer}>
            <p className={styles.copyright}>
                &copy; 2022 biking-log
            </p>
        </div>
    );
}
