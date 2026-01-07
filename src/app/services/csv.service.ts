import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  private apiURL = environment.apiUrl + 'data/csv';

  constructor(private http: HttpClient) {}

  uploadCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // IMPORTANTE: "file"

    return this.http.post(`${this.apiURL}`, formData);
  }
}
