import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';
import { Task } from 'src/app/models/task';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() id!: number;
  status = Boolean(this.task?.isComplete);

  constructor(private apiService: ApiService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.status = Boolean(this.task?.isComplete);
    }
  }

  getStatus(): boolean {
    return Boolean(this.task?.isComplete);
  }
}
