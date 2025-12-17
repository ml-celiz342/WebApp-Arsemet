import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EMPTY, expand, map, Observable, reduce, throwError } from 'rxjs';
import { NuevoSector, Sector } from '../models/sector';

@Injectable({
  providedIn: 'root'
})
export class SectorsService {

  private apiURLSector = environment.apiUrl + 'sectors';

    constructor(private http: HttpClient) {}

    getSector(): Observable<Sector[]> {
      const baseUrl = `${this.apiURLSector}?status=2&limit=100`;
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
        reduce<Sector[], any>((acc, response) => {
          if (
            response &&
            typeof response === 'object' &&
            'data' in response &&
            Array.isArray(response.data)
          ) {
            const mappedData = response.data.map((item) => ({
              id: item.id_sector,
              nombre: item.name,
            }));
            acc.push(...mappedData);
          }
          return acc;
        }, [])
      );
    }

    deleteSector(id: number): Observable<number> {
      const baseUrl = `${this.apiURLSector}/${id}`;
      return this.http
        .delete<void>(baseUrl, { observe: 'response' })
        .pipe(map((response) => response.status));
    }

    createSector(data: NuevoSector): Observable<number> {
      const baseUrl = `${this.apiURLSector}`;
      const body = {
        ...(data.nombre !== undefined && { name: data.nombre }),
      };
      if (Object.keys(body).length != 1) {
        return throwError(
          () => new Error('El cuerpo de la solicitud está vacío')
        );
      }
      return this.http
        .post<void>(baseUrl, body, { observe: 'response' })
        .pipe(map((response) => response.status));
    }

    updateSector(data: NuevoSector, id: number): Observable<number> {
      const baseUrl = `${this.apiURLSector}/${id}`;
      const body = {
        ...(data.nombre !== undefined && { name: data.nombre }),
      };
      if (Object.keys(body).length === 0) {
        return throwError(
          () => new Error('El cuerpo de la solicitud está vacío')
        );
      }
      return this.http
        .put<void>(baseUrl, body, { observe: 'response' })
        .pipe(map((response) => response.status));
    }
}
