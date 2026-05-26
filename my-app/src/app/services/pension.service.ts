import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RetiredTeacher, PensionStatus } from '../models/retired-teacher.model';
import { PensionStats } from '../models/pension-stats.model';

@Injectable({ providedIn: 'root' })
export class PensionService {
  private apiUrl = 'http://localhost:8080/api/pension';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RetiredTeacher[]> {
    return this.http.get<RetiredTeacher[]>(this.apiUrl);
  }

  getStats(): Observable<PensionStats> {
    return this.http.get<PensionStats>(`${this.apiUrl}/stats`);
  }

  applyCola(percent: number): Observable<RetiredTeacher[]> {
    return this.http.patch<RetiredTeacher[]>(`${this.apiUrl}/cola?percent=${percent}`, null);
  }

  updateStatus(id: number, status: PensionStatus): Observable<RetiredTeacher> {
    return this.http.patch<RetiredTeacher>(`${this.apiUrl}/${id}/status?status=${status}`, null);
  }
}
