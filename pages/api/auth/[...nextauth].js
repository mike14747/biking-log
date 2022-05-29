import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserForSignin } from '../../../lib/api';
import crypto from 'crypto';

export default NextAuth({
    providers: [
        Credentials({
            name: 'username/password',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const user = await getUserForSignin(credentials.username)?.[0];

                if (user) {
                    const matches = await crypto.crypto.timingSafeEqual(credentials.password, user.password);
                    if (matches) return { id: user.id, name: user.username, role: user.role };
                    return null;
                } else {
                    return null;
                }
            },
        }),
    ],
    session: {
        jwt: true,
        // how many seconds until an idle session expires and is no longer valid
        maxAge: 30 * 24 * 60 * 60, // 30 * 24 * 60 * 60 is 30 days
        secret: process.env.JWT_SECRET,
    },
    jwt: {
        signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user?.id) token.id = user.id;
            if (user?.role) token.role = user.role;
            return token;
        },
        async session({ session, token }) {
            if (token?.id) session.user.id = token.id;
            if (token?.role) session.user.role = token.role;
            return session;
        },
    },
});
