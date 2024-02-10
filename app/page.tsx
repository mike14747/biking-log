import { getServerSession } from 'next-auth/next';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Biking Log - Home',
};

export default async function Home() {
    const session = await getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    return (
        <main id="main">
            {!session &&
                <article>
                    <h1 className="page-heading">
                        Biking Log
                    </h1>

                    <p>
                        Use this app to log, track, review and compare your bike riding history/progress.
                    </p>

                    <p>
                        <Link href="/login?callbackUrl=/">
                            Login
                        </Link>

                        <span>&nbsp;or&nbsp;</span>

                        <Link href={'/register'}>
                            Register
                        </Link>

                        <span>&nbsp;to begin.</span>
                    </p>
                </article>
            }

            {session &&
                <article>
                    <h1 className="page-heading">
                        Dashboard
                    </h1>

                    <p>
                        You are logged in, so this will be your dashboard.
                    </p>

                    <Link href="/add-ride">
                        Add ride data
                    </Link>
                </article>
            }
        </main>
    );
}
