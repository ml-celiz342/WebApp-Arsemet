import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private apiURLPdf = environment.apiUrl + 'data/parts/'; // Base de la API

  constructor(private http: HttpClient) {}

  getPdf(id_part: number): Observable<string> {
    const timestamp = new Date().getTime();
    const pdfUrl = `${this.apiURLPdf}${id_part}/plan?_=${timestamp}`;

    return this.http.get(pdfUrl, { responseType: 'blob' }).pipe(
      map((blob: Blob) => URL.createObjectURL(blob)), // Creamos ObjectURL
      catchError((error) => {
        console.error('Error al cargar el PDF:', error);
        return throwError(() => new Error('No se pudo cargar el PDF.'));
      })
    );
  }
}
