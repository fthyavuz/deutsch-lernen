import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AdminImportService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/admin/import`;

    importLesson(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/lesson`, data);
    }
}
