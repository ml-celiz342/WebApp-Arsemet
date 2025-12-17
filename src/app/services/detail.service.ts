import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Detalle, DetalleBalanza } from '../models/detalle';
import { map, Observable, reduce } from 'rxjs';
import { UtilidadesService } from './utilidades.service';

@Injectable({
  providedIn: 'root',
})
export class DetailService {
  private apiURLDetailActivo = environment.apiUrl + 'data/detail/active'; // No va
  private apiURLDetail = environment.apiUrl + 'data/detail';
  // Nuevo
  private apiURLDetailPower = environment.apiUrl + 'data/detail/power';
  private apiURLDetailBalance = environment.apiUrl + 'data/detail/balance';

  constructor(
    private http: HttpClient,
    private utilidades: UtilidadesService
  ) {}

  // DETALLE DE POWER
  getDetallePower(
    id_activo: number,
    desde?: string,
    hasta?: string
  ): Observable<Detalle> {
    let params = new HttpParams();

    params = params.set('idAsset', id_activo);
    if (desde) params = params.set('from', desde);
    if (hasta) params = params.set('to', hasta);

    return this.http.get<any>(this.apiURLDetailPower, { params }).pipe(
      map((response) => {
        if (response && response.data) {
          return {
            state: response.data.state,
            turned_on: response.data.turned_on,
            current_power: response.data.current_power,
            total_consumption: response.data.total_consumption,
          } as Detalle;
        }
        return {
          state: '',
          turned_on: 0,
          current_power: 0,
          total_consumption: 0,
        } as Detalle;
      })
    );
  }

  // DETALLE DE BALANZA
  getDetalleBalanza(
    id_activo: number,
    desde?: string,
    hasta?: string
  ): Observable<DetalleBalanza> {
    let params = new HttpParams();

    params = params.set('idAsset', id_activo);
    if (desde) params = params.set('from', desde);
    if (hasta) params = params.set('to', hasta);

    return this.http.get<any>(this.apiURLDetailBalance, { params }).pipe(
      map((response) => {
        if (response && response.data) {
          return {
            state: response.data.state,
            current_weight: response.data.current_weight,
            total_weigh: response.data.total_weigh,
          } as DetalleBalanza;
        }

        return {
          state: '',
          current_weight: 0,
          total_weigh: 0,
        } as DetalleBalanza;
      })
    );
  }
}
