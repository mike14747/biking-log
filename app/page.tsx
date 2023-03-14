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
                <p>
                    Since you are not logged in, display some component that describes what this app does... and prompts them to login or register.
                </p>
            }

            {session &&
                <article>
                    <h2 className="page-heading">
                        Dashboard
                    </h2>

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
