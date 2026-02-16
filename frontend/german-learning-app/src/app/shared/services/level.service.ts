import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LevelDTO } from '../models/level.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LevelService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/levels`;
    private adminApiUrl = `${environment.apiUrl}/admin/levels`;

    getAllLevels(): Observable<LevelDTO[]> {
        return this.http.get<LevelDTO[]>(this.apiUrl);
    }

    getLevelById(id: number): Observable<LevelDTO> {
        return this.http.get<LevelDTO>(`${this.apiUrl}/${id}`);
    }

    // Admin Methods
    createLevel(level: Partial<LevelDTO>): Observable<LevelDTO> {
        return this.http.post<LevelDTO>(this.adminApiUrl, level);
    }

    updateLevel(id: number, level: Partial<LevelDTO>): Observable<LevelDTO> {
        return this.http.put<LevelDTO>(`${this.adminApiUrl}/${id}`, level);
    }

    deleteLevel(id: number): Observable<void> {
        return this.http.delete<void>(`${this.adminApiUrl}/${id}`);
    }
}
