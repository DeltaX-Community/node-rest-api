export interface CreateUserParams {
    username: string;
    fullName: string;
    email?: string;
}

export interface UpdateUserParams {
    fullName?: string;
    email?: string;
    password?: string;
    groups?: { name: string; }[];
    photos?: { url: string; }[];
}
