import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, expand, Observable, reduce } from 'rxjs';
import { ZonasTareasEstado } from '../models/kpi-temporales';


@Injectable({
  providedIn: 'root',
})
export class KpiTemporalesService {
  private apiURLKpiGantt = environment.apiUrl + 'data/kpi/gantt';

  constructor(private http: HttpClient) {}

  // Obtener todas las tareas
  getKpiTasksStates(
    id_activo: number,
    desde: string,
    hasta: string,
  ): Observable<ZonasTareasEstado[]> {
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

    return this.http.get<any>(this.apiURLKpiGantt, { params }).pipe(
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
          return this.http.get<any>(this.apiURLKpiGantt, {
            params: nextParams,
          });
        }
        return EMPTY;
      }),
      reduce<ZonasTareasEstado[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map(
            (item: any): ZonasTareasEstado => ({
              state: item.state,
              from: new Date(item.from),
              to: new Date(item.to),
            }),
          );

          acc.push(...mappedData);
        }
        return acc;
      }, []),
    );
  }
}
