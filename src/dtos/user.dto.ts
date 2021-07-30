export interface CreateUserParams {
    userName: string;
    fullName: string;
    profile: {
        gender: string;
        photo: string;
    }
}


export interface UpdateUserParams {
    userName?: string;
    fullName?: string;
    profile?: {
        gender: string;
        photo: string;
    },
    addPhotos?: { url: string; }[]
}
