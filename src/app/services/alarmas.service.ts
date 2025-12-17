import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EMPTY, expand, map, Observable, reduce, throwError } from 'rxjs';
import {
  AlarmaList,
  Alarmas,
  AlarmLevel,
  AlarmSource,
  AlarmState,
  NewAlarmaList,
  UpdateAlarmLevel,
} from '../models/alarmas';
import { state } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class AlarmasService {
  private apiURLAlarmas = environment.apiUrl + 'alarms';
  private apiURLAlarmasEstado = environment.apiUrl + 'alarms/states';
  private apiURLAlarmasNivel = environment.apiUrl + 'alarms/levels';
  private apiURLAlarmaReconocer = environment.apiUrl + 'alarmsack';
  private apiURLAlarmasOrigen = environment.apiUrl + 'alarms/sources';
  private apiURLAlarmasList = environment.apiUrl + 'alarms/list';

  constructor(private http: HttpClient) {}

  getAlarmByFiltro(
    desde: string,
    hasta: string,
    id_activos: number[],
    estados: string[],
    nivels: string[],
    origenes: string[]
  ): Observable<Alarmas[]> {
    let params = new HttpParams();

    if (desde) {
      params = params.set('from', desde);
    }

    if (hasta) {
      params = params.set('to', hasta);
    }

    if (id_activos && id_activos.length > 0) {
      id_activos.forEach((id) => {
        params = params.append('id_asset', id.toString());
      });
    }

    if (estados && estados.length > 0) {
      estados.forEach((estado) => {
        params = params.append('state', estado);
      });
    }

    if (nivels && nivels.length > 0) {
      nivels.forEach((nivel) => {
        params = params.append('level', nivel);
      });
    }

    if (origenes && origenes.length > 0) {
      origenes.forEach((origen) => {
        params = params.append('source', origen);
      });
    }

    params = params.set('limit', 100);

    return this.http.get<any>(this.apiURLAlarmas, { params }).pipe(
      expand((response) => {
        if (
          response?.pagination?.current_page !== undefined &&
          response?.pagination?.total_pages !== undefined &&
          response?.pagination?.limit !== undefined &&
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextOffset =
            response.pagination.current_page * response.pagination.limit;
          const nextParams = params.set('offset', nextOffset.toString());
          return this.http.get<any>(this.apiURLAlarmas, { params: nextParams });
        }
        return EMPTY;
      }),
      reduce<Alarmas[], any>((acc, response) => {
        // Validación estricta
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          typeof response.data === 'object' &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map(
            (item: any): Alarmas => ({
              id: item.id_alarm,
              activo: item.code,
              nivel: item.level,
              estado: item.state,
              origen: item.source,
              nombre: item.name,
              alias: item.alias,
              causa: item.cause,
              latitud: item.latitude,
              longitud: item.longitude,
              inicio: new Date(item.start),
              fin: item.end ? new Date(item.end) : undefined,
              id_usuario_reconocida: item.id_user_recognition ?? undefined,
              nombre_usuario_reconocida:
                item.name_user_recognition ?? undefined,
              apellido_usuario_reconocida:
                item.lastname_user_recognition ?? undefined,
              reconocida: item.recognition
                ? new Date(item.recognition)
                : undefined,
            })
          );
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  getFiltroAlarmState(): Observable<AlarmState[]> {
    const baseUrl = `${this.apiURLAlarmasEstado}?limit=100`;
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
      reduce<AlarmState[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_alarm_state,
            nombre: item.name,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  getFiltroAlarmLevel(): Observable<AlarmLevel[]> {
    const baseUrl = `${this.apiURLAlarmasNivel}?limit=100`;
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
      reduce<AlarmLevel[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_alarm_level,
            nombre: item.name,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  updateAlarmaReconocer(id: number): Observable<number> {
    const baseUrl = `${this.apiURLAlarmaReconocer}/${id}`;
    return this.http
      .put<void>(baseUrl, null, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  getFiltroAlarmSource(): Observable<AlarmSource[]> {
    const baseUrl = `${this.apiURLAlarmasOrigen}?limit=100`;
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
      reduce<AlarmSource[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_alarm_source,
            nombre: item.name,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  getAlarmList(): Observable<AlarmaList[]> {
    const url = `${this.apiURLAlarmasList}?status=3&limit=100`;
    return this.http.get<any>(url).pipe(
      expand((response, index) => {
        if (
          response?.pagination?.current_page !== undefined &&
          response?.pagination?.total_pages !== undefined &&
          response?.pagination?.limit !== undefined &&
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextPageUrl = `${url}&offset=${
            response.pagination.current_page * response.pagination.limit
          }`;
          return this.http.get<any>(nextPageUrl);
        }
        return EMPTY;
      }),
      reduce<AlarmaList[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_alarm_list,
            nombre: item.name,
            alias: item.alias,
            estado: item.state,
            id_origen: item.id_source,
            origen: item.name_source,
            id_nivel_alarma: item.id_level,
            nivel: item.name_level,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  getAlarmLevel(): Observable<AlarmLevel[]> {
    const url = `${this.apiURLAlarmasNivel}?status=0&limit=100`;
    return this.http.get<any>(url).pipe(
      expand((response, index) => {
        if (
          response?.pagination?.current_page !== undefined &&
          response?.pagination?.total_pages !== undefined &&
          response?.pagination?.limit !== undefined &&
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextPageUrl = `${url}&offset=${
            response.pagination.current_page * response.pagination.limit
          }`;
          return this.http.get<any>(nextPageUrl);
        }
        return EMPTY;
      }),
      reduce<AlarmLevel[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_alarm_level,
            nombre: item.name,
            accion: item.action,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  getAlarmSource(): Observable<AlarmSource[]> {
    const url = `${this.apiURLAlarmasOrigen}?status=0&limit=100`;
    return this.http.get<any>(url).pipe(
      expand((response, index) => {
        if (
          response?.pagination?.current_page !== undefined &&
          response?.pagination?.total_pages !== undefined &&
          response?.pagination?.limit !== undefined &&
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextPageUrl = `${url}&offset=${
            response.pagination.current_page * response.pagination.limit
          }`;
          return this.http.get<any>(nextPageUrl);
        }
        return EMPTY;
      }),
      reduce<AlarmSource[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_alarm_source,
            nombre: item.name,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  updateAlarmList(data: NewAlarmaList, id: number): Observable<number> {
    const baseUrl = `${this.apiURLAlarmasList}/${id}`;
    const body = {
      ...(data.nombre !== undefined && { name: data.nombre }),
      ...(data.alias !== undefined && { alias: data.alias }),
      ...(data.estado !== undefined && { state: data.estado }),
      ...(data.id_nivel_alarma !== undefined && {
        id_level: data.id_nivel_alarma,
      }),
      ...(data.id_origen !== undefined && { id_source: data.id_origen }),
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

  createAlarmList(data: NewAlarmaList): Observable<number> {
    const baseUrl = `${this.apiURLAlarmasList}`;
    const body = {
      name: data.nombre,
      alias: data.alias,
      ...(data.estado !== undefined && { state: data.estado }),
      ...(data.id_nivel_alarma !== undefined && {
        id_level: data.id_nivel_alarma,
      }),
      ...(data.id_origen !== undefined && {
        id_source: data.id_origen,
      }),
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

  deleteAlarmList(id: number): Observable<number> {
    const baseUrl = `${this.apiURLAlarmasList}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  updateAlarmLevel(data: UpdateAlarmLevel, id: number): Observable<number> {
    const baseUrl = `${this.apiURLAlarmasNivel}/${id}`;
    const body = {
      ...(data.accion !== undefined &&
        data.accion != '' && { action: data.accion }),
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

  deleteAlarmSource(id: number): Observable<number> {
    const baseUrl = `${this.apiURLAlarmasOrigen}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createOrigen(data: AlarmSource) {
    const baseUrl = `${this.apiURLAlarmasOrigen}`;
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
}
