import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImgService {
  private apiURLImg = environment.apiUrl + 'data/img/';

  constructor(private http: HttpClient) {}

  getImgEvidencia(img_nombre: string, numero_serie: string): Observable<string> {
    const timestamp = new Date().getTime();
    const imageUrl = `${this.apiURLImg}${img_nombre}/${numero_serie}?_=${timestamp}`;

    return this.http.get(imageUrl, { responseType: 'blob' }).pipe(
      map((blob: Blob) => URL.createObjectURL(blob)), // Convertimos a objectURL
      catchError((error) => {
        console.error('Error al cargar la imagen:', error);
        return throwError(() => new Error('No se pudo cargar la imagen.'));
      })
    );
  }
}
