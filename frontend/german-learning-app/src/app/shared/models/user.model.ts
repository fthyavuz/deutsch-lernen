export interface UserDTO {
    id: number;
    email: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
}
