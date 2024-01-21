import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent {
  taskForm = this.fb.group({
    description: ['', Validators.required],
    isComplete: [false, Validators.required]
  });

  editMode = false;
  id!: number;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private apiService: ApiService, private toast : NgToastService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      console.log('Task ID:', this.id); // Add this line
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    let taskDescription = '';
    let taskCompleted = false;

    if (this.editMode) {
      this.apiService.getTask(this.id).subscribe(
        (data: any) => {
          console.log('Task data:', data); // Add this line
          taskDescription = data.description;
          taskCompleted = Boolean(data.isComplete);
          this.createForm(taskDescription, taskCompleted);
        });
    } else {
      this.createForm(taskDescription, taskCompleted);
    }

  }

  private createForm(description: string, isComplete: boolean) {
    this.taskForm = this.fb.group({
      description: [description, Validators.required],
      isComplete: [isComplete, Validators.required]
    });
  }


  onSubmit(): void {
    const taskFormValue = {
      ...this.taskForm.value,
      isComplete: Boolean(this.taskForm.value.isComplete) 
    };

    if (this.editMode) {
      this.apiService.updateTask(this.id, taskFormValue).subscribe(
        (data: any) => {
          console.log("data:", data);
          this.toast.success({ detail: "SUCCESS", summary: 'task is successfully updated', duration: 3000 });
        });
    } else {
      this.apiService.createTask(taskFormValue).subscribe(
        (data: any) => {
          console.log("data:", data);
          this.toast.success({ detail: "SUCCESS", summary: 'task is successfully Created', duration: 3000 });
        });
    }
    console.log("taskFormValue:", taskFormValue);
    this.apiService.getTasks().subscribe(
      (data: any) => {
        console.log("data:", data);
      });
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDelete() {
    this.apiService.deleteTask(this.id).subscribe(
      (data: any) => {
        console.log("data:", data);
        this.toast.success({ detail: "SUCCESS", summary: 'task is successfully deleted', duration: 3000 });
      });
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
