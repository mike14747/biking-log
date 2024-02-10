import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Biking Log - Reset Password Success',
};

export default function ResetPasswordSuccess() {
    return (
        <main id="main">
            <h1 className="page-heading">
                Password Reset
            </h1>

            <p className='reset-password-success'>You have successfully updated your password!</p>
        </main>
    );
}
