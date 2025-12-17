import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NewPart, Parts, PartUpdate } from '../models/parts';
import { EMPTY, expand, map, Observable, reduce, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartsService {
  private apiURLParts = environment.apiUrl + 'data/parts';

  constructor(private http: HttpClient) {}

  // Obtener piezas
  getParts(): Observable<Parts[]> {
    const baseUrl = `${this.apiURLParts}?status=2&limit=100`;
    return this.http.get<any>(baseUrl).pipe(
      expand((response, index) => {
        if (
          response?.pagination?.current_page !== undefined &&
          response?.pagination?.total_pages !== undefined &&
          response?.pagination?.limit !== undefined &&
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextPageUrl = `${baseUrl}&offset=${
            response.pagination.current_page * response.pagination.limit
          }`;
          return this.http.get<any>(nextPageUrl);
        }
        return EMPTY;
      }),
      reduce<Parts[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id_part: item.id_part,
            code: item.code,
            name: item.name,
            observation: item.observation,
            plan: item.plan ?? null,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  // Obtener pieza por id

  // Crear pieza (sin pdf)
  createPart(data: NewPart): Observable<{ status: number; idPart: number }> {
    const baseUrl = `${this.apiURLParts}`;

    const body = {
      ...(data.code !== undefined &&
        data.code !== '' && {
          code: data.code,
        }),
      ...(data.name !== undefined &&
        data.name !== '' && {
          name: data.name,
        }),
      ...(data.observation !== undefined &&
        data.observation !== '' && {
          observation: data.observation,
        }),
    };

    if (Object.keys(body).length < 2 || Object.keys(body).length > 3) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }

    return this.http.post<any>(baseUrl, body, { observe: 'response' }).pipe(
      map((response) => {
        if (response.body && response.body.id_part) {
          return {
            status: response.status,
            idPart: response.body.id_part,
          };
        }
        return {
          status: response.status,
          idPart: -1,
        };
      })
    );
  }

  /* Actualizar pieza
  updatePart(data: PartUpdate, id: number): Observable<number> {
    const baseUrl = `${this.apiURLParts}/${id}`;
    const body = {
      ...(data.code !== undefined &&
        data.code !== '' && {
          code: data.code,
        }),
      ...(data.name !== undefined &&
        data.name !== '' && {
          name: data.name,
        }),
      ...(data.observation !== undefined &&
        data.observation !== '' && {
          observation: data.observation,
        }),
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
  */

  // Actualizar plano
  uploadPartPlan(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('plan', file);

    return this.http.post(`${this.apiURLParts}/${id}/plan`, formData);
  }

  // Borrar pieza
  deletePart(id: number): Observable<number> {
    const baseUrl = `${this.apiURLParts}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }
}
