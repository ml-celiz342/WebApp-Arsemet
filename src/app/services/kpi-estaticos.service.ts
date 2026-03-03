import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { KpiStats, TotalEnergyPerShift } from '../models/kpi-estaticos';

@Injectable({
  providedIn: 'root',
})
export class KpiEstaticosService {
  private apiURLKpiStats = environment.apiUrl + 'data/kpi/stats';
  private apiURLTotalEnergyPerShift = environment.apiUrl + 'data/kpi/total_energy_per_shift';

  constructor(private http: HttpClient) {}

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
          maintenance: {
            average_cycle_time: response.maintenance.average_cycle_time,
            last_maintenance_time: response.maintenance.last_maintenance_time,
            specific_energy_use: response.maintenance.specific_energy_use,
          },
          piechart: {
            states: response.piechart?.states ?? [],
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
