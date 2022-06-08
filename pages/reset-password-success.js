import Head from 'next/head';

export default function ResetPasswordSuccess() {
    return (
        <>
            <Head>
                <title>
                    Reset Password Success
                </title>
            </Head>

            <p className='success-large'>You have successfully updated your password!</p>
        </>
    );
}
