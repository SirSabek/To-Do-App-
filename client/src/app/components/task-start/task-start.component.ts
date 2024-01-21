import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-task-start',
  templateUrl: './task-start.component.html',
  styleUrls: ['./task-start.component.css']
})
export class TaskStartComponent {

  taskCount: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.tasks$.subscribe(tasks => this.taskCount = tasks.length);
  }
  
}
