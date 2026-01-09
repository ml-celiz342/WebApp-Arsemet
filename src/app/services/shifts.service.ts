import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Shift, ShiftDetail, ShiftNew, ShiftUpdate } from '../models/shift';
import { EMPTY, expand, map, Observable, reduce, throwError } from 'rxjs';
import { TurnosActivos } from '../models/turnos-activos';
import { DescansoNew } from '../models/break';

@Injectable({
  providedIn: 'root',
})
export class ShiftsService {
  private apiURLShifts = environment.apiUrl + 'shifts';
  private apiURLShiftsAssets = environment.apiUrl + 'shifts/associate';

  constructor(private http: HttpClient) {}

  /*  ------------------ TURNOS ------------------ */
  /*
  {
      "counter": 1,
      "data": [
          {
              "id_shift": 1,
              "name": "diario",
              "start": "0000-01-01T07:00:00-03:00",
              "end": "0000-01-01T16:00:00-03:00",
              "monday": true,
              "tuesday": true,
              "wednesday": true,
              "thursday": true,
              "friday": true,
              "saturday": false,
              "sunday": false
          }, ...
      ],
      "pagination": {
          "total_records": 1,
          "limit": 20,
          "offset": 0,
          "current_page": 1,
          "total_pages": 1
      }
  }
  */
  /* Obtener turnos */
  getShifts(): Observable<Shift[]> {
    return this.http.get<any>(this.apiURLShifts).pipe(
      expand((response) => {
        if (
          response?.pagination?.current_page !== undefined &&
          response?.pagination?.total_pages !== undefined &&
          response?.pagination?.limit !== undefined &&
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextOffset =
            response.pagination.current_page * response.pagination.limit;

          return this.http.get<any>(this.apiURLShifts);
        }

        return EMPTY;
      }),

      reduce<Shift[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData: Shift[] = response.data.map((item: any) => ({
            id_shift: item.id_shift,
            name: item.name,

            start: item.start,
            end: item.end,

            monday: item.monday,
            tuesday: item.tuesday,
            wednesday: item.wednesday,
            thursday: item.thursday,
            friday: item.friday,
            saturday: item.saturday,
            sunday: item.sunday,
          }));

          acc.push(...mappedData);
        }

        return acc;
      }, [])
    );
  }

  /*
  {
    "id_shift": 1,
    "name": "diario",
    "start": "0000-01-01T07:00:00-03:00",
    "end": "0000-01-01T16:00:00-03:00",
    "monday": true,
    "tuesday": true,
    "wednesday": true,
    "thursday": true,
    "friday": true,
    "saturday": false,
    "sunday": false,
    "breaks": [
        {
            "id_break": 1,
            "break_start": "0000-01-01T09:00:00-03:00",
            "break_end": "0000-01-01T09:40:00-03:00",
            "break_name": "desayuno"
        }, ...
    ]
  }
  */
  /* Obtener descansos por turno */
  getShift(id_shift: number): Observable<ShiftDetail> {
    return this.http.get<any>(`${this.apiURLShifts}/${id_shift}`).pipe(
      map((response) => ({
        id_shift: response.id_shift,
        name: response.name,

        start: response.start,
        end: response.end,

        monday: response.monday,
        tuesday: response.tuesday,
        wednesday: response.wednesday,
        thursday: response.thursday,
        friday: response.friday,
        saturday: response.saturday,
        sunday: response.sunday,

        breaks: (response.breaks ?? []).map((b: any) => ({
          id_break: b.id_break,
          break_name: b.break_name,
          break_start: b.break_start,
          break_end: b.break_end,
        })),
      }))
    );
  }

  /* Crear turno */
  createShift(data: ShiftNew): Observable<{ status: number; idShift: number }> {
    const baseUrl = `${this.apiURLShifts}`;

    const body = {
      ...(data.name !== undefined &&
        data.name !== '' && {
          name: data.name,
        }),

      ...(data.start !== undefined &&
        data.start !== null && {
          start: data.start,
        }),

      ...(data.end !== undefined &&
        data.end !== null && {
          end: data.end,
        }),

      ...(data.monday !== undefined && { monday: data.monday }),
      ...(data.tuesday !== undefined && { tuesday: data.tuesday }),
      ...(data.wednesday !== undefined && { wednesday: data.wednesday }),
      ...(data.thursday !== undefined && { thursday: data.thursday }),
      ...(data.friday !== undefined && { friday: data.friday }),
      ...(data.saturday !== undefined && { saturday: data.saturday }),
      ...(data.sunday !== undefined && { sunday: data.sunday }),
    };

    if (Object.keys(body).length < 1) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }

    return this.http.post<any>(baseUrl, body, { observe: 'response' }).pipe(
      map((response) => {
        if (response.body && response.body.id_shift) {
          return {
            status: response.status,
            idShift: response.body.id_shift,
          };
        }
        return {
          status: response.status,
          idShift: -1,
        };
      })
    );
  }

  /* Actualizar turno */
  updateShift(id_shift: number, data: ShiftUpdate): Observable<number> {
    const baseUrl = `${this.apiURLShifts}/${id_shift}`;

    const body = {
      ...(data.name !== undefined &&
        data.name !== '' && {
          name: data.name,
        }),

      ...(data.start !== undefined && {
        start: data.start ? data.start : null,
      }),

      ...(data.end !== undefined && {
        end: data.end ? data.end : null,
      }),

      ...(data.monday !== undefined && { monday: data.monday }),
      ...(data.tuesday !== undefined && { tuesday: data.tuesday }),
      ...(data.wednesday !== undefined && { wednesday: data.wednesday }),
      ...(data.thursday !== undefined && { thursday: data.thursday }),
      ...(data.friday !== undefined && { friday: data.friday }),
      ...(data.saturday !== undefined && { saturday: data.saturday }),
      ...(data.sunday !== undefined && { sunday: data.sunday }),
    };

    if (Object.keys(body).length < 1) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }

    return this.http
      .put<any>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  /* Eliminar turno */
  deleteShift(id: number): Observable<number> {
    const baseUrl = `${this.apiURLShifts}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  /* ------------------ DESCANSOS ------------------ */
  /* Crear descanso para un turno */
  createBreak(
    idTurno: number,
    data: DescansoNew
  ): Observable<{ status: number; idBreak: number }> {
    const body = {
      ...(data.idTurno !== undefined &&
        data.idTurno !== null && {
          idTurno: data.idTurno,
        }),

      ...(data.break_start !== undefined &&
        data.break_start !== null && {
          break_start: data.break_start,
        }),

      ...(data.break_end !== undefined &&
        data.break_end !== null && {
          break_end: data.break_end,
        }),

      ...(data.break_name !== undefined &&
        data.break_name !== null && {
          break_name: data.break_name,
        }),
    };

    if (Object.keys(body).length < 1) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }

    const url = `${this.apiURLShifts}/${idTurno}/breaks`;

    return this.http.post<any>(url, body, { observe: 'response' }).pipe(
      map((response) => {
        if (response.body && response.body.id_break) {
          return {
            status: response.status,
            idBreak: response.body.id_break,
          };
        }
        return {
          status: response.status,
          idBreak: -1,
        };
      })
    );
  }

  /* Eliminar descanso de un turno */
  deleteBreak(idTurno: number, idBreak: number): Observable<number> {
    const url = `${this.apiURLShifts}/${idTurno}/breaks/${idBreak}`;

    return this.http
      .delete<void>(url, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  /*  ------------------ TURNOS - ACTIVOS ------------------ */
  /*
  {
    "counter": 4,
    "data": [
        {
            "id_shift": 1,
            "name": "diario",
            "id_asset": 1,
            "code": "30PLA002",
            "registration_date": "2025-11-02T11:32:00.911854-03:00",
            "id_user": 1,
            "low_date": null
        }, ...
    ],
    "pagination": {
        "total_records": 4,
        "limit": 20,
        "offset": 0,
        "current_page": 1,
        "total_pages": 1
    }
  }
  */
  /* Obtener turnos activos */
  getShiftsAssets(): Observable<TurnosActivos[]> {
    const baseUrl = `${this.apiURLShiftsAssets}?status=2&limit=100`;
    return this.http.get<any>(baseUrl).pipe(
      expand((response) => {
        if (
          response?.pagination?.current_page !== undefined &&
          response?.pagination?.total_pages !== undefined &&
          response?.pagination?.limit !== undefined &&
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextOffset =
            response.pagination.current_page * response.pagination.limit;

          return this.http.get<any>(
            `${this.apiURLShifts}?offset=${nextOffset}&limit=${response.pagination.limit}`
          );
        }

        return EMPTY;
      }),

      reduce<TurnosActivos[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData: TurnosActivos[] = response.data.map(
            (item: any) => ({
              id_shift: item.id_shift,
              name: item.name,
              id_asset: item.id_asset,
              code: item.code,
              registration_date: item.registration_date,
              id_user: item.id_user,
              low_date: item.low_date,
            })
          );

          acc.push(...mappedData);
        }

        return acc;
      }, [])
    );
  }

  /* Crear turno activo */
  createShiftAssociate(
    id_turno: number,
    id_activo: number
  ): Observable<number> {
    const baseUrl = `${this.apiURLShifts}/${id_turno}/associate/${id_activo}`;

    const body = id_activo > 0 ? [{ id_activo: id_activo }] : [];

    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  /* Borrar turno activo */
  deleteShiftAssociate(
    id_turno: number,
    id_activo: number
  ): Observable<number> {
    const baseUrl = `${this.apiURLShifts}/${id_turno}/associate/${id_activo}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }
}
