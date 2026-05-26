import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { DeptStats } from '../models/dept-stats.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  update(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDeptStats(): Observable<DeptStats[]> {
    return this.http.get<DeptStats[]>(`${this.apiUrl}/stats`);
  }

  applyRaise(department: string, percent: number): Observable<Employee[]> {
    return this.http.patch<Employee[]>(
      `${this.apiUrl}/raise?department=${encodeURIComponent(department)}&percent=${percent}`,
      null
    );
  }
}
