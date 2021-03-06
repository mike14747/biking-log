import { useRouter } from 'next/router';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Button from '../components/Button';

import styles from '../styles/Authbar.module.css';

const Authbar = () => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    const router = useRouter();

    return (
        <div className={styles.authbarContainer}>
            {loading && <>Loading...</>}

            {!session && !loading &&
                <>
                    <Link href={`/login?url=${router.pathname}`}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>Login</a>
                    </Link>

                    <span>&nbsp;/&nbsp;</span>

                    <Link href={'/register'}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>Register</a>
                    </Link>
                </>
            }

            {session &&
                <>
                    <span className={styles.username}>
                        <>User: </>
                        <Link href="/profile">
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a>
                                {session.user.name}
                            </a>
                        </Link>
                    </span>

                    <Button onClick={() => signOut({ redirect: false })} size="small" variant="text">Logout</Button>
                </>
            }
        </div>
    );
};

export default Authbar;
