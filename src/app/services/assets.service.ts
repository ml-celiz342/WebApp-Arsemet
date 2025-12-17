import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FiltroAssets } from '../models/filtro-assets';
import { EMPTY, expand, map, Observable, reduce, tap, throwError } from 'rxjs';
import { Asset, Assets, NewAssets, TipoActivos } from '../models/assets';
import { ActivosDispositivos } from '../models/activos-dispositivos';
import { ActivosGrupos } from '../models/activos-grupos';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private apiURLAssets = environment.apiUrl + 'assets';
  private apiURLAssetsTypes = environment.apiUrl + 'assets/type';
  private apiURLAssetsAssociate = environment.apiUrl + 'assets/associate/';
  private apiURLAssetsGroup = environment.apiUrl + 'assets/group/';

  constructor(private http: HttpClient) {}

  getFiltroAssets(modeActive?: boolean): Observable<FiltroAssets[]> {
    // URL base segun el parametro modeActive
    const baseUrl = modeActive
      ? `${this.apiURLAssets}?limit=100` // true -> sin mode
      : `${this.apiURLAssets}?mode=1&limit=100`; // false o null -> con mode = 1

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
      reduce<FiltroAssets[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_asset,
            code: item.code,
            type: item.assettype.name,
            // sub activos
            subAssets: (item.sub_asset ?? []).map((sa: any) => ({
              id: sa.id_asset,
              type: sa.assettype,
            })),
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  // Get nueva estructura asset by id
  getAssetById(id: number): Observable<Asset> {
    const url = `${this.apiURLAssets}/${id}`;

    return this.http.get<any>(url).pipe(
      map((item) => ({
        id_asset: item.id_asset,
        code: item.code,
        observation: item.observation,
        registration_date: item.registration_date,
        update_date: item.update_date,
        id_user: item.id_user,
        low_date: item.low_date,
        end: item.end,

        assettype: {
          id_type: item.assettype?.id_type,
          name: item.assettype?.name,
        },

        sub_asset: (item.sub_asset ?? []).map((sa: any) => ({
          id_asset: sa.id_asset,
          code: sa.code,
          assettype: sa.assettype,
        })),
      }))
    );
  }

  getAssets(): Observable<Assets[]> {
    const baseUrl = `${this.apiURLAssets}?status=2&limit=100`;
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
      reduce<Assets[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_asset,
            code: item.code,
            observation: item.observation,
            final: item.end,
            registration_date: item.registration_date,
            low_date: item.low_date,
            id_type: item.assettype.id_type,
            type: item.assettype.name,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  deleteAsset(id: number): Observable<number> {
    const baseUrl = `${this.apiURLAssets}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createAsset(data: NewAssets): Observable<number> {
    const baseUrl = `${this.apiURLAssets}`;
    const body = {
      code: data.code,
      ...(data.observation !== undefined && { observation: data.observation }),
      id_asset_type: data.id_type,
    };
    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  updateAsset(data: NewAssets, id: number): Observable<number> {
    const baseUrl = `${this.apiURLAssets}/${id}`;
    const body = {
      ...(data.code !== undefined && { code: data.code }),
      ...(data.observation !== undefined && { observation: data.observation }),
      ...(data.id_type !== undefined && { id_asset_type: data.id_type }),
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

  //funciones de tipo de activo.
  getAssetsType(): Observable<TipoActivos[]> {
    const baseUrl = `${this.apiURLAssetsTypes}s?limit=100`;
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
      reduce<TipoActivos[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id: item.id_type,
            nombre: item.name,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  deleteAssetType(id: number): Observable<number> {
    const baseUrl = `${this.apiURLAssetsTypes}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createAssetType(nombre: string): Observable<number> {
    const baseUrl = `${this.apiURLAssetsTypes}`;
    const body = {
      ...(nombre !== undefined && nombre != '' && { name: nombre }),
    };
    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  updateAssetType(nombre: string, id: number): Observable<number> {
    const baseUrl = `${this.apiURLAssetsTypes}/${id}`;
    const body = {
      ...(nombre !== undefined && nombre != '' && { name: nombre }),
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

  //funciones de asociaicon con dispositivos
  getAssetsAssociate(): Observable<ActivosDispositivos[]> {
    const baseUrl = `${this.apiURLAssetsAssociate}?status=2&limit=100`;
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
      reduce<ActivosDispositivos[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id_activo_dispositivo: item.id_asset_device,
            id_activo: item.id_asset,
            codigo: item.code,
            id_dispositivo: item.id_device,
            numero_serie: item.serie_number,
            fecha_alta: item.registration_date,
            fecha_baja: item.low_date,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  deleteAssetAssociate(
    id_activo: number,
    numero_serie: string
  ): Observable<number> {
    const baseUrl = `${this.apiURLAssets}/${id_activo}/associate/${numero_serie}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createAssetAssociatee(
    id_activo: number,
    id_disositivo: number
  ): Observable<number> {
    const baseUrl = `${this.apiURLAssets}/${id_activo}/associate`;

    const body = id_disositivo > 0 ? [{ id_device: id_disositivo }] : [];

    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  //funciones para asociar activos entre si
  getAssetsGroup(): Observable<ActivosGrupos[]> {
    const baseUrl = `${this.apiURLAssetsGroup}?status=2&limit=100`;
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
      reduce<ActivosGrupos[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map((item) => ({
            id_grupo_funcional: item.id_functional_group,
            id_activo: item.id_asset,
            codigo: item.code,
            id_sub_activo: item.id_sub_asset,
            sub_codigo: item.subcode,
            fecha_alta: item.registration_date,
            fecha_baja: item.low_date,
            id_usuario: item.id_user,
          }));
          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  deleteAssetGroup(
    id_activo: number,
    id_sub_activo: number
  ): Observable<number> {
    const baseUrl = `${this.apiURLAssets}/${id_activo}/group/${id_sub_activo}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }

  createAssetGroup(
    id_activo: number,
    id_sub_activo: number
  ): Observable<number> {
    const baseUrl = `${this.apiURLAssets}/${id_activo}/group`;

    const body = id_sub_activo > 0 ? [{ id_sub_asset: id_sub_activo }] : [];

    if (Object.keys(body).length === 0) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está vacío')
      );
    }
    return this.http
      .post<void>(baseUrl, body, { observe: 'response' })
      .pipe(map((response) => response.status));
  }
}
