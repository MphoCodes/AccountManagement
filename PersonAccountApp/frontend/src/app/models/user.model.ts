export interface User {
    userId: number;
    username: string;
    token?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
} 