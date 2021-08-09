export interface CreateUserParams {
    username: string;
    fullName: string;
    email?: string;
}

export interface UpdateUserParams {
    fullName?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
    groups?: { name: string; }[];
    photos?: { url: string; }[];
}
