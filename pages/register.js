import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Head from 'next/head';
import FormInputForUsername from '../components/FormInputForUsername';
import FormInputForNewPassword from '../components/FormInputForNewPassword';
import FormInputForEmail from '../components/FormInputForEmail';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function Register() {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    const router = useRouter();
    const redirectUrl = router.query.url || '/';

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState(null);

    if (typeof window !== 'undefined' && loading) return null;

    if (typeof window !== 'undefined' && session) router.push(redirectUrl);

    if (session) {
        router.push(redirectUrl);
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
    };

    return (
        <>
            <Head>
                <title>
                    Biking Log - Register
                </title>
            </Head>

            {loading && <Loading />}

            {!loading && status === 'unauthenticated' &&
                <>
                    <h2 className="page-heading">
                        Register
                    </h2>

                    {error &&
                        <p className="validation-error">
                            {error}
                        </p>
                    }

                    <form method="post" onSubmit={handleRegisterSubmit} className="form">
                        <FormInputForUsername username={username} setUsername={setUsername} />

                        <FormInputForEmail email={email} setEmail={setEmail} />

                        <FormInputForNewPassword password={password} setPassword={setPassword} repeatPassword={repeatPassword} setRepeatPassword={setRepeatPassword} />

                        <div className="btn-container">
                            <Button type="submit" size="medium" variant="contained">Submit</Button>
                        </div>
                    </form>
                </>
            }
        </>
    );
}

Register.propTypes = {
    showSignin: PropTypes.bool,
};
