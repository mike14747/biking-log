declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_HOST: string;
            DATABASE_USERNAME: string;
            DATABASE_PASSWORD: string;
            NODE_ENV: 'development' | 'production';
            NEXTAUTH_URL: string;
            NEXTAUTH_SECRET: string;
            NO_REPLY_EMAIL: string;
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CLIENT_SECRET: string;
            GOOGLE_REFRESH_TOKEN: string;
            BASE_URL: string;
            NEXT_TELEMETRY_DISABLED: number;
        }
    }
}

export {};
