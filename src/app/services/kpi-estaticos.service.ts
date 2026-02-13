import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DistribucionTareas, KpiStats } from '../models/kpi-estaticos';

@Injectable({
  providedIn: 'root',
})
export class KpiEstaticosService {
  private apiURLKpiGantt = environment.apiUrl + 'data/kpi/state_distribution';
  private apiURLKpiStats = environment.apiUrl + 'data/kpi/stats';

  constructor(private http: HttpClient) {}

  getKpiTasksDistribution(
    id_activo: number,
    desde: string,
    hasta: string,
  ): Observable<DistribucionTareas> {
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

    return this.http.get<any>(this.apiURLKpiGantt, { params }).pipe(
      map(
        (response): DistribucionTareas => ({
          estados: response.estados.map((e: any) => ({
            estado: e.estado,
            valor: e.valor,
          })),
          from: new Date(response.from),
          to: new Date(response.to),
          id_activo: response.id_activo,
        }),
      ),
    );
  }

  getKpiStats(
    id_activo: number,
    desde: string,
    hasta: string,
  ): Observable<KpiStats> {
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

    return this.http.get<any>(this.apiURLKpiStats, { params }).pipe(
      map(
        (response): KpiStats => ({
          id_activo: response.id_activo,
          from: new Date(response.from),
          to: new Date(response.to),
          linealbar: {
            energia_no_productiva: response.linealbar.energia_no_productiva,
            tasa_de_utilizacion: response.linealbar.tasa_de_utilizacion,
          },
        }),
      ),
    );
  }
}
