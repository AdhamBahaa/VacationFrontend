import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRequest } from '../models/request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private _url: string = 'https://localhost:7231/api/Request';

  constructor(private http: HttpClient) {}

  getRequests(): Observable<IRequest[]> {
    return this.http.get<IRequest[]>(this._url);
  }

  getRequestById(id: number | undefined): Observable<IRequest> {
    return this.http.get<IRequest>(`${this._url}/request-id/${id}`);
  }

  getRequestsByUserId(id: number | undefined): Observable<IRequest[]> {
    return this.http.get<IRequest[]>(`${this._url}/${id}`);
  }

  getAllRequestsForManager(id: number | undefined): Observable<IRequest[]> {
    return this.http.get<IRequest[]>(`${this._url}/RequestsForManager/${id}`);
  }

  createRequest(data: IRequest): Observable<IRequest[]> {
    return this.http.post<IRequest[]>(this._url, data);
  }

  editRequest(
    requestId: number | undefined,
    data: IRequest
  ): Observable<IRequest[]> {
    return this.http.post<IRequest[]>(
      `${this._url}/edit-request/${requestId}`,
      data
    );
  }

  approveRequest(
    requestId: number,
    statusUpdate: number
  ): Observable<IRequest[]> {
    return this.http.post<IRequest[]>(
      `${this._url}/Approve/${requestId}/${statusUpdate}`,
      { requestId, statusUpdate }
    );
  }

  deleteRequest(requestId: number): Observable<void> {
    return this.http.delete<void>(`${this._url}/${requestId}`);
  }
}
