import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataMapaGPS } from '../models/data-mapa-gps';
import { map, Observable } from 'rxjs';
import { CHART_COLORS } from '../constants/chart-colors.constants';

@Injectable({
  providedIn: 'root',
})
export class GpsService {
  private apiURLGPS = environment.apiUrl + 'data/gps';
  private apiURLCGPS = environment.apiUrl + 'data/currentgps';

  constructor(private http: HttpClient) {}

  getGpsAssets(
    desde: string,
    hasta: string,
    id: string
  ): Observable<{ data: DataMapaGPS[]; total: number }> {
    const url = `${this.apiURLGPS}?from=${encodeURIComponent(
      desde
    )}&to=${encodeURIComponent(hasta)}&idvehicle=${id}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        // Procesamiento de datos (si la respuesta tiene un campo 'data')
        const allVehicleData = Object.keys(response.data).reduce(
          (acc: DataMapaGPS[], key) => {
            const value = response.data[key];

            // Verificamos si el valor es un array para procesarlo
            if (value && Array.isArray(value) && value.length > 0) {
              const processedArray = value.map((item) => {
                // Tratamiento de los datos antes de acumularlos
                const processedItem = {
                  lat: item.latitude,
                  lon: item.longitude,
                  color: '#3784c5', // Asignación de color por defecto
                  label: item.date, // Convertir fecha a formato ISO
                  capa: key, // Añadir la clave como 'capa'
                };
                return processedItem;
              });

              // Acumulamos los datos procesados
              acc = acc.concat(processedArray);
            }
            return acc;
          },
          []
        );

        // Retornamos el objeto con 'data' y 'total' (si existe)
        return {
          data: allVehicleData,
          total: response.count_assets || 0,
        };
      })
    );
  }

  getCurrentGPS(): Observable<{ data: DataMapaGPS[]; total: number }> {
    const url = `${this.apiURLCGPS}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        // Procesamiento de datos (si la respuesta tiene un campo 'data')

        const allVehicleData = Object.keys(response.data).reduce(
          (acc: DataMapaGPS[], key) => {
            const value = response.data[key];
            // Verificamos si el valor es un objeto
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              const processedItem = {
                lat: value.latitude,
                lon: value.longitude,
                color: obtenerColorPorEstado(value.state.toLowerCase()), // Asignación de color por defecto
                label: key,
                capa: value.idvehicle, // Añadir la clave como 'capa'
              };

              // Acumulamos los datos procesados
              acc = acc.concat(processedItem);
            }
            return acc;
          },
          []
        );

        // Retornamos el objeto con 'data' y 'total' (si existe)
        return {
          data: allVehicleData,
          total: response.count_assets || 0,
        };
      })
    );
  }


}

function obtenerColorPorEstado(state: string): string {
  switch (state.toLowerCase()) {
    case 'crítica':
      return CHART_COLORS.ERROR;
    case 'advertencia':
      return CHART_COLORS.WARNING;
    case 'información':
      return CHART_COLORS.SUCCESS;
    case 'normal':
      return CHART_COLORS.BASE
    case 'idle':
      return CHART_COLORS.TEXT_LIGHT;
    default:
      return CHART_COLORS.BASE;
  }
}
