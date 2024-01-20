import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "http://localhost:5066/api/Auth/"
  private userPayLoad: any;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayLoad = this.decodeToken();
   }

  register(data: any) {
    return this.http.post(this.baseUrl + "register", data);
  }

  login(data: any) {
    return this.http.post(this.baseUrl + "login", data);
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
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  getUsernameFromToken() {
    return this.userPayLoad.sub;
  }


}
