import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  username: string = "";

  constructor(private store: UserStoreService, private authService: AuthService) { }

  ngOnInit(): void {
    this.store.getUsername()
    .subscribe((username: string) => {
      let usernameFromToken = this.authService.getUsernameFromToken();
      this.username = username || usernameFromToken
    }); //to persist the username after refresh
  }

  logout() {
    this.authService.logout();
  }
}
