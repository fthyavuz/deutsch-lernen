import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdminLessonDTO } from "../models/admin-lesson.model";

@Injectable({
    providedIn: 'root'
})
export class AdminLessonService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/admin/lessons';

    getAll(): Observable<AdminLessonDTO[]> {
        return this.http.get<AdminLessonDTO[]>(this.apiUrl);
    }

    create(lesson: AdminLessonDTO): Observable<AdminLessonDTO> {
        return this.http.post<AdminLessonDTO>(this.apiUrl, lesson);
    }

    update(id: number, dto: AdminLessonDTO): Observable<AdminLessonDTO> {
        return this.http.put<AdminLessonDTO>(`${this.apiUrl}/${id}`, dto);
    }
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
