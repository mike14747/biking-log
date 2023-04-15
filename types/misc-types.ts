export type User = {
    id: string;
    name: string;
    role: 'user' | 'admin';
}

// I don't think this is used anyway... it might be here to document the token structure in next-auth
export type Token = {
    name: string;
    id: string;
    role: 'user' | 'admin';
    iat: number;
    exp: number;
    jti: string;
}

export type ViewButtonState = {
    showChangeUsername: boolean;
    showChangePassword: boolean;
    showChangeEmail: boolean;
}

export type StatusCodeObj = {
    [key: number]: string;
}

export type IdParams = {
    params: {
        id: string;
    }
}
