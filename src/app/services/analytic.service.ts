import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  Analitica,
  AnaliticaObservacion,
  NewAnalitica,
} from '../models/analitica';
import { EMPTY, expand, map, Observable, reduce, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticService {
  private apiURLAanalytic = environment.apiUrl + 'analytics';

  constructor(private http: HttpClient) {}

  getAnalytic(): Observable<Analitica[]> {
    const baseUrl = `${this.apiURLAanalytic}?status=2&limit=100`;
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
      reduce<Analitica[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_analytics,
            nombre: item.name,
            comentario: item.comment,
            ruta: item.route,
            pausa: item.paused,
            fecha_alta: item.registration_date,
            fecha_baja: item.low_date,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  deleteAnalytic(id: number): Observable<number> {
    const baseUrl = `${this.apiURLAanalytic}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createAnalytic(data: NewAnalitica): Observable<number> {
    const baseUrl = `${this.apiURLAanalytic}`;
    const body = {
      ...(data.nombre !== undefined && { name: data.nombre }),
      ...(data.comentario !== undefined && { comment: data.comentario }),
      ...(data.ruta !== undefined && { route: data.ruta }),
      ...(data.pausa !== undefined && { paused: data.pausa }),
    };
    if (Object.keys(body).length != 3 && Object.keys(body).length != 4) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  updateAnalytic(data: NewAnalitica, id: number): Observable<number> {
    const baseUrl = `${this.apiURLAanalytic}/${id}`;
    const body = {
      ...(data.nombre !== undefined && { name: data.nombre }),
      ...(data.comentario !== undefined && { comment: data.comentario }),
      ...(data.ruta !== undefined && { route: data.ruta }),
      ...(data.pausa !== undefined && { paused: data.pausa }),
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

  getObservationsAnalytic(
    desde: string,
    hasta: string,
    id: string
  ): Observable<AnaliticaObservacion[]> {
    const baseUrl = `${
      this.apiURLAanalytic
    }/observations/${id}?from=${encodeURIComponent(
      desde
    )}&to=${encodeURIComponent(hasta)}&limit=100`;
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
      reduce<AnaliticaObservacion[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_observation,
            id_analitica: item.id_analytic,
            nombre_analitica: item.name,
            numero_serie: item.serie_number,
            desde: item.from_date,
            hasta: item.to_date,
            observacion: item.observation,
            fecha: item.registration_date,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  getConfigAnalytic(id: number): Observable<{ [key: string]: any }> {
    const baseUrl = `${this.apiURLAanalytic}/config/last/${id}`;
    return this.http.get<{ [key: string]: any }>(baseUrl).pipe(
      map((response) => {
        if (response && typeof response === 'object') {
          return response;
        }
        return {};
      })
    );
  }

  getAllConfigAnalytic(id: number): Observable<{ [key: string]: any }[]> {
    const baseUrl = `${this.apiURLAanalytic}/config/${id}?limit=100`;
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
      reduce<{ [key: string]: any }[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          acc.push(...response.data);
        }
        return acc;
      }, [])
    );
  }

  updateConfig(data: any, id: number): Observable<number> {
    const baseUrl = `${this.apiURLAanalytic}/config/${id}`;
    if (Object.keys(data).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, data, { observe: 'response' })
      .pipe(map((response) => response.status));
  }
}
 