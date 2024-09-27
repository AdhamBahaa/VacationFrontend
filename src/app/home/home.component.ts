import { Component, OnInit } from '@angular/core';
import { IUser } from './../models/user.model';
import { UserService } from '../services/user.service';
import { IRequest } from '../models/request.model';
import { RequestService } from '../services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public users: IUser[] = [];
  public requests: IRequest[] = [];
  user: IUser | null = null;
  public requestsToApprove: IRequest[] = [];

  constructor(
    private _userService: UserService,
    private _requestService: RequestService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.user = this._userService.getUser();
    this._requestService
      .getRequestsByUserId(this.user?.id)
      .subscribe(
        (data) => ((this.requests = data), console.log(this.requests))
      );
    this._requestService
      .getAllRequestsForManager(this.user?.id)  
      .subscribe(
        (data) => (
          (this.requestsToApprove = data), console.log(this.requestsToApprove)
        )
      );
  }
}
