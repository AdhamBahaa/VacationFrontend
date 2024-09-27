import { Component } from '@angular/core';
import { IRequest } from '../models/request.model';
import { HttpClient } from '@angular/common/http';
import { IUser, IUserBalance } from '../models/user.model';
import { UserService } from '../services/user.service';
import { RequestService } from '../services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrl: './add-request.component.css',
})
export class AddRequestComponent {
  user: IUser | null = null;
  userBalance: IUserBalance | undefined;
  public requests: IRequest[] = [];
  request: IRequest = {
    id: 0,
    typeId: 0,
    fromDate: undefined,
    toDate: undefined,
    userId: 0,
    user: undefined,
    statusId: 1,
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

  ngOnInit(): void {
    this.user = this._userService.getUser();
    console.log(this.user);
    this.request.userId = this.user?.id;
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

  onSubmit(data: IRequest) {
    this._userService.getUserBalance(this.user?.id).subscribe({
      next: (balance: IUserBalance) => {
        const { casualDays, annualDays } = balance;

        if (this.request.typeId == 0) {
          return alert('Please enter vacation type');
        }
        if (this.request.fromDate == undefined) {
          return alert('Please enter From-date');
        }
        if (this.request.toDate == undefined) {
          return alert('Please enter To-date');
        }

        const fromDate1 = new Date(this.request.fromDate);
        const toDate1 = new Date(this.request.toDate);

        if (isNaN(fromDate1.getTime()) || isNaN(toDate1.getTime())) {
          return alert(
            'Invalid dates provided. Please enter valid vacation dates.'
          );
        }
        if (toDate1.getTime() < fromDate1.getTime()) {
          return alert(
            'Invalid date duration, Try entering "From Date" first!'
          );
        }

        let fromDate = this.request.fromDate
          ? new Date(this.request.fromDate).getTime()
          : undefined;
        let toDate = this.request.toDate
          ? new Date(this.request.toDate).getTime()
          : undefined;

        let diffDate = 0;
        if (fromDate && toDate) {
          let diffMilliseconds = toDate - fromDate;
          diffDate = Math.ceil(diffMilliseconds / (1000 * 60 * 60 * 24));
        } else {
          diffDate = 0;
        }

        if (this.request.typeId == 1 && this.user?.casualDays != undefined) {
          if (this.user.casualDays < diffDate) {
            return alert('Your casual days balance are insufficient!!');
          }
          this.user.casualDays -= diffDate;
        }
        if (this.request.typeId == 2 && this.user?.annualDays != undefined) {
          if (this.user.annualDays < diffDate) {
            return alert('Your annual days balance are insufficient!!');
          }
          this.user.annualDays -= diffDate;
        }
        this._requestService.createRequest(this.request).subscribe({
          next: () => {
            console.log('Created New Request');
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
          error: (err) => console.log('Request creation error: ', err),
        });
      },
      error: (err) => console.log('Error fetching user balance: ', err),
    });
  }
}
