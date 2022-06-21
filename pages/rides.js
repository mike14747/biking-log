import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Loading from '../components/Loading';

import styles from '../styles/Rides.module.css';

export default function Rides() {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    const router = useRouter();

    const [rideData, setRideData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (session) {
            // setIsLoading(true);
            // const fetchData = async () => {
            //     const data = await fetch('/api/users/' + session.user.id + '/data')
            //         .then(res => res.json())
            //         .catch(error => console.error(error));
            //     if (data?.length > 0) {
            //         setRideData(data);
            //     } else {
            //         setRideData(null);
            //         setError('An error occurred fetching data.');
            //     }
            //     setIsLoading(false);
            // };
            // fetchData();
        } else {
            setRideData(null);
        }
    }, [session]);

    if (loading) return <Loading />;

    if (!session) router.push('/login?url=/rides');

    if (session) {
        return (
            <>
                <Head>
                    <title>
                        Biking Log - Rides
                    </title>
                </Head>

                <article className="mw-75ch">
                    <h2 className="page-heading">
                        My Rides
                    </h2>

                    {isLoading && <Loading />}

                    {error && <p className="error">{error}</p>}

                    <p>This is the rides page!</p>
                </article>
            </>
        );
    }
}
