import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminImportService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/admin/import';

    importLesson(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/lesson`, data);
    }
}
