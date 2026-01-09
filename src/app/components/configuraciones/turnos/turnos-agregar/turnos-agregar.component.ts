import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  MAT_TIMEPICKER_CONFIG,
  MatTimepickerModule,
} from '@angular/material/timepicker';

import { Shift} from '../../../../models/shift';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-turnos-agregar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTimepickerModule,
    MatCheckboxModule,
  ],
  providers: [
    {
      provide: MAT_TIMEPICKER_CONFIG,
      useValue: { interval: '15m' },
    },
  ],
  templateUrl: './turnos-agregar.component.html',
  styleUrl: './turnos-agregar.component.css',
})
export class TurnosAgregarComponent {
  nombre: string = '';
  inicio: Date | null = null;
  fin: Date | null = null;

  monday = false;
  tuesday = false;
  wednesday = false;
  thursday = false;
  friday = false;
  saturday = false;
  sunday = false;

  isEditMode = false;
  turnoAnterior?: Shift;

  constructor(
    public dialogRef: MatDialogRef<TurnosAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode || false;

    if (this.isEditMode && data.turno) {
      this.turnoAnterior = data.turno;

      this.nombre = data.turno.name;

      this.inicio = this.parseISOWithMinus3(data.turno.start);
      this.fin = this.parseISOWithMinus3(data.turno.end);

      this.monday = !!data.turno.monday;
      this.tuesday = !!data.turno.tuesday;
      this.wednesday = !!data.turno.wednesday;
      this.thursday = !!data.turno.thursday;
      this.friday = !!data.turno.friday;
      this.saturday = !!data.turno.saturday;
      this.sunday = !!data.turno.sunday;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarTurno(): void {
    if (!this.nombre || !this.inicio || !this.fin) return;

    const turno: any = {
      name: this.nombre,
      start: this.dateToISOStringWithMinus3(this.inicio),
      end: this.dateToISOStringWithMinus3(this.fin),
      monday: this.monday,
      tuesday: this.tuesday,
      wednesday: this.wednesday,
      thursday: this.thursday,
      friday: this.friday,
      saturday: this.saturday,
      sunday: this.sunday,
    };

    this.dialogRef.close(turno);
  }

  /* Mostrar hora correctamente en el timepicker */
  private parseISOWithMinus3(isoString: string): Date {
    // isoString ejemplo: "0000-01-01T07:00:00-03:00"
    const match = isoString.match(/T(\d{2}):(\d{2}):(\d{2})/);
    if (!match) return new Date();
    const [, h, m, s] = match.map(Number);
    const d = new Date();
    d.setHours(h, m, s, 0); // fuerza hora local sin corrimiento
    return d;
  }

  /* Forza la zona horaria con el -3 */
  private dateToISOStringWithMinus3(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `0000-01-01T${hours}:${minutes}:${seconds}-03:00`;
  }
}
