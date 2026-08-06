import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { UtilidadesService } from './utilidades.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiURLGenerateReport = environment.apiUrl + 'data/tasks/report';

  constructor(private http: HttpClient) {}

  downloadTasksCsvReport(
    desde: string,
    hasta: string,
    id_activos: number[],
  ): Observable<Blob> {
    const body: any = {};

    if (desde) {
      body.from = desde;
    }

    if (hasta) {
      body.to = hasta;
    }

    if (id_activos && id_activos.length > 0) {
      // Convertimos [1, 2] a ["1", "2"] para cumplir con el struct []string de Go
      body.asset = id_activos.map((id) => id.toString());
    }

    return this.http.post(this.apiURLGenerateReport, body, {
      responseType: 'blob',
    });
  }
}
