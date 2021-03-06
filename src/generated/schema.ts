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
    get: operations["GetGroup"];
    put: operations["UpdateGroup"];
    delete: operations["DeleteGroup"];
  };
  "/api/v1/users/groups": {
    get: operations["ListGroup"];
    post: operations["CreateGroup"];
  };
  "/api/v1/users/permissions/{id}": {
    get: operations["GetPermission"];
    put: operations["UpdatePermission"];
    delete: operations["DeletePermission"];
  };
  "/api/v1/users/permissions": {
    get: operations["ListPermissions"];
    post: operations["CreatePermission"];
  };
  "/api/v1/users/photos/{id}": {
    get: operations["GetItem"];
    put: operations["UpdateItem"];
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
    User: {
      id: number;
      username: string;
      fullName: string;
      email: string;
      passwordHash: string;
      groups: components["schemas"]["Group"][];
      photos: components["schemas"]["Photo"][];
      updatedAt: string;
      createAt: string;
      isActive: boolean;
    };
    Group: {
      id: number;
      name: string;
      description: string;
      users: components["schemas"]["User"][];
      permissions: components["schemas"]["Permission"][];
      updatedAt: string;
      createAt: string;
      isActive: boolean;
    };
    Permission: {
      id: number;
      name: string;
      description: string;
      groups: components["schemas"]["Group"][];
      updatedAt: string;
      createAt: string;
      isActive: boolean;
    };
    Photo: {
      id: number;
      user: components["schemas"]["User"];
      url: string;
      createAt: string;
      isActive: boolean;
    };
    UpdateGroupParams: {
      description?: string;
      isActive?: boolean;
      permissions?: {
        name: string;
      }[];
      users?: {
        username: string;
      }[];
    };
    Paginate_Group_: {
      rows: components["schemas"]["Group"][];
      page: number;
      perPage: number;
      total: number;
    };
    CreateGroupParams: {
      name: string;
      description: string;
      permissions?: {
        name: string;
      }[];
    };
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
    CreatePermissionParams: {
      name: string;
      description?: string;
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
          "application/json": components["schemas"]["User"];
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
  GetGroup: {
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
          "application/json": components["schemas"]["Group"];
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
          "application/json": {
            affected: number;
          };
        };
      };
    };
  };
  ListGroup: {
    parameters: {
      query: {
        page?: number;
        perPage?: number;
        includeUsers?: boolean;
        includePermissions?: boolean;
        isActive?: boolean;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["Paginate_Group_"];
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
  GetPermission: {
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
          "application/json": {
            affected: number;
          };
        };
      };
    };
  };
  ListPermissions: {
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
          "application/json": components["schemas"]["Paginate_Permission_"];
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
  GetItem: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": components["schemas"]["Photo"];
        };
      };
    };
  };
  UpdateItem: {
    parameters: {
      path: {
        id: number;
      };
    };
    responses: {
      /** Ok */
      200: {
        content: {
          "application/json": Partial<components["schemas"]["Photo"]> &
            Partial<{ [key: string]: unknown }>;
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
          "application/json": components["schemas"]["Paginate_Photo_"];
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
          "application/json": components["schemas"]["User"];
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
          "application/json": {
            affected: number;
          };
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
          "application/json": components["schemas"]["Paginate_User_"];
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
