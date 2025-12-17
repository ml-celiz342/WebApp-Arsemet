import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import {
  catchError,
  EMPTY,
  expand,
  map,
  Observable,
  reduce,
  tap,
  throwError,
} from 'rxjs';
import {
  Devices,
  ModeloDispositivo,
  NewDevice,
  NewModeloDispositivo,
} from '../models/devices';
import { DispositivosAnaliticas } from '../models/dispositivos-analiticas';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private apiURLDevices = environment.apiUrl + 'devices';
  private apiURLModelsDevices = environment.apiUrl + 'models/device';
  private apiURLDeviceAssociate = environment.apiUrl + 'devices/associate/';

  constructor(private http: HttpClient) {}

  getDevices(): Observable<Devices[]> {
    const baseUrl = `${this.apiURLDevices}?status=2&limit=100`;
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
      reduce<Devices[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_device,
            numero_serie: item.serie_number,
            registration_date: item.registration_date,
            low_date: item.low_date,
            type_model: item.devicemodel.name,
            id_model: item.devicemodel.id_model,
            code_service: item.code_service,
            id_code_service: item.id_code_service,
            manifiesto_arq: item.manifesto_arq,
            manifiesto_conf: item.manifesto_conf,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  getModelsDevices(): Observable<ModeloDispositivo[]> {
    const baseUrl = `${this.apiURLModelsDevices}?limit=100`;
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
      reduce<ModeloDispositivo[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_model,
            nombre: item.name,
            template: item.template,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  getDeviceAssociate(): Observable<DispositivosAnaliticas[]> {
    const baseUrl = `${this.apiURLDeviceAssociate}?status=2&limit=100`;
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
      reduce<DispositivosAnaliticas[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_analytic_device,
            id_dispositivo: item.id_device,
            numero_serie: item.serie_number,
            id_analitica: item.id_analytic,
            nombre_analitca: item.name,
            registration: item.registration_date,
            low_date: item.low_date,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  deleteDevice(id: number): Observable<number> {
    const baseUrl = `${this.apiURLDevices}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createDevice(data: NewDevice): Observable<number> {
    const baseUrl = `${this.apiURLDevices}`;
    const body = {
      ...(data.numero_serie !== undefined &&
        data.numero_serie != '' && {
          serie_number: data.numero_serie,
        }),
      ...(data.id_model !== undefined &&
        data.id_model > 0 && { id_device_model: data.id_model }),
      ...(data.id_code_service !== undefined &&
        data.id_code_service > 0 && { id_code_service: data.id_code_service }),
      ...(data.manifiesto_arq !== undefined &&
        data.manifiesto_arq !== null &&
        Object.keys(data.manifiesto_arq || {}).length > 0 && {
          manifesto_arq: data.manifiesto_arq,
        }),
    };

    if (Object.keys(body).length != 4) {
      console.log(Object.keys(body).length);
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  updateDevice(data: NewDevice, id: number): Observable<number> {
    const baseUrl = `${this.apiURLDevices}/${id}`;
    const body = {
      ...(data.id_model !== undefined &&
        data.id_model > 0 && { id_device_model: data.id_model }),
      ...(data.id_code_service !== undefined &&
        data.id_code_service > 0 && { id_code_service: data.id_code_service }),
      ...(data.manifiesto_arq !== undefined &&
        data.manifiesto_arq !== null &&
        Object.keys(data.manifiesto_arq).length > 0 && {
          manifesto_arq: data.manifiesto_arq,
        }),
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

  deleteModelDevice(id: number): Observable<number> {
    const baseUrl = `${this.apiURLModelsDevices}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createModelDevice(data: NewModeloDispositivo): Observable<any> {
    const baseUrl = `${this.apiURLModelsDevices}`;
    const body = {
      ...(data.nombre !== undefined &&
        data.nombre != '' && { name: data.nombre }),
      ...(data.template !== undefined &&
        data.template !== null &&
        Object.keys(data.template || {}).length > 0 && {
          template: data.template,
        }),
    };
    if (Object.keys(body).length != 2) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }

    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createDeviceAssociate(
    id_dispositivo: number,
    id_analitica: number
  ): Observable<number> {
    const baseUrl = `${this.apiURLDevices}/${id_dispositivo}/associate`;

    const body = id_analitica > 0 ? [{ id_analytic: id_analitica }] : [];

    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  deleteDeviceAssociate(
    numero_serie: string,
    id_analitica: number
  ): Observable<number> {
    const baseUrl = `${this.apiURLDevices}/${numero_serie}/associate/${id_analitica}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }
}
