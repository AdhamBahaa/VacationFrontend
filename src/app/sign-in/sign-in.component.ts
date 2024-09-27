import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { IUser, IUserCredentials } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  credentials: IUser = {
    email: '',
    password: '',
    id: 0,
    name: '',
    casualDays: 0,
    annualDays: 0,
    managerId: null,
  };
  signInError: boolean = false;

  constructor(private userService: UserService, public router: Router) {}

  signIn() {
    this.signInError = false;
    this.userService.signIn(this.credentials).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => (
        (this.signInError = true), console.log('Sign in error: ', err)
      ),
    });
  }
}
