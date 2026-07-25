import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TaskDto {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  createdAt: string;
  categoryId?: number;
  categoryName?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
  categoryId?: number;
}

export interface UpdateTaskDto {
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  categoryId?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getPaged(
    pageNumber: number,
    pageSize: number,
    search?: string,
    categoryId?: number
  ): Observable<PagedResult<TaskDto>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (search) params = params.set('search', search);
    if (categoryId) params = params.set('categoryId', categoryId);

    return this.http.get<PagedResult<TaskDto>>(this.apiUrl, { params });
  }

  create(dto: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateTaskDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}