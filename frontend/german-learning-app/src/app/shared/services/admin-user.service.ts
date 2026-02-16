import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserDTO } from "../models/user.model";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AdminUserService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/admin/users`;

    getAllUsers(): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(this.apiUrl);
    }

    updateRole(id: number, role: 'USER' | 'ADMIN'): Observable<UserDTO> {
        return this.http.put<UserDTO>(`${this.apiUrl}/${id}/role?role=${role}`, {});
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
