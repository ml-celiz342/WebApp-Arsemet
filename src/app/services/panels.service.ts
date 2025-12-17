import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Panels } from '../models/panels';
import { EMPTY, expand, map, Observable, reduce, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelsService {
  private apiURLPanels = environment.apiUrl + 'panels';

    constructor(private http: HttpClient) {}

    getPaneles(): Observable<Panels[]> {
      const baseUrl = `${this.apiURLPanels}?limit=100`;
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
        reduce<Panels[], any>((acc, response) => {
          if (
            response &&
            typeof response === 'object' &&
            'data' in response &&
            Array.isArray(response.data)
          ) {
            const mappedData = response.data.map((item) => ({
              idPanel: item.id_panel,
              nombre: item.name,
            }));
            acc.push(...mappedData);
          }
          return acc;
        }, [])
      );
    }

    createPaneles(data: Panels) {
      const baseUrl = `${this.apiURLPanels}`;
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

    deletePaneles(id: number): Observable<number> {
      const baseUrl = `${this.apiURLPanels}/${id}`;
      return this.http
        .delete<void>(baseUrl, { observe: 'response' })
        .pipe(map((response) => response.status));
    }
}
