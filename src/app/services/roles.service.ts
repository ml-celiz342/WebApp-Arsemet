import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NewRol, RoleModule, RoleModulePanels, RolePanels, Roles } from '../models/roles';
import { forkJoin, lastValueFrom } from 'rxjs';

import { EMPTY, expand, map, Observable, reduce, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private apiURLRoles = environment.apiUrl + 'roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Roles[]> {
    const baseUrl = `${this.apiURLRoles}?status=2&limit=100`;
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
      reduce<Roles[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            idRol: item.id_role,
            nombre: item.type,
            token_duracion: item.token_duration,
            token_cantidad: item.token_limit,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  getPermisosbyRole(id: number): Observable<RoleModulePanels> {
    const baseUrl = `${this.apiURLRoles}/${id}?limit=100`;

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
      reduce<RoleModulePanels, any>(
        (acc, response) => {
          if (
            response &&
            typeof response === 'object' &&
            'data' in response &&
            typeof response.data === 'object' &&
            !Array.isArray(response.data) &&
            response.data
          ) {
            // --- Modules ---
            if (
              'modules' in response.data &&
              Array.isArray(response.data.modules)
            ) {
              const mappedModules = response.data.modules.map((item) => ({
                idModulo: item.id_module,
                nombre: item.name,
                editar: item.edit,
                escribir: item.write,
                leer: item.read,
              }));
              acc.module.push(...mappedModules);
            }

            // --- Panels ---
            if (
              'panels' in response.data &&
              Array.isArray(response.data.panels)
            ) {
              const mappedPanels = response.data.panels.map((item) => ({
                idPanel: item.id_panel,
                nombre: item.name,
                ver: true,
              }));
              acc.panels.push(...mappedPanels);
            }
          }

          return acc;
        },
        { module: [], panels: [] }
      )
    );
  }

  createRol(data: NewRol): Observable<{ status: number; idRol: number }> {
    const baseUrl = `${this.apiURLRoles}`;
    const body = {
      ...(data.nombre !== undefined &&
        data.nombre != '' && {
          type: data.nombre,
        }),
      ...(data.token_duracion !== undefined &&
        data.token_duracion > 0 && {
          token_duration: Number(data.token_duracion),
        }),
      ...(data.token_cantidad !== undefined &&
        data.token_cantidad > 0 && {
          token_limit: Number(data.token_cantidad),
        }),
    };

    if (Object.keys(body).length != 3) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http.post<any>(baseUrl, body, { observe: 'response' }).pipe(
      map((response) => {
        if (response.body && response.body.id_role) {
          return {
            status: response.status,
            idRol: response.body.id_role,
          };
        }
        return {
          status: response.status,
          idRol: -1,
        };
      })
    );
  }

  updateRol(data: NewRol, id: number) {
    const baseUrl = `${this.apiURLRoles}/${id}`;
    const body = {
      ...(data.nombre !== undefined &&
        data.nombre != '' && {
          type: data.nombre,
        }),
      ...(data.token_duracion !== undefined &&
        data.token_duracion > 0 && {
          token_duration: Number(data.token_duracion),
        }),
      ...(data.token_cantidad !== undefined &&
        data.token_cantidad > 0 && {
          token_limit: Number(data.token_cantidad),
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

  deleteRol(id: number): Observable<number> {
    const baseUrl = `${this.apiURLRoles}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createRolModulo(data: RoleModule[], id: number): Observable<number> {
    const baseUrl = `${this.apiURLRoles}/${id}/associate`;
    const body = data.map((mod) => ({
      ...(mod.idModulo !== undefined &&
        mod.idModulo > 0 && { id_module: mod.idModulo }),
      ...(mod.editar !== undefined && { edit: mod.editar }),
      ...(mod.leer !== undefined && { read: mod.leer }),
      ...(mod.escribir !== undefined && { write: mod.escribir }),
    }));
    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  updateRolModules(id: number, modulos: RoleModule[]): Observable<number> {
    const observables = modulos.map((mod) => {
      const baseUrl = `${this.apiURLRoles}/${id}/associate/${mod.nombre}`;
      const body = {
        ...(mod.editar !== undefined && { edit: mod.editar }),
        ...(mod.leer !== undefined && { read: mod.leer }),
        ...(mod.escribir !== undefined && { write: mod.escribir }),
      };

      return this.http.put<void>(baseUrl, body, { observe: 'response' }).pipe(
        map((response) => response.status) // Solo devuelve el código de estado
      );
    });

    // Merge las respuestas de todos los módulos
    return forkJoin(observables).pipe(
      map((statuses) =>
        statuses.reduce((acc, status) => (status === 200 ? acc : status), 200)
      ) // Combina los resultados
    );
  }
  deleteRolModules(id: number, modulos: RoleModule[]): Observable<number> {
    const observables = modulos.map((mod) => {
      const baseUrl = `${this.apiURLRoles}/${id}/associate/${mod.nombre}`;

      return this.http.delete<void>(baseUrl, { observe: 'response' }).pipe(
        map((response) => response.status) // Solo devuelve el código de estado
      );
    });

    return forkJoin(observables).pipe(
      map((statuses) =>
        statuses.reduce((acc, status) => (status === 200 ? acc : status), 200)
      ) // Combina los resultados
    );
  }

  createRolPanel(data: RolePanels[], id: number): Observable<number> {
    const baseUrl = `${this.apiURLRoles}/${id}/associatepanel`;
    const body = data.map((mod) => ({
      ...(mod.idPanel !== undefined &&
        mod.idPanel > 0 && { id_panel: mod.idPanel }),
    }));
    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  deleteRolPaneles(id: number, paneles: RolePanels[]): Observable<number> {
    const observables = paneles.map((mod) => {
      const baseUrl = `${this.apiURLRoles}/${id}/associatepanel/${mod.nombre}`;

      return this.http.delete<void>(baseUrl, { observe: 'response' }).pipe(
        map((response) => response.status) // Solo devuelve el código de estado
      );
    });

    return forkJoin(observables).pipe(
      map((statuses) =>
        statuses.reduce((acc, status) => (status === 200 ? acc : status), 200)
      ) // Combina los resultados
    );
  }
}
