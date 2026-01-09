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
import {
  MAT_TIMEPICKER_CONFIG,
  MatTimepickerModule,
} from '@angular/material/timepicker';

@Component({
  selector: 'app-descansos-agregar',
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
    MatTimepickerModule,
  ],
  providers: [
    {
      provide: MAT_TIMEPICKER_CONFIG,
      useValue: { interval: '15m' },
    },
  ],
  templateUrl: './descansos-agregar.component.html',
  styleUrls: ['./descansos-agregar.component.css'],
})
export class DescansosAgregarComponent {
  break_name: string = '';
  break_start: Date | null = null;
  break_end: Date | null = null;

  idTurno: number;

  constructor(
    public dialogRef: MatDialogRef<DescansosAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idTurno: number }
  ) {
    this.idTurno = data.idTurno;
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarDescanso(): void {
    if (!this.break_name || !this.break_start || !this.break_end) return;

    const descanso: any = {
      idTurno: this.idTurno,
      break_name: this.break_name,
      break_start: this.dateToISOStringWithMinus3(this.break_start),
      break_end: this.dateToISOStringWithMinus3(this.break_end),
    };

    this.dialogRef.close(descanso);
  }

  /* Forza la zona horaria con el -3 */
  private dateToISOStringWithMinus3(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `0000-01-01T${hours}:${minutes}:${seconds}-03:00`;
  }
}
