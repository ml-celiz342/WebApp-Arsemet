import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EvidenciaData } from '../models/evidencia-data';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { UtilidadesService } from './utilidades.service';

@Injectable({
  providedIn: 'root',
})
export class EvidencesService {
  private apiURLTurnedOn = environment.apiUrl + 'data/evidences';
  private apiURLEvidenciaDispositivo = environment.apiUrl + 'data/evidences/device/';

  constructor(private http: HttpClient, private utilidades: UtilidadesService) {}

  getEvidenciaAssets(
    desde: string,
    hasta: string,
    id: string
  ): Observable<EvidenciaData[]> {
    const baseUrl = `${this.apiURLTurnedOn}?from=${encodeURIComponent(
      desde
    )}&to=${encodeURIComponent(hasta)}&idvehicle=${id}`;
    return this.http.get<any>(baseUrl).pipe(
      expand((response, index) => {
        if (
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextPageUrl = `${baseUrl}&offset=${
            response.pagination.current_page * response.pagination.limit
          }`;
          return this.http.get<any>(nextPageUrl);
        }
        return EMPTY;
      }),
      reduce<EvidenciaData[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          typeof response.data === 'object' &&
          !Array.isArray(response.data)
        ) {
          const entries = Object.entries(response.data || {});
          if (entries.length > 0) {
            const [, value] = entries[0];
            if (value && Array.isArray(value)) {
              const mappedData = value.map((item) => ({
                id: item.evidenceID,
                num_serie: item.serie_number,
                estado: item.state_name,
                inicio: item.start ? new Date(item.start) : undefined,
                fin: item.end ? new Date(item.end) : undefined,
                duracion:
                  item.start && item.end
                    ? this.utilidades.convertirSegundosAStringTime(
                        (new Date(item.end).getTime() -
                          new Date(item.start).getTime()) /
                          1000
                      )
                    : undefined,
                bobina: item.average_coil,
                evidencia: item.name_evidence,
                operario:
                  item.name_worker != null && item.last_name_worker != null
                    ? this.utilidades.capitalize(item.name_worker) +
                      ' ' +
                      this.utilidades.capitalize(item.last_name_worker)
                    : item.id_worker != null && item.rfid_worker != null
                    ? String(item.rfid_worker)
                    : '',
                velocidad: item.speed_limit,
                inclinacion: item.average_inclination,
                cinturon: item.flag_seatbelt,
                frenoEmergencia: item.flag_emergency_brake,
                frenoPedal: item.flag_brake,
                paradaEmergencia: item.flag_emergency_stop,
              }));
              acc.push(...mappedData);
            }
          }
        }
        return acc;
      }, [])
    );
  }

  getEvidenciaAssetsByDeviceAndID(
    id_desde: number,
    id_hasta: number,
    numero_serie: string
  ): Observable<EvidenciaData[]> {
    const baseUrl = `${
      this.apiURLEvidenciaDispositivo
    }/${numero_serie}?id_from=${id_desde}&id_to=${id_hasta}`;
    return this.http.get<any>(baseUrl).pipe(
      expand((response, index) => {
        if (
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextPageUrl = `${baseUrl}&offset=${
            response.pagination.current_page * response.pagination.limit
          }`;
          return this.http.get<any>(nextPageUrl);
        }
        return EMPTY;
      }),
      reduce<EvidenciaData[], any>((acc, response) => {
        console.log(response)
        if (
          response &&
          typeof response === 'object' &&
          'data' in response
        ) {
            const value = response.data;
            if (value && Array.isArray(value)) {
              const mappedData = value.map((item) => ({
                id: item.evidenceID,
                num_serie: item.serie_number,
                estado: item.state_name,
                inicio: item.start ? new Date(item.start) : undefined,
                fin: item.end ? new Date(item.end) : undefined,
                duracion:
                  item.start && item.end
                    ? this.utilidades.convertirSegundosAStringTime(
                        (new Date(item.end).getTime() -
                          new Date(item.start).getTime()) /
                          1000
                      )
                    : undefined,
                bobina: item.average_coil,
                evidencia: item.name_evidence,
                operario:
                  item.name_worker != null && item.last_name_worker != null
                    ? this.utilidades.capitalize(item.name_worker) +
                      ' ' +
                      this.utilidades.capitalize(item.last_name_worker)
                    : item.id_worker != null && item.rfid_worker != null
                    ? String(item.rfid_worker)
                    : '',
                velocidad: item.speed_limit,
                inclinacion: item.average_inclination,
                cinturon: item.flag_seatbelt,
                frenoEmergencia: item.flag_emergency_brake,
                frenoPedal: item.flag_brake,
                paradaEmergencia: item.flag_emergency_stop,
              }));
              acc.push(...mappedData);
            }
        }
        return acc;
      }, [])
    );
  }
}

