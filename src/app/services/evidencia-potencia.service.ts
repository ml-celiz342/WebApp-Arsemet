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
  private apiURLEvidenciaBalance =
    environment.apiUrl + 'data/evidences/balance';

  constructor(private http: HttpClient) {}

  /* FORMATO FECHA */
  private formatDateForBackend(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // EVIDENCIA POWER
  getEvidenciaPowerById(
    id_activo: number,
    desde?: string,
    hasta?: string
  ): Observable<Evidencia> {
    let params = new HttpParams().set('idAsset', id_activo.toString());

    // Convertir fechas al formato del backend
    if (desde) {
      const desdeFormatted = this.formatDateForBackend(new Date(desde));
      params = params.set('from', desdeFormatted);
    }

    if (hasta) {
      const hastaFormatted = this.formatDateForBackend(new Date(hasta));
      params = params.set('to', hastaFormatted);
    }

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
