import { Component } from '@angular/core';
import { Task } from 'src/app/models/task';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  tasks: Task[] = [];
  
  constructor(private authService: AuthService, private apiService: ApiService) { }

  ngOnInit(): void {
  }
  
}
