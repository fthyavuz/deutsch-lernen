import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AiSentenceRequest {
  word: string;
  germanExplanation: string;
  userSentence: string;
}

export interface AiSentenceResponse {
  feedback: string;
}

@Injectable({ providedIn: 'root' })
export class AiSentenceService {
  private http = inject(HttpClient);

  getFeedback(request: AiSentenceRequest): Observable<AiSentenceResponse> {
    return this.http.post<AiSentenceResponse>(`${environment.apiUrl}/ai/sentence-feedback`, request);
  }
}
