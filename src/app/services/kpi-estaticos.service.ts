import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DistribucionTareas, KpiStats, TotalEnergyPerShift } from '../models/kpi-estaticos';

@Injectable({
  providedIn: 'root',
})
export class KpiEstaticosService {
  private apiURLKpiGantt = environment.apiUrl + 'data/kpi/state_distribution';
  private apiURLKpiStats = environment.apiUrl + 'data/kpi/stats';
  private apiURLTotalEnergyPerShift =
    environment.apiUrl + 'data/kpi/total_energy_per_shift';

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
          id_asset: response.id_asset,
          from: new Date(response.from),
          to: new Date(response.to),
          states: response.states.map((e: any) => ({
            state: e.state,
            value: e.value,
          })),
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
          id_asset: response.id_asset,
          from: new Date(response.from),
          to: new Date(response.to),
          radialbar: {
            non_productive_energy: response.radialbar.non_productive_energy,
            utilization_rate: response.radialbar.utilization_rate,
          },
        }),
      ),
    );
  }

  getTotalEnergyPerShift(
    id_activo: number,
    desde: string,
    hasta: string,
  ): Observable<TotalEnergyPerShift> {
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

    return this.http.get<any>(this.apiURLTotalEnergyPerShift, { params }).pipe(
      map(
        (response): TotalEnergyPerShift => ({
          id_asset: response.id_asset,
          from: new Date(response.from),
          to: new Date(response.to),
          energy_by_shift: (response.energy_by_shift ?? []).map((e: any) => ({
            start: new Date(e.start),
            kwh: e.kwh,
            kvarh: e.kvarh,
          })),
        }),
      ),
    );
  }

}
