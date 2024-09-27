import { Component } from '@angular/core';
import { IUser } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  user: IUser | null = null;

  constructor(private _userService: UserService, public router: Router) {}

  ngOnInit(): void {
    this.user = this._userService.getUser();
  }
}
