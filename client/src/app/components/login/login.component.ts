import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ValidateForm } from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hidePassword = true;
  eyeIcon = "fa-eye-slash";
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toast: NgToastService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe({
          next: (res: any) => { 
            console.log(res.message);
            this.authService.storeToken(res.token);
            this.toast.success({ detail: "SUCCESS", summary: 'Your Success Message', duration: 5000 });
            this.router.navigate(['dashboard']);
          },
          error: (err: Error) => {
            this.toast.error({ detail: "ERROR", summary: 'Something is wrong!', duration: 5000 });
            console.log(err);
          }
        });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
    this.eyeIcon = this.hidePassword ? "fa-eye-slash" : "fa-eye";
  }

}
