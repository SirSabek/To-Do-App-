import { Task } from './../models/task';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "http://localhost:5066/api/Task/";
  taskChanged = new Subject<Task[]>();
  private tasks: Task[] = [];

  constructor(private http: HttpClient) { }

  getTasks() {
    return this.http.get<Task[]>(this.baseUrl);
  }

  getTask(id: number) {
    return this.http.get<Task>(this.baseUrl + id);
  }

  createTask(data: any) {
    return this.http.post<Task>(this.baseUrl + "create", data);
  }

  updateTask<Task>(id: number, data: any) {
    return this.http.put(this.baseUrl + id, data);
  }

  deleteTask(id: number) {
    return this.http.delete(this.baseUrl + id);
  }
}
