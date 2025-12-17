import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { Areas } from '../models/areas';

@Injectable({
  providedIn: 'root',
})
export class AreasService {
  private apiURLAreas = environment.apiUrl + 'areas';

  constructor(private http: HttpClient) {}

  getAreasGPS(): Observable<Areas[]> {
    const url = `${this.apiURLAreas}?status=0&limit=100`;
    return this.http.get<any>(url).pipe(
      expand((response, index) => {
        if (
          response?.pagination?.current_page !== undefined &&
          response?.pagination?.total_pages !== undefined &&
          response?.pagination?.limit !== undefined &&
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextPageUrl = `${url}&offset=${
            response.pagination.current_page * response.pagination.limit
          }`;
          return this.http.get<any>(nextPageUrl);
        }
        return EMPTY;
      }),
      reduce<Areas[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_zona,
            nombre: item.name,
            lat: item.latitude,
            lon: item.longitude,
            zoom: item.zoom,
            descripcion: item.description,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }
}
