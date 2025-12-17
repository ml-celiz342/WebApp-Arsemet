import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Modulos } from '../models/modulos';

import { EMPTY, expand, map, Observable, reduce, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModulosService {
  private apiURLModulos = environment.apiUrl + 'modules';

  constructor(private http: HttpClient) {}

  getModulos(): Observable<Modulos[]> {
    const baseUrl = `${this.apiURLModulos}?status=2&limit=100`;
    return this.http.get<any>(baseUrl).pipe(
      expand((response, index) => {
        if (
          response?.pagination?.current_page !== undefined &&
          response?.pagination?.total_pages !== undefined &&
          response?.pagination?.limit !== undefined &&
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextPageUrl = `${baseUrl}&offset=${
            response.pagination.current_page * response.pagination.limit
          }`;
          return this.http.get<any>(nextPageUrl);
        }
        return EMPTY;
      }),
      reduce<Modulos[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            idModelo: item.id_module,
            nombre: item.name,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  createModulo(data: Modulos) {
    const baseUrl = `${this.apiURLModulos}`;
    const body = {
      name: data.nombre,
    };
    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  deleteModulo(id: number): Observable<number> {
    const baseUrl = `${this.apiURLModulos}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }
}
