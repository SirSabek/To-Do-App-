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
    if (this.checkFormValidation()) {
      console.log('Form is valid. Submitting...');

      this.authService.register(this.signUpForm.value)
        .subscribe({
          next: (res) => {
            console.log('Registration successful:', res);
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Registration failed:', err);
          }
        });
    } else {
      console.log('Form is invalid. Check for validation errors.');
      //log the form validation errors
      console.log("errors", this.signUpForm);
      ValidateForm.validateAllFormFields(this.signUpForm);
    }
  }
  

  checkFormValidation() {
    if (!this.signUpForm.errors) {
      return true;
    }
    return false;
  }
  

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
    this.eyeIcon = this.hidePassword ? "fa-eye-slash" : "fa-eye";
  }
}
