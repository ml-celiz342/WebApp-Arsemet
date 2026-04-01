import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  NuevoUsuario,
  Usuarios,
  UsuariosVerificados,
} from '../models/usuarios';
import { EMPTY, expand, map, Observable, reduce, throwError } from 'rxjs';

export interface PasswordTemporalResponse {
  result: string;
  password?: string;
}

export interface VerifiedUserEmailTemporalResponse {
  result: string;
  expira?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiURLUsers = environment.apiUrl + 'users';
  private apiURLIam = environment.apiUrl + 'iam';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuarios[]> {
    const baseUrl = `${this.apiURLUsers}?status=2&limit=100`;
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
      reduce<Usuarios[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_user,
            nombre: item.name,
            apellido: item.last_name,
            email: item.email,
            rol: item.role.type,
            rol_id: item.role.id_role,
            renovar_contrasenea: item.renew_password,
            fecha_alta: item.registration_date,
            fecha_baja: item.low_date,
            fecha_actualizacion: item.update_date,
            email_confirmado: item.confirmed_email,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, []),
    );
  }

  deleteUsuario(id: number): Observable<number> {
    const baseUrl = `${this.apiURLUsers}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createUsuario(data: NuevoUsuario): Observable<number> {
    const baseUrl = `${this.apiURLUsers}`;
    const body = {
      ...(data.email !== undefined && { email: data.email }),
      ...(data.nombre !== undefined && { name: data.nombre }),
      ...(data.apellido !== undefined && { last_name: data.apellido }),
      ...(data.contrasenea !== undefined && { password: data.contrasenea }),
      ...(data.rol_id !== undefined && { id_role: data.rol_id }),
    };
    if (Object.keys(body).length != 5) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío'),
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  updateUsuario(data: NuevoUsuario, id: number): Observable<number> {
    const baseUrl = `${this.apiURLUsers}/${id}`;
    const body = {
      ...(data.nombre !== undefined && { name: data.nombre }),
      ...(data.apellido !== undefined && { last_name: data.apellido }),
      ...(data.rol_id !== undefined && { id_role: data.rol_id }),
    };
    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío'),
      );
    }
    return this.http
      .put<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  // update usuario por medio de iam
  updateIam(data: NuevoUsuario, id: number): Observable<number> {
    const baseUrl = `${this.apiURLIam}/me`;
    const body = {
      ...(data.nombre !== undefined && { name: data.nombre }),
      ...(data.apellido !== undefined && { last_name: data.apellido }),
      ...(data.email !== undefined && { email: data.email }),
    };
    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío'),
      );
    }
    return this.http
      .put<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  // update contraseña de usuario por medio de iam
  updateContraseneaUsuario(
    contrasenea: string,
    //id: number,
  ): Observable<number> {
    const baseUrl = `${this.apiURLIam}/password`; // `${this.apiURLIam}/password` `${this.apiURLUsers}/${id}/password`
    const body = {
      ...(contrasenea !== undefined &&
        contrasenea != '' && { password: contrasenea }),
    };
    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío'),
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  updateContraseneaTemporalUsuario(
    id: number,
  ): Observable<PasswordTemporalResponse> {
    const baseUrl = `${this.apiURLUsers}/${id}/password`;

    return this.http.put<PasswordTemporalResponse>(baseUrl, {});
  }

  getUsuariosVerificados(): Observable<UsuariosVerificados[]> {
    const baseUrl = `${this.apiURLUsers}/verified?limit=100`;
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
      reduce<UsuariosVerificados[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_user,
            nombre: item.name,
            apellido: item.last_name,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, []),
    );
  }

  // verificar por medio de admin
  verifiedUserEmail(id: number): Observable<VerifiedUserEmailTemporalResponse> {
    const baseUrl = `${this.apiURLUsers}/${id}/verified`;

    return this.http.post<VerifiedUserEmailTemporalResponse>(baseUrl, {});
  }

  // verificar por medio de iam
  verifiedIamEmail(): Observable<VerifiedUserEmailTemporalResponse> {
    const baseUrl = `${this.apiURLIam}/verified`;

    return this.http.post<VerifiedUserEmailTemporalResponse>(baseUrl, {});
  }

  // modificar user con email verificado
  confirmarToken(token: string): Observable<number> {
    const baseUrl = `${this.apiURLIam}/verified`;

    const body = {
      token: token,
    };

    if (!token) {
      return throwError(() => new Error('El token es requerido'));
    }

    return this.http
      .put<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }
}
