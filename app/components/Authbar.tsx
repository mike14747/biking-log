'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Button from '../components/Button';

import styles from '../../styles/Authbar.module.css';

export default function Authbar() {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    return (
        <section className={styles.authbarContainer}>
            {loading && <>Loading...</>}

            {!session && !loading &&
                <p>
                    <Link href="/login?callbackUrl=/">
                        Login
                    </Link>

                    <span>&nbsp;/&nbsp;</span>

                    <Link href={'/register'}>
                        Register
                    </Link>
                </p>
            }

            {session?.user &&
                <>
                    <span className={styles.username}>
                        <>User: </>
                        <Link href="/profile">
                            {session.user.name}
                        </Link>
                    </span>

                    <Button onClick={() => signOut({ callbackUrl: '/' })} size="small" variant="text">Logout</Button>
                </>
            }
        </section>
    );
}
