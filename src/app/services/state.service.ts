import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { State } from '../models/state';
import { EMPTY, expand, Observable, reduce } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private apiURLState = environment.apiUrl + 'data/state';

  constructor(private http: HttpClient) {}

  // Obtener estados
  getStates(types?: string[]): Observable<State[]> {

    let params = new HttpParams();

    if (types && types.length > 0) {
      types.forEach((type) => {
        params = params.append('type', type);
      });
    }

    params = params.set('limit', 100);

    return this.http.get<any>(this.apiURLState, { params }).pipe(
      expand((response) => {
        if (
          response?.pagination?.current_page !== undefined &&
          response?.pagination?.total_pages !== undefined &&
          response?.pagination?.limit !== undefined &&
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextPageUrl = `${this.apiURLState}&offset=${
            response.pagination.current_page * response.pagination.limit
          }`;

          return this.http.get<any>(nextPageUrl);
        }

        return EMPTY;
      }),

      reduce<State[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData: State[] = response.data.map((item: any) => ({
            id: item.id,
            state: item.state,
            operation: item.operation,
            code: item.code,
          }));

          acc.push(...mappedData);
        }

        return acc;
      }, []),
    );
  }
}
