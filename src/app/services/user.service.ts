import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IUser, IUserBalance, IUserCredentials } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _url: string = 'https://localhost:7231/api/User';
  private user: BehaviorSubject<IUser | null>;

  constructor(private http: HttpClient) {
    this.user = new BehaviorSubject<IUser | null>(null);
  }

  signIn(credentials: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this._url}/signin`, credentials).pipe(
      map((user: IUser) => {
        this.user.next(user);
        return user;
      })
    );
  }

  getUser(): IUser | null {
    return this.user.value;
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this._url);
  }

  getUsersById(id: number | undefined): Observable<IUser> {
    return this.http.get<IUser>(`${this._url}/${id}`);
  }

  getAllUsersByManagerId(id: number | undefined): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this._url}/Manager/${id}`);
  }

  getUserBalance(id: number | undefined): Observable<IUserBalance> {
    return this.http.get<IUserBalance>(`${this._url}/Balance/${id}`);
  }
}
