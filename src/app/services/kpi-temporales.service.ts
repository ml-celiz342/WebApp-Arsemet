import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, expand, Observable, reduce, map } from 'rxjs';
import { PiecesPerHourPoint, PiecesPerHourSerie, ZonasTareasEstado } from '../models/kpi-temporales';


@Injectable({
  providedIn: 'root',
})
export class KpiTemporalesService {
  private apiURLKpiGantt = environment.apiUrl + 'data/kpi/state_timeline'; // Grafico: Tiempo vs Estado
  private apiURLPiecesPerHour = environment.apiUrl + 'data/kpi/pieces_per_hour'; // Grafico: Piezas producidas por hora

  constructor(private http: HttpClient) {}

  /* --- GANT --- */
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
              alias: item.alias,
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

  /* --- PIECES PER HOUR --- */
  getPiecesPerHour(
    id_activo: number,
    desde: string,
    hasta: string,
  ): Observable<PiecesPerHourSerie[]> {
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

    return this.http.get<any[]>(this.apiURLPiecesPerHour, { params }).pipe(
      map((response) =>
        response.map(
          (serie): PiecesPerHourSerie => ({
            id_asset: serie.id_asset,
            data: serie.data.map(
              (p: any): PiecesPerHourPoint => ({
                hour: new Date(p.hour),
                value: Number(p.value),
              }),
            ),
          }),
        ),
      ),
    );
  }
}
