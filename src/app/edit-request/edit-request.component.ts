import { Component, Input, OnInit } from '@angular/core';
import { IRequest } from '../models/request.model';
import { HttpClient } from '@angular/common/http';
import { RequestService } from '../services/request.service';
import { Router } from '@angular/router';
import { IUser, IUserBalance } from '../models/user.model';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrl: './edit-request.component.css',
})
export class EditRequestComponent implements OnInit {
  public users: IUser[] = [];
  public requests: IRequest[] = [];
  user: IUser | null = null;
  request: IRequest = {
    id: 0,
    typeId: 0,
    fromDate: undefined,
    toDate: undefined,
    userId: undefined,
    user: undefined,
    statusId: 0,
  };

  today: string;
  toDateMin: string | undefined;
  minDate: string;

  constructor(
    private _userService: UserService,
    private _requestService: RequestService,
    public router: Router
  ) {
    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0];
    this.toDateMin = this.today;
    this.minDate = this.today;
  }

  ngOnInit() {
    this.user = this._userService.getUser();
    this.request = history.state.data;
    console.log(this.request);
  }

  getLaterDate(date1: string, date2: string): string {
    return new Date(date1) > new Date(date2) ? date1 : date2;
  }

  onFromDateChange(event: any) {
    const fromDateString = event.target.value;
    const fromDate = new Date(fromDateString).toISOString().split('T')[0];
    this.toDateMin = this.getLaterDate(this.today, fromDate);
    this.minDate = this.toDateMin;
  }

  editRequest(request: IRequest) {
    if (!this.user) {
      return alert('User not found');
    }

    if (!this.request.typeId) {
      return alert('Please enter vacation type');
    }
    if (!this.request.fromDate) {
      return alert('Please enter From-date');
    }
    if (!this.request.toDate) {
      return alert('Please enter To-date');
    }

    const fromDate = new Date(this.request.fromDate);
    const toDate = new Date(this.request.toDate);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return alert(
        'Invalid dates provided. Please enter valid vacation dates.'
      );
    }
    if (toDate.getTime() < fromDate.getTime()) {
      return alert('Invalid date duration, Please re-enter vacation duration!');
    }

    const newDuration = Math.ceil(
      (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
    ); 

    this._requestService.getRequestById(request.id).subscribe({
      next: (existingRequest: IRequest) => {
        const previousFromDate = new Date(existingRequest.fromDate ?? '');
        const previousToDate = new Date(existingRequest.toDate ?? '');

        const previousDuration = Math.ceil(
          (previousToDate.getTime() - previousFromDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        this._userService.getUserBalance(this.user?.id).subscribe({
          next: (balance: IUserBalance) => {
            if (existingRequest.typeId === 1) {
              balance.casualDays += previousDuration;
            } else if (existingRequest.typeId === 2) {
              balance.annualDays += previousDuration;
            }

            if (this.request.typeId === 1) {
              if (balance.casualDays < newDuration) {
                return alert('Your casual days balance are insufficient!!');
              }
              balance.casualDays -= newDuration;
            } else if (this.request.typeId === 2) {
              if (balance.annualDays < newDuration) {
                return alert('Your annual days balance are insufficient!!');
              }
              balance.annualDays -= newDuration;
            }

            this._requestService
              .editRequest(request.id, this.request)
              .subscribe({
                next: () => {
                  console.log('Edit Request Successfully');
                  this._userService.getUsersById(this.user?.id).subscribe({
                    next: (updatedBalance: IUser) => {
                      if (this.user) {
                        this.user.casualDays = updatedBalance.casualDays;
                        this.user.annualDays = updatedBalance.annualDays;
                      }
                      this.router.navigate(['/home']);
                    },
                    error: (err) =>
                      console.log('Error fetching updated balance: ', err),
                  });
                },
                error: (error) =>
                  console.error('Error editing request:', error),
              });
          },
          error: (err) => console.log('Error fetching user balance: ', err),
        });
      },
      error: (err) => console.log('Error fetching existing request: ', err),
    });
  }

  deleteRequest() {
    this._requestService.deleteRequest(this.request.id).subscribe({
      next: (response) => {
        console.log('Request is deleted successfully:', response);
        this._userService.getUsersById(this.user?.id).subscribe({
          next: (updatedBalance: IUser) => {
            if (this.user) {
              this.user.casualDays = updatedBalance.casualDays;
              this.user.annualDays = updatedBalance.annualDays;
            }
            this.router.navigate(['/home']);
          },
          error: (err) => console.log('Error fetching updated balance: ', err),
        });
      },
      error: (error) => {
        console.error('Error deleting request:', error.message);
        console.error('Status:', error.status);
        console.error('Response:', error.error);
      },
    });
  }
}
