import { Component, OnInit } from '@angular/core';
import { IRequest } from '../models/request.model';
import { RequestService } from '../services/request.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { IUser } from '../models/user.model';

@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrl: './approve-request.component.css',
})
export class ApproveRequestComponent implements OnInit {
  request: IRequest = {
    id: 0,
    typeId: 0,
    fromDate: undefined,
    toDate: undefined,
    userId: undefined,
    user: undefined,
    statusId: 0,
  };

  constructor(
    private _requestService: RequestService,
    private _userService: UserService,
    public router: Router
  ) {}

  ngOnInit() {
    this.request = history.state.data;
    console.log(this.request);
  }

  approve() {
    this._requestService.approveRequest(this.request.id, 2).subscribe({
      next: (response) => {
        console.log('Request approved:', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error approving request:', error);
      },
    });
  }

  reject() {
    this._requestService.approveRequest(this.request.id, 3).subscribe({
      next: (response) => {
        console.log('Request rejected:', response);
        this._userService.getUsersById(this.request.userId).subscribe({
          next: (updatedBalance: IUser) => {
            if (this.request.user) {
              this.request.user.casualDays = updatedBalance.casualDays;
              this.request.user.annualDays = updatedBalance.annualDays;
            }
            this.router.navigate(['/home']);
          },
          error: (err) => console.log('Error fetching updated balance: ', err),
        });
      },
      error: (error) => {
        console.error('Error rejecting request:', error);
      },
    });
  }
}
