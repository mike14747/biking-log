import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserForSignin } from '../../../lib/api';

export default NextAuth({
    providers: [
        Credentials({
            name: 'username/password',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const user = await getUserForSignin(credentials.username, credentials.password);
                return user?.length === 1 ? { id: user[0].id, name: user[0].username, role: user[0].role } : null;
            },
        }),
    ],
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // 30 * 24 * 60 * 60 is 30 days
    },
    jwt: {
        signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    },
    secret: process.env.JWT_SECRET,
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
