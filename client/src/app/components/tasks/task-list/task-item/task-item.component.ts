import { Component, Input } from '@angular/core';
import { Task } from 'src/app/models/task';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() id!: number;
  status = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.status = Boolean(this.task.isCompleted);
  }
}
