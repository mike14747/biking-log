'use client';

import { useState } from 'react';
import Button from '../Button';
import Loading from '../Loading';
import processStatusCodeWithSignout from '../../../lib/processStatusCodeWithSignout';

import styles from '../../../styles/profile.module.css';

const statusCodeErrorMessages = {
    400: 'An error occurred. A bad request was made.',
    401: 'An error occurred. You do not have permission to delete this account.',
    404: 'An error occurred. User was not found.',
    500: 'A server error occurred. Please try your update again.',
};

export default function DeleteAccount({ id }: { id: string }) {
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [deleteCounter, setDeleteCounter] = useState<number>(0);

    const handleDeleteAccount = async () => {
        if (deleteCounter === 0) {
            setDeleteCounter(1);
            return;
        }

        if (deleteCounter > 0) {
            setIsSubmitting(true);

            const res = await fetch('/api/users/' + id + '/delete-account', {
                method: 'DELETE',
            }).catch(error => console.error(error.name + ': ' + error.message));

            processStatusCodeWithSignout(res, statusCodeErrorMessages, setError, setIsSubmitting);
        }
    };

    return (
        <div className={styles.deleteContainer}>
            <div className={styles.deleteHeading}>
                <h3>Delete your account</h3>
            </div>

            {isSubmitting && <Loading />}

            {error && <p className={styles.error}>{error}</p>}

            {deleteCounter > 0 &&
                <p>
                    Are you sure?
                </p>
            }

            <Button type="button" size={deleteCounter > 0 ? 'medium' : 'small'} variant="contained" theme="danger" onClick={handleDeleteAccount}>Delete Account</Button>
        </div>
    );
}
