import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Evidencia, ZonasIA} from '../models/evidencia-potencia';
import { EMPTY, expand, Observable, reduce, map } from 'rxjs';
import { EvidenciaGenerico } from '../models/evidencia-generico';

@Injectable({
  providedIn: 'root',
})
export class EvidenciaPotenciaService {
  private apiURLEvidenciaPower = environment.apiUrl + 'data/evidences/power';
  private apiURLEvidenciaCurrent =
    environment.apiUrl + 'data/evidences/current';
  private apiURLEvidenciaTension =
    environment.apiUrl + 'data/evidences/voltage';
  private apiURLEvidenciaTasksIA =
    environment.apiUrl + 'data/evidences/zones_ia';

  constructor(private http: HttpClient) {}

  // EVIDENCIA POWER
  getEvidenciaPowerById(
    id_activo: number,
    desde?: string,
    hasta?: string,
  ): Observable<Evidencia> {
    let params = new HttpParams();

    if (id_activo) {
      params = params.set('idAsset', id_activo);
    }

    if (desde) {
      params = params.set('from', desde);
    }

    if (hasta) {
      params = params.set('to', hasta);
    }

    params = params.set('limit', 100);

    return this.http
      .get<any>(this.apiURLEvidenciaPower, { params })
      .pipe(map((res) => this.mapEvidencia(res)));
  }

  // MAPEO POWER
  private mapEvidencia(response: any): Evidencia {
    if (!response || !response.data) {
      return {
        code: '',
        total_consumption: 0,
        total_reactive_consumption: 0,
        power: [],
        detail_consumption: [],
      };
    }

    const data = response.data;

    return {
      code: data.code,
      total_consumption: data.total_consumption,
      total_reactive_consumption: data.total_reactive_consumption,

      power:
        data.power?.map((p: any) => ({
          hour: new Date(p.hour),
          r: p.r,
          s: p.s,
          t: p.t,
        })) || [],

      detail_consumption:
        data.detail_consumption?.map((c: any) => ({
          hour: new Date(c.hour),
          value: c.value,
          reactive_value: c.reactive_value,
        })) || [],
    };
  }

  // EVIDENCIA CURRENT
  getEvidenciaCurrentById(
    id_activo: number,
    desde?: string,
    hasta?: string,
  ): Observable<EvidenciaGenerico> {
    let params = new HttpParams();

    if (id_activo) {
      params = params.set('idAsset', id_activo);
    }

    if (desde) {
      params = params.set('from', desde);
    }

    if (hasta) {
      params = params.set('to', hasta);
    }

    params = params.set('limit', 100);

    return this.http
      .get<any>(this.apiURLEvidenciaCurrent, { params })
      .pipe(map((res) => this.mapEvidenciaGenerico(res)));
  }

  // EVIDENCIA TENSION
  getEvidenciaTensionById(
    id_activo: number,
    desde?: string,
    hasta?: string,
  ): Observable<EvidenciaGenerico> {
    let params = new HttpParams();

    if (id_activo) {
      params = params.set('idAsset', id_activo);
    }

    if (desde) {
      params = params.set('from', desde);
    }

    if (hasta) {
      params = params.set('to', hasta);
    }

    params = params.set('limit', 100);

    return this.http
      .get<any>(this.apiURLEvidenciaTension, { params })
      .pipe(map((res) => this.mapEvidenciaGenerico(res)));
  }

  // MAPEO CURRENT + TENSION
  private mapEvidenciaGenerico(response: any): EvidenciaGenerico {
    if (!response || !response.data) {
      return {
        code: '',
        generic: [],
      };
    }

    const data = response.data;

    return {
      code: data.code,
      generic:
        data.power?.map((p: any) => ({
          hour: new Date(p.hour),
          r: p.r,
          s: p.s,
          t: p.t,
        })) || [],
    };
  }

  // EVIDENCIA ZONAS IA
  getEvidenciaZonasIaById(
    id_activo: number,
    desde: string,
    hasta: string,
  ): Observable<ZonasIA[]> {
    let params = new HttpParams();

    if (id_activo) {
      params = params.set('idAsset', id_activo);
    }

    if (desde) {
      params = params.set('from', desde);
    }

    if (hasta) {
      params = params.set('to', hasta);
    }

    params = params.set('limit', 100);

    return this.http.get<any>(this.apiURLEvidenciaTasksIA, { params }).pipe(
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

          return this.http.get<any>(this.apiURLEvidenciaTasksIA, {
            params: nextParams,
          });
        }

        return EMPTY;
      }),

      reduce<ZonasIA[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map(
            (item: any): ZonasIA => ({
              code: item.code,
              zone_name: item.zone_name,
              start: new Date(item.from),
              end: new Date(item.to),
              workers: item.workers,
            }),
          );

          acc.push(...mappedData);
        }

        return acc;
      }, []),
    );
  }
}
