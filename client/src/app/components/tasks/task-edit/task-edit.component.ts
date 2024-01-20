import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent {
  taskForm!: FormGroup;
  editMode = false;
  id!: number;

  constructor(private route: ActivatedRoute, private router:Router, private fb:FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      console.log("editMode:", this.editMode);
      console.log("id:", this.id);
    });

    this.initForm();
  }

  private initForm() { 
    let taskDescription = '';
    let taskCompleted = false;
    
    if (this.editMode) {
      this.apiService.getTask(this.id).subscribe(
        (data: any) => {
          taskDescription = data.description;
          taskCompleted = Boolean(data.isCompleted);
          console.log("status:", taskCompleted);
          
      });
    }

    this.taskForm = this.fb.group({
      description: [taskDescription, Validators.required],
      isCompleted: [taskCompleted, Validators.required]
    });
  }
  

  onSubmit(): void {
    if (this.editMode) {
      this.apiService.updateTask(this.id, this.taskForm.value).subscribe(
        (data: any) => {
          console.log("data:", data);
        });
    } else {
      this.apiService.createTask(this.taskForm.value).subscribe(
        (data: any) => {
          console.log("data:", data);
        });
    }
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
