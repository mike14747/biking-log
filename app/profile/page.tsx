import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import CurrentProfile from '@/components/Profile/CurrentProfile';
import { getUserProfile } from '@/lib/api/user';
import { Suspense } from 'react';
import Spinner from '@/components/Spinner';

export const metadata: Metadata = {
    title: 'Biking Log - Profile',
};

export default async function Profile() {
    const session = await getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    if (!session) {
        redirect('/login?callbackUrl=/profile');
    }

    const userObj = await getUserProfile(parseInt(session.id));

    return (
        <main id="main">
            <article className="mw-75ch">
                <h1 className="page-heading">
                    Profile
                </h1>

                <Suspense fallback={<Spinner size="large" />}>
                    {userObj
                        ? <CurrentProfile userObj={userObj} />
                        : <p className="error">An error occurred fetching user profile info.</p>
                    }
                </Suspense>
            </article>
        </main>
    );
}
