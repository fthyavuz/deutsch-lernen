// src/app/shared/models/user.model.ts
export type UserRole = 'STUDENT' | 'ADMIN';

export interface UserDTO {
    id: number;
    email: string;
    role: UserRole;
    createdAt?: string; // ISO string from backend
}
