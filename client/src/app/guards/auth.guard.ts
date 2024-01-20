import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgToastModule } from 'ng-angular-popup';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate{
  
  constructor(private authService: AuthService, private router: Router, private toast: NgToastService) {}
  
  canActivate() {
    if(this.authService.isLoggedIn()) {
      return true;
    } else {
      this.toast.error({ detail: "ERROR", summary: 'Please login first!'});
      this.router.navigate(['login']);
      return false;
    }
  }
};
