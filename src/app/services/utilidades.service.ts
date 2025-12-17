import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilidadesService {
  constructor() {}

  convertirSegundosAStringTime(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const seg = Math.floor(segundos % 60);

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(
      2,
      '0'
    )}:${String(seg).padStart(2, '0')}`;
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
  }

  printBoolean(value: boolean): string {
    return value ? 'Habilitado' : 'Deshabilitado';
  }

  convertirFechaString(date: Date): string {
    const pad = (n: number): string => n.toString().padStart(2, '0');

    const anio = date.getFullYear();
    const mes = pad(date.getMonth() + 1);
    const dia = pad(date.getDate());
    const hora = pad(date.getHours());
    const min = pad(date.getMinutes());
    const seg = pad(date.getSeconds());

    return `${anio}-${mes}-${dia} ${hora}:${min}:${seg}`;
  }

  convertirFechaStringDiaMes(date: Date, day: boolean): string {
    if (day) {
      return `${date.getDate().toString().padStart(2, '0')}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}`;
    }
    return `${date.getHours().toString().padStart(2, '0')}h ${date
      .getDate()
      .toString()
      .padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }
}
