import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SessionsUsers } from '../models/sessions-users';
import { SessionsInfo } from '../models/sessions-info';
import { SessionsDevices } from '../models/sessions-devices';


@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private apiURLUsers = environment.apiUrl + '/sessions/last';
  private apiURLAllUsers = environment.apiUrl + '/sessions';
  private apiURLDevices = environment.apiUrl + '/devices/sessions/last';
  private apiURLAllDevices = environment.apiUrl + '/devices/sessions/';

  constructor(private http: HttpClient) {}

  getSesionsUsers(): Observable<SessionsUsers[]> {
    return this.http
      .get<any>(this.apiURLUsers)
      .pipe(map((response) => response.data));
  }

  getSesionsDevices(): Observable<SessionsDevices[]> {
    return this.http
      .get<any>(this.apiURLDevices)
      .pipe(map((response) => response.data));
  }

  getSesionsInfoUsers(
    page: number,
    limit: number
  ): Observable<{ data: SessionsInfo[]; total: number }> {
    const url = `${this.apiURLAllUsers}?offset=${
      page * limit
    }&limit=${limit}&status=2`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        const ahora = Date.now();

        const dataProcesada: SessionsInfo[] = response.data.map(
          (session: any) => {
            const logOut = session.logout_date
              ? new Date(session.logout_date).getTime()
              : null;
            const timeout = session.timeout_date
              ? new Date(session.timeout_date).getTime()
              : null;

            return {
              name: session.name,
              login_date: session.login_date,
              logout_date: logOut ?? (ahora > (timeout ?? 0) ? timeout : null),
              origen: 'API',
            };
          }
        );

        return {
          data: dataProcesada,
          total: response.pagination.total_records,
        };
      })
    );
  }

  getSesionsInfoAssets(
    page: number,
    limit: number
  ): Observable<{ data: SessionsInfo[]; total: number }> {
    const url = `${this.apiURLAllDevices}?offset=${
      page * limit
    }&limit=${limit}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        const dataProcesada: SessionsInfo[] = response.data.map(
          (session: any) => {
            return {
              name: session.serie_number,
              login_date: session.login_date,
              logout_date:
                session.status === 'TIME OUT' ||
                session.status === 'DISCONNECTED'
                  ? session.update_date
                  : null,
              origen: session.service,
            };
          }
        );

        return {
          data: dataProcesada,
          total: response.pagination.total_records,
        };
      })
    );
  }

  getCountSesionsUsers(id: number): Observable<number> {
    const url = `${this.apiURLAllUsers}/${id}?limit=100`;
    return this.http.get<any>(url).pipe(
      map((response) => response.counter)
    );
  }

}

