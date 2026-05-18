import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StoryScenarioRequest, StoryScenarioResponse } from '../models/story-scenario.model';

@Injectable({ providedIn: 'root' })
export class StoryScenarioService {
  private http = inject(HttpClient);

  generateScenarios(request: StoryScenarioRequest): Observable<StoryScenarioResponse> {
    return this.http.post<StoryScenarioResponse>(`${environment.apiUrl}/ai/story-scenarios`, request);
  }
}
