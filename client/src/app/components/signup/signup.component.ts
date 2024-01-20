import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidateForm } from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  hidePassword = true;
  eyeIcon = "fa-eye-slash";
  signUpForm!: FormGroup;

  constructor(private fb:FormBuilder, private authService: AuthService, private router : Router) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      username: ['',Validators.required],
      password: ['',[Validators.required, Validators.minLength(8)]],
    });
    
  }
  
  onSubmit() {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.signUpForm.reset();
            this.router.navigate(['/login']);
          },
          error: (err: Error) => {
            console.log(err);
          }
        });
    } else {
      ValidateForm.validateAllFormFields(this.signUpForm);
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
    this.eyeIcon = this.hidePassword ? "fa-eye-slash" : "fa-eye";
  }
}
