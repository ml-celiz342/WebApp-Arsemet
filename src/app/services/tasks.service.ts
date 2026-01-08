import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, expand, Observable, reduce} from 'rxjs';
import {Tarea} from '../models/tasks';


@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiURLTasks = environment.apiUrl + 'data/tasks';

  constructor(private http: HttpClient) {}

  // Obtener todas las tareas
  getTasks(
    desde: string,
    hasta: string,
    id_activos: number[],
  ): Observable<Tarea[]> {
    let params = new HttpParams();

    if (desde) {
      params = params.set('from', desde);
    }

    if (hasta) {
      params = params.set('to', hasta);
    }

    if (id_activos && id_activos.length > 0) {
      id_activos.forEach((id) => {
        params = params.append('id_asset', id.toString());
      });
    }

    params = params.set('limit', 100);

    return this.http.get<any>(this.apiURLTasks, { params }).pipe(
      expand((response) => {
        if (
          response?.pagination?.current_page !== undefined &&
          response?.pagination?.total_pages !== undefined &&
          response?.pagination?.limit !== undefined &&
          response.pagination.current_page < response.pagination.total_pages
        ) {
          const nextOffset =
            response.pagination.current_page * response.pagination.limit;
          const nextParams = params.set('offset', nextOffset.toString());
          return this.http.get<any>(this.apiURLTasks, {
            params: nextParams,
          });
        }
        return EMPTY;
      }),
      reduce<Tarea[], any>((acc, response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray(response.data)
        ) {
          const mappedData = response.data.map(
            (item: any): Tarea => ({
              id: item.id,

              // Relaciones
              id_asset: item.id_asset,
              id_data_csv: item.id_data_csv,

              // Ciclo
              cycle_start_est: item.cycle_start_est
                ? new Date(item.cycle_start_est)
                : null,
              cycle_end: item.cycle_end ? new Date(item.cycle_end) : null,
              cycle_duration: item.cycle_duration ?? null,

              // Lote
              batch_weight: item.batch_weight ?? null,

              // Piezas
              planned_qty: item.planned_qty ?? null,
              good_qty: item.good_qty ?? null,
              bad_qty: item.bad_qty ?? null,
              part_length: item.part_length ?? null,
              part_width: item.part_width ?? null,
              part_weight: item.part_weight ?? null,
              user_qty: item.user_qty ?? null,

              // Material
              material_thickness: item.material_thickness ?? null,
              material_description: item.material_description ?? null,

              // Artículo
              article_code: item.article_code,

              // Usuarios
              system_user: item.system_user ?? null,

              // Plegado
              people_count: item.people_count ?? null,
              hits_count: item.hits_count ?? null,
              tool_change_count: item.tool_change_count ?? null,
            })
          );

          acc.push(...mappedData);
        }
        return acc;
      }, [])
    );
  }

  /*
  // Obtener tarea por id?
  getTaskById(id: number): Observable<TareaOperario> {
    const url = `${this.apiURLTasks}/${id}`;
    return this.http.get<TareaOperario>(url).pipe(
      map((item) => ({
        id_task: item.id_task,
        quantity: item.quantity,
        detail: item.detail,
        start: item.start,
        end: item.end,
        load_date: item.load_date,
        update_date: item.update_date,
        id_asset: item.id_asset,
        id_part: item.id_part,
        id_user: item.id_user,

        // Campos JOIN necesarios para cumplir la interfaz
        asset_code: item.asset_code,
        asset_observation: item.asset_observation,
        part_code: item.part_code,
        part_name: item.part_name,
        user_email: item.user_email,
        user_name: item.user_name,
        user_lastname: item.user_lastname,
      }))
    );
  }

  // Crear tarea
  createTask(
    data: NewTareaOperario
  ): Observable<{ status: number; idTask: number }> {
    const baseUrl = `${this.apiURLTasks}`;
    const body = {
      ...(data.quantity !== undefined &&
        data.quantity > 0 && {
          quantity: data.quantity,
        }),
      ...(data.detail !== undefined &&
        data.detail !== '' && {
          detail: data.detail,
        }),
      ...(data.start !== undefined &&
        data.start !== null && {
          start: data.start,
        }),
      ...(data.end !== undefined && {
        end: data.end,
      }),
      ...(data.id_asset !== undefined &&
        data.id_asset > 0 && {
          id_asset: data.id_asset,
        }),
      ...(data.id_part !== undefined &&
        data.id_part > 0 && {
          id_part: data.id_part,
        }),
      ...(data.id_user !== undefined &&
        data.id_user > 0 && {
          id_user: data.id_user,
        }),
    };

    if (Object.keys(body).length < 6 || Object.keys(body).length > 8) {
      return throwError(
        () => new Error('El cuerpo de la solicitud está incompleto')
      );
    }

    return this.http.post<any>(baseUrl, body, { observe: 'response' }).pipe(
      map((response) => {
        if (response.body && response.body.id_task) {
          return {
            status: response.status,
            idTask: response.body.id_task,
          };
        }
        return {
          status: response.status,
          idTask: -1,
        };
      })
    );
  }

  // Actualizar tarea
  updateTask(data: TareaOperarioUpdate, id: number): Observable<number> {
    const baseUrl = `${this.apiURLTasks}/${id}`;

    const body = {
      ...(data.quantity !== undefined &&
        data.quantity > 0 && {
          quantity: data.quantity,
        }),
      ...(data.detail !== undefined &&
        data.detail !== '' && {
          detail: data.detail,
        }),
      ...(data.start !== undefined &&
        data.start !== null && {
          start: data.start,
        }),
      ...(data.end !== undefined && {
        end: data.end,
      }),
      ...(data.id_asset !== undefined &&
        data.id_asset > 0 && {
          id_asset: data.id_asset,
        }),
      ...(data.id_part !== undefined &&
        data.id_part > 0 && {
          id_part: data.id_part,
        }),
      ...(data.id_user !== undefined &&
        data.id_user > 0 && {
          id_user: data.id_user,
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

  // Borrar tarea
  deleteTask(id: number): Observable<number> {
    const baseUrl = `${this.apiURLTasks}/${id}`;
    return this.http
      .delete<void>(baseUrl, { observe: 'response' })
      .pipe(map((response) => response.status));
  }
  */
}
