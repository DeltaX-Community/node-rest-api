export interface CreatePermissionParams {
    name: string;
    description?: string;
}

export interface UpdatePermissionParams {
    description?: string;
    isActive?: boolean;
}