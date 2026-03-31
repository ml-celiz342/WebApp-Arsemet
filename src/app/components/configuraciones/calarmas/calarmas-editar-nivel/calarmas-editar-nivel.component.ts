import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Para usar ngModel
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {  AlarmLevel, UpdateAlarmLevel } from '../../../../models/alarmas';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-calarmas-editar-nivel',
  imports: [
    CommonModule,
    MatInputModule,
    MatOptionModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  templateUrl: './calarmas-editar-nivel.component.html',
  styleUrl: './calarmas-editar-nivel.component.css',
})
export class CalarmasEditarNivelComponent {
  nombre: string = '';
  intervalo: number = 0;

  AlarmLevelAnterior?: AlarmLevel;

  constructor(
    public dialogRef: MatDialogRef<CalarmasEditarNivelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (data.level) {
      this.AlarmLevelAnterior = data.level;
      if (this.AlarmLevelAnterior) {
        this.nombre = this.AlarmLevelAnterior.nombre;
        this.intervalo = this.AlarmLevelAnterior.intervalo;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarAlarmLevel(): void {
    if (
      this.intervalo
    ) {
      const nuevaAlarmLevel: Partial<UpdateAlarmLevel> = {};

        if (this.intervalo !== this.AlarmLevelAnterior?.intervalo) {
          nuevaAlarmLevel.intervalo = this.intervalo !== null
              ? Number(this.intervalo)
              : undefined;
        }

      this.dialogRef.close(nuevaAlarmLevel);
      return;
    }

    this.dialogRef.close();
  }
}
