import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { KpiHoras } from '../models/kpi-horas';

@Injectable({
  providedIn: 'root',
})
export class TurnedonService {
  private apiURLTurnedOn = environment.apiUrl + 'data/turnedon/hour';
  private apiURLTurnedOnDay = environment.apiUrl + 'data/turnedon/day';

  constructor(private http: HttpClient) {}

  getTurnedOnAssets(
    desde: string,
    hasta: string,
    id: string,
    day: boolean
  ): Observable<KpiHoras[]> {
    let url: string;
    if (day){
      url = `${this.apiURLTurnedOnDay}?from=${encodeURIComponent(
        desde
      )}&to=${encodeURIComponent(hasta)}&idvehicle=${id}`;
    }else{
      url = `${this.apiURLTurnedOn}?from=${encodeURIComponent(
        desde
      )}&to=${encodeURIComponent(hasta)}&idvehicle=${id}`;
    }
    return this.http.get<any>(url).pipe(
      map((response) => {
        // Procesamos la respuesta con reduce
        const allVehicleData = Object.keys(response.data).reduce(
          (acc: KpiHoras[], key) => {
            const value = response.data[key];

            // Verificamos si el valor es un objeto válido
            if (
              typeof value === 'object' &&
              value !== null &&
              !Array.isArray(value)
            ) {
              const parsedData: KpiHoras = {
                nombre: key,
                total_on: value.total_turned_on,
                total_off: value.total_turned_off,
                total_contacto: value.total_contact,
                total_ralenti: value.total_ralenti,
                detalle_total_on: value.detail_turned_on.map(
                  (item: { hour: Date; total: number }) => ({
                    hora: new Date(item.hour),
                    total: item.total,
                  })
                ),
                detalle_total_sin_ralenti: value.detail_turned_on.map(
                  (itemOn: { hour: Date; total: number }) => {
                    const horaActual = new Date(itemOn.hour).getTime();

                    const itemRalenti = value.detail_ralenti.find(
                      (item: { hour: Date; total: number }) =>
                        new Date(item.hour).getTime() === horaActual
                    );

                    const totalRalenti = itemRalenti ? itemRalenti.total : 0;

                    return {
                      hora: new Date(itemOn.hour),
                      total: itemOn.total - totalRalenti,
                    };
                  }
                ),
                detalle_total_contacto: value.detail_contact.map(
                  (item: { hour: Date; total: number }) => ({
                    hora: new Date(item.hour),
                    total: item.total,
                  })
                ),
                detalle_total_ralenti: value.detail_ralenti.map(
                  (item: { hour: Date; total: number }) => ({
                    hora: new Date(item.hour),
                    total: item.total,
                  })
                ),
              };
              acc.push(parsedData); // Agregamos el objeto al acumulador
            }
            return acc; // Retornamos el acumulador actualizado
          },
          [] // Array vacío como valor inicial del acumulador
        );

        return allVehicleData;
      })
    );
  }
}
