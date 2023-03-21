declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MYSQL_HOST: string;
            MYSQL_PORT: number;
            MYSQL_DATABASE: string;
            MYSQL_USER: string;
            MYSQL_PASSWORD: string;
            NODE_ENV: 'development' | 'production';
            NEXTAUTH_URL: string;
            NEXTAUTH_SECRET: string;
            NO_REPLY_EMAIL: string;
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CLIENT_SECRET: string;
            GOOGLE_REFRESH_TOKEN: string;
            BASE_URL: string;
        }
    }
}

export {};
