export interface CreateUserParams {
    firstName: string;
    lastName: string;
    profile: {
        gender: string;
        photo: string;
    }
}


export interface UpdateUserParams {
    firstName?: string;
    lastName?: string;
    profile?: {
        gender: string;
        photo: string;
    },
    addPhotos?: { url: string; }[]
}
