import { Task } from './../models/task';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "http://localhost:5066/api/Task/";
  taskChanged = new Subject<Task[]>();
  tasks$ = this.taskChanged.asObservable();

  constructor(private http: HttpClient) { }

  getTasks() {
    return this.http.get<Task[]>(this.baseUrl);
  }

  getTask(id: number) {
    return this.http.get<Task>(this.baseUrl + id);
  }

  createTask(data: any) {
    return this.http.post<Task>(this.baseUrl + "create", data).pipe(
      catchError((error: any) => {
        console.error('Error Creating task:', error);
        return throwError(() => error);
      }),
      map(() => this.getTasks().subscribe(data => this.taskChanged.next(data)))
    );
  }

  updateTask<Task>(id: number, data: any) {
    return this.http.put(this.baseUrl + id, data).pipe(
      catchError((error: any) => {
        console.error('Error updating task:', error);
        return throwError(() => error);
      }),
      map(() => this.getTasks().subscribe(data => this.taskChanged.next(data)))
    );
  }

  deleteTask(id: number) {
    return this.http.delete(this.baseUrl + id).pipe(
      catchError((error: any) => {
        console.error('Error deleting task:', error);
        return throwError(() => error);
      }),
      map(() => this.getTasks().subscribe(data => this.taskChanged.next(data)))
    );
  }

  refreshTasks() {
    this.getTasks().subscribe(tasks => this.taskChanged.next(tasks));
  }
}
