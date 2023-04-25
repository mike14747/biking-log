import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import AddRideForm from '@/components/Data/AddRideForm';

export const metadata: Metadata = {
    title: 'Biking Log - Add Ride Data',
};

export default async function AddRide() {
    const session = await getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    if (!session) {
        redirect('/login?callbackUrl=/add-ride');
    }

    return (
        <main id="main">
            <article className="mw-75ch">
                <h2 className="page-heading">
                    Add Ride Data
                </h2>

                <AddRideForm />
            </article>
        </main>
    );
}
