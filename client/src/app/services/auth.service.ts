import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";
import { Observable, catchError, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "http://localhost:5066/api/Auth/"
  private userPayLoad: any;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayLoad = this.decodeToken();
   }

   register(data: any): Observable<any> {
    return this.http.post(this.baseUrl + "register", data)
      .pipe(
        catchError((error) => {
          console.error('Error during registration:', error);
          throw error; 
        })
      );
  }

  login(data: any) {
    return this.http.post(this.baseUrl + 'login', data).pipe(
      tap((res) => {
        console.log('Login successful:', res);
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        throw error; 
      })
    );
  }

  storeToken(tokenValue: string) {
    localStorage.setItem("token", tokenValue);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  isLoggedIn() {
    return !!localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }

  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  getUsernameFromToken() {
    return this.userPayLoad.sub;
  }


}
