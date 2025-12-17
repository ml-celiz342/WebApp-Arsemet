import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OauthService {
  private apiURLOaut = environment.apiUrl + 'oauth';

  constructor(private http: HttpClient) {}

  cerrarTodasSesiones(id:Number): Observable<number> {
      const baseUrl = `${this.apiURLOaut}/revoke_all/${id}`;
      return this.http
        .post<void>(baseUrl, null,{ observe: 'response' })
        .pipe(map((response) => response.status));
    }

}
