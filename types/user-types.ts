export type UserSignin = {
    id: number;
    username: string;
    password: string;
    salt: string;
    role: string;
}

export type UserInfo = {
    id: string;
    username: string;
    email: string;
}
