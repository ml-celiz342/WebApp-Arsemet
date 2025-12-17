import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NewOperariosServicios, NuevoOperario, OperarioEjecucion, Operarios, OperariosServicios } from '../models/operarios';
import { EMPTY, expand, map, Observable, reduce, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkersService {
  private apiURLOperario = environment.apiUrl + 'workers';

  constructor(private http: HttpClient) {}

  getOperarios(): Observable<Operarios[]> {
    const baseUrl = `${this.apiURLOperario}?status=2&limit=100`;
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
      reduce<Operarios[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_worker,
            identificador: item.identification,
            nombre: item.name,
            apellido: item.last_name,
            rfid: item.rfid,
            sector: item.sector,
            id_sector: item.id_sector,
            registration_date: item.registration_date,
            low_date: item.low_date,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  deleteOperario(id: number): Observable<number> {
    const baseUrl = `${this.apiURLOperario}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createOperario(data: NuevoOperario): Observable<number> {
    const baseUrl = `${this.apiURLOperario}`;
    const body = {
      ...(data.identificador !== undefined && {
        identification: data.identificador,
      }),
      ...(data.nombre !== undefined && { name: data.nombre }),
      ...(data.apellido !== undefined && { last_name: data.apellido }),
      ...(data.rfid !== undefined && { rfid: data.rfid }),
      ...(data.idSector !== undefined && { id_sector: data.idSector }),
    };
    if (Object.keys(body).length != 5) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  updateOperario(data: NuevoOperario, id: number): Observable<number> {
    const baseUrl = `${this.apiURLOperario}/${id}`;
    const body = {
      ...(data.identificador !== undefined && {
        identification: data.identificador,
      }),
      ...(data.nombre !== undefined && { name: data.nombre }),
      ...(data.apellido !== undefined && { last_name: data.apellido }),
      ...(data.rfid !== undefined && { rfid: data.rfid }),
      ...(data.idSector !== undefined && { id_sector: data.idSector }),
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

  getOperarioServicios(): Observable<OperariosServicios[]> {
    const baseUrl = `${this.apiURLOperario}/service?status=2&limit=100`;
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
      reduce<OperariosServicios[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_service_worker,
            contrasenea: item.password,
            usuario: item.user,
            url_data: item.urllogin,
            url_login: item.urldata,
            intervalo: item.interval,
            fecha_actualizacion: item.update_date,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  updateOperarioServicio(
    data: NewOperariosServicios,
    id: number
  ): Observable<number> {
    const baseUrl = `${this.apiURLOperario}/service/${id}`;
    const body = {
      ...(data.url_login !== undefined && {
        urllogin: data.url_login,
      }),
      ...(data.url_data !== undefined && { urldata: data.url_data }),
      ...(data.usuario !== undefined && { user: data.usuario }),
      ...(data.contrasenea !== undefined && { password: data.contrasenea }),
      ...(data.intervalo !== undefined && { interval: data.intervalo }),
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

  createOperarioServicio(data: NewOperariosServicios): Observable<number> {
    const baseUrl = `${this.apiURLOperario}/service`;
    const body = {
      ...(data.url_login !== undefined && {
        urllogin: data.url_login,
      }),
      ...(data.url_data !== undefined && { urldata: data.url_data }),
      ...(data.usuario !== undefined && { user: data.usuario }),
      ...(data.contrasenea !== undefined && { password: data.contrasenea }),
      ...(data.intervalo !== undefined && { interval: data.intervalo }),
    };
    if (Object.keys(body).length != 5) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  getOperariosEjecucion(
    desde: string,
    hasta: string
  ): Observable<OperarioEjecucion[]> {
    const baseUrl = `${this.apiURLOperario}/execution?from=${encodeURIComponent(
      desde
    )}&to=${encodeURIComponent(hasta)}`;
    return this.http.get<any>(baseUrl).pipe(
      expand((response, index) => {
        if (
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextPageUrl = `${baseUrl}&offset=${
            response.pagination.current_page * response.pagination.limit
          }`;
          return this.http.get<any>(nextPageUrl);
        }
        return EMPTY;
      }),
      reduce<OperarioEjecucion[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          typeof response.data === 'object' &&
          Array.isArray(response.data) &&
          response.data
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_execution_worker,
            temporal: item.date,
            ejecucion: item.ok_execution,
            cambios: item.quantity_changes,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  ejecutarOperarioServicio(): Observable<number> {
    const baseUrl = `${this.apiURLOperario}/service/play`;
    const body = {};

    return this.http
      .get<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

}
