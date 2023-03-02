import { redirect } from 'next/navigation';
// eslint-disable-next-line camelcase
import { getServerSession } from 'next-auth/next';
import CurrentProfile from '../components/profile/CurrentProfile';
import { getUserProfile } from '../../lib/api/index';

export const metadata = {
    title: 'Biking Log - Profile',
};

async function getData(id: number) {
    const data = await getUserProfile(id).catch(error => console.log(error.message));
    if (!data) return null;
    return JSON.parse(JSON.stringify(data));
}

export default async function Profile() {
    const session = await getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    if (!session) {
        redirect('/login?callbackUrl=/profile');
    }

    const user = await getData(parseInt(session.id)).catch(error => console.log(error.message));
    if (user?.username && user?.email) user.id = session.id;

    return (
        <main id="main">
            <article className="mw-75ch">
                {/* had to add this nested fragment to get typescript to stop complaining about multiple children */}
                <>
                    <h2 className="page-heading">
                        Profile
                    </h2>

                    {user?.length === 1
                        ? <CurrentProfile userObj={user[0]} />
                        : <p className="error">An error occurred fetching user profile info.</p>
                    }
                </>
            </article>
        </main>
    );
}
