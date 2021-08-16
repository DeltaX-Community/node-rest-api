/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/auth/me": {
    get: operations["GetUser"];
  };
  "/auth/login": {
    post: operations["Login"];
  };
  "/auth/change_password": {
    post: operations["ChangePassword"];
  };
  "/auth/refresh_token": {
    post: operations["PostRefreshToken"];
  };
  "/auth/logout": {
    get: operations["Logout"];
  };
  "/api/v1/users/groups/{id}": {
    get: operations["GetGroupDetail"];
    put: operations["UpdateGroup"];
    delete: operations["DeleteGroup"];
  };
  "/api/v1/users/groups": {
    get: operations["GetGroupList"];
    post: operations["CreateGroup"];
  };
  "/api/v1/users/permissions/{id}": {
    get: operations["GetPermissionDetail"];
    put: operations["UpdatePermission"];
    delete: operations["DeletePermission"];
  };
  "/api/v1/users/permissions": {
    get: operations["ListPermissions"];
    post: operations["CreatePermission"];
  };
  "/api/v1/users/photos/{id}": {
    get: operations["GetPhotoDetail"];
    put: operations["UpdatePhoto"];
  };
  "/api/v1/users/photos": {
    get: operations["GetList"];
    post: operations["CreateItem"];
  };
  "/api/v1/users/{id}": {
    get: operations["GetUser"];
    put: operations["UpdateUser"];
    delete: operations["DeleteUser"];
  };
  "/api/v1/users": {
    get: operations["ListUsers"];
    post: operations["CreateUser"];
  };
}

export interface components {
  schemas: {
    /** Model User */
    User: {
      isActive: boolean;
      createAt: string;
      updatedAt: string;
      passwordHash: string | null;
      email: string | null;
      fullName: string;
      username: string;
      id: number;
    };
    /** Model Photo */
    Photo: {
      isActive: boolean;
      createAt: string;
      updatedAt: string;
      userId: number;
      url: string;
      id: number;
    };
    /** Model Group */
    Group: {
      isActive: boolean;
      createAt: string;
      updatedAt: string;
      description: string;
      name: string;
      id: number;
    };
    IUserDetail: components["schemas"]["User"] & {
      permissions: string[];
      groups: components["schemas"]["Group"][];
      photos: components["schemas"]["Photo"][];
    };
    /** Model Permission */
    Permission: {
      isActive: boolean;
      createAt: string;
      updatedAt: string;
      description: string | null;
      name: string;
      id: number;
    };
    IGroupDetail: components["schemas"]["Group"] & {
      permissions: components["schemas"]["Permission"][];
    };
    UpdateGroupParams: {
      description?: string;
      isActive?: boolean;
      permissions?: {
        name: string;
      }[];
    };
    Paginate_Group_: {
      rows: components["schemas"]["Group"][];
      page: number;
      perPage: number;
      total: number;
    };
    IGroupList: components["schemas"]["Paginate_Group_"];
    CreateGroupParams: {
      name: string;
      description: string;
      permissions?: {
        name: string;
      }[];
    };
    IPermissionDetail: components["schemas"]["Permission"];
    UpdatePermissionParams: {
      description?: string;
      isActive?: boolean;
    };
    Paginate_Permission_: {
      rows: components["schemas"]["Permission"][];
      page: number;
      perPage: number;
      total: number;
    };
    IPermissionList: components["schemas"]["Paginate_Permission_"];
    CreatePermissionParams: {
      name: string;
      description?: string;
    };
    IPhotoDetail: components["schemas"]["Photo"] & {
      user: {
        username: string;
        id: number;
      };
    };
    UpdatePhotoParams: {
      url: string;
    };
    Paginate_Photo_: {
      rows: components["schemas"]["Photo"][];
      page: number;
      perPage: number;
      total: number;
    };
    IPhotoList: components["schemas"]["Paginate_Photo_"];
    CreatePhotoParams: {
      username: string;
      url: string;
    };
    UpdateUserParams: {
      fullName?: string;
      email?: string;
      password?: string;
      isActive?: boolean;
      groups?: {
        name: string;
      }[];
      photos?: {
        url: string;
      }[];
    };
    Paginate_User_: {
      rows: components["schemas"]["User"][];
      page: number;
      perPage: number;
      total: number;
    };
    IUserList: components["schemas"]["Paginate_User_"];
    CreateUserParams: {
      username: string;
      fullName: string;
      email?: string;
    };
  };
  responses: {};
  parameters: {};
  requestBodies: {};
  headers: {};
}

export interface operations {
  GetUser: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["IUserDetail"];
        };
      };
    };
  };
  Login: {
    parameters: {};
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": {
            refreshToken: string;
            accessToken: string;
          };
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          password: string;
          username: string;
        };
      };
    };
  };
  ChangePassword: {
    parameters: {};
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          newpassword: string;
          oldpassword: string;
        };
      };
    };
  };
  PostRefreshToken: {
    parameters: {};
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": {
            accessToken: string;
          };
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          refreshToken: string;
        };
      };
    };
  };
  Logout: {
    parameters: {
      query: {
        refreshToken?: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": string;
        };
      };
      /** Success Logout and Unauthorized */
      401: unknown;
    };
  };
  GetGroupDetail: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["IGroupDetail"];
        };
      };
    };
  };
  UpdateGroup: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["IGroupDetail"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateGroupParams"];
      };
    };
  };
  DeleteGroup: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["Group"];
        };
      };
    };
  };
  GetGroupList: {
    parameters: {
      query: {
        page?: number;
        perPage?: number;
        isActive?: boolean;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["IGroupList"];
        };
      };
    };
  };
  CreateGroup: {
    parameters: {};
    responses: {
      /** Created */
      201: {
        content: {
          "application/json": components["schemas"]["Group"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateGroupParams"];
      };
    };
  };
  GetPermissionDetail: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["IPermissionDetail"];
        };
      };
    };
  };
  UpdatePermission: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["Permission"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdatePermissionParams"];
      };
    };
  };
  DeletePermission: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["Permission"];
        };
      };
    };
  };
  ListPermissions: {
    parameters: {
      query: {
        page?: number;
        perPage?: number;
        username?: string;
        isActive?: boolean;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["IPermissionList"];
        };
      };
    };
  };
  CreatePermission: {
    parameters: {};
    responses: {
      /** Created */
      201: {
        content: {
          "application/json": components["schemas"]["Permission"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreatePermissionParams"];
      };
    };
  };
  GetPhotoDetail: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["IPhotoDetail"];
        };
      };
    };
  };
  UpdatePhoto: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["IPhotoDetail"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdatePhotoParams"];
      };
    };
  };
  GetList: {
    parameters: {
      query: {
        page?: number;
        perPage?: number;
        username?: string;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["IPhotoList"];
        };
      };
    };
  };
  CreateItem: {
    parameters: {};
    responses: {
      /** Created */
      201: {
        content: {
          "application/json": components["schemas"]["Photo"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreatePhotoParams"];
      };
    };
  };
  UpdateUser: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["IUserDetail"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateUserParams"];
      };
    };
  };
  DeleteUser: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
    };
  };
  ListUsers: {
    parameters: {
      query: {
        page?: number;
        perPage?: number;
        isActive?: boolean;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["IUserList"];
        };
      };
    };
  };
  CreateUser: {
    parameters: {};
    responses: {
      /** Created */
      201: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateUserParams"];
      };
    };
  };
}

export interface external {}
