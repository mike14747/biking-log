import type { Metadata } from 'next';
import AddRideData from './components/rideData/AddRideData';

export const metadata: Metadata = {
    title: 'Biking Log - Homepage',
};

export default function Home() {
    return (
        <>
            <main id="main">
                <article>
                    <p>
                        This is the homepage in the app folder.
                    </p>
                </article>

                <AddRideData />
            </main>
        </>
    );
}
