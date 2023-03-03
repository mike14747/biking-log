'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import UpdateProfileButtons from './UpdateProfileButtons';
import ChangeUsername from './ChangeUsername';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';
import DeleteAccount from './DeleteAccount';
import { UserInfo, ViewButtonState } from '../../../types';

import styles from '../../../styles/profile.module.css';

export default function UpdateProfile({ user, setUser }: {user: UserInfo, setUser: Dispatch<SetStateAction<UserInfo>>}) {
    const [viewState, setViewState] = useState<ViewButtonState>({
        showChangeUsername: false,
        showChangePassword: false,
        showChangeEmail: false,
        showDeleteAccount: false,
    });

    return (
        <section>
            <UpdateProfileButtons viewState={viewState} setViewState={setViewState} />

            <div className={styles.updateContainer}>
                {viewState.showChangeUsername &&
                    <ChangeUsername
                        id={user.id}
                    />
                }

                {viewState.showChangePassword &&
                    <ChangePassword
                        id={user.id}
                    />
                }

                {viewState.showChangeEmail &&
                    <ChangeEmail
                        id={user.id}
                        setUser={setUser}
                    />
                }

                {viewState.showDeleteAccount &&
                    <DeleteAccount
                        id={user.id}
                    />
                }
            </div>
        </section>
    );
}
