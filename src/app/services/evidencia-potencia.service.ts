import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { Evidencia} from '../models/evidencia-potencia';

@Injectable({
  providedIn: 'root',
})
export class EvidenciaPotenciaService {
  private apiURLEvidenciaPower = environment.apiUrl + 'data/evidences/power';

  constructor(private http: HttpClient) {}

  // EVIDENCIA POWER
  getEvidenciaPowerById(
    id_activo: number,
    desde?: string,
    hasta?: string
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

  // MAPEO / ADAPTADOR DE RESPUESTA
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
}
