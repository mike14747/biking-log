import { getServerSession } from 'next-auth';
import RegisterForm from '@/components/Register/RegisterForm';

export default async function Register() {
    const session = await getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    return (
        <main id="main">
            <article>
                <h2 className="page-heading">
                    Register
                </h2>

                {session &&
                    <p className="error">
                        You cannot register as a new user while you are currently logged in.
                    </p>
                }

                {!session &&
                    <RegisterForm />
                }
            </article>
        </main>
    );
}
