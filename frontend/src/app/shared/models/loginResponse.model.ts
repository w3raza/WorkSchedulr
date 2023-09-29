import { UserRole } from "../enums/user-role.enum";

export interface LoginResponse{
    id: string;
    username: string;
    email: string;
    userRoles: UserRole[];
    token: string;
}