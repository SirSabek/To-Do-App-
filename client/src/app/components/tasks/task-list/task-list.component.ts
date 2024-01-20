import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  tasks!: Task[];
  
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getTasks().subscribe((data: Task[]) => {
      this.tasks = data;
    });
  }
}
