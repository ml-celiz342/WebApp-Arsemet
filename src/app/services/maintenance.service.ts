import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Maintenance, NewMaintenance } from '../models/maintenance';
import { EMPTY, expand, map, Observable, reduce, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private apiURLMantenimiento = environment.apiUrl + 'maintenance';

  constructor(private http: HttpClient) {}

  getMaintenanceByFiltro(
    desde: string,
    hasta: string,
    id_activos: number[]
  ): Observable<Maintenance[]> {
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

    params = params.set('limit', 100);

    return this.http.get<any>(this.apiURLMantenimiento, { params }).pipe(
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
          return this.http.get<any>(this.apiURLMantenimiento, {
            params: nextParams,
          });
        }
        return EMPTY;
      }),
      reduce<Maintenance[], any>((acc, response) => {
        // Validación estricta
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          typeof response.data === 'object' &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map(
            (item: any): Maintenance => ({
              id_maintenance: item.id_maintenance,
              reason: item.reason,
              observation: item.observation,
              start: new Date(item.start),
              end: item.end ? new Date(item.end) : undefined,
              update_date: item.update_date
                ? new Date(item.update_date)
                : undefined,
              id_asset: item.id_asset,
              id_user: item.id_user ?? undefined,
              asset_code: item.asset_code,
            })
          );
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  deleteMaintenance(id: number): Observable<number> {
    const baseUrl = `${this.apiURLMantenimiento}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createMaintenance(data: NewMaintenance): Observable<number> {
    const baseUrl = `${this.apiURLMantenimiento}`;
    const body = {
      ...(data.id_asset && { id_asset: data.id_asset }),
      ...(data.reason && { reason: data.reason }),
      ...(data.observation && {
        observation: data.observation,
      }),
      ...(data.start && { start: data.start }),
      ...(data.end && { end: data.end }),
    };
    if (Object.keys(body).length < 3) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  updateMaintenance(data: NewMaintenance, id: number): Observable<number> {
    const baseUrl = `${this.apiURLMantenimiento}/${id}`;
    const body = {
      ...(data.observation && {
        observation: data.observation,
      }),
      ...(data.start && { start: data.start }),
      ...(data.end && { end: data.end }),
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
}
