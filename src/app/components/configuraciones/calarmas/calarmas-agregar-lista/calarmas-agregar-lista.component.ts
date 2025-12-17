import { Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Para usar ngModel
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AlarmaList, NewAlarmaList } from '../../../../models/alarmas';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-calarmas-agregar-lista',
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
  templateUrl: './calarmas-agregar-lista.component.html',
  styleUrl: './calarmas-agregar-lista.component.css',
})
export class CalarmasAgregarListaComponent {
  nombre: string = '';
  alias: string = '';
  estado: boolean = false;
  id_origen: number = 0;
  id_nivel_alarma: number = 0;
  isEditMode: boolean = false;

  AlarmListAnterior?: AlarmaList;

  tiposOrigen: any[] = [];
  tiposNivel: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CalarmasAgregarListaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode || false;
    this.tiposOrigen = data.opcionesOrigen || [];
    this.tiposNivel = data.opcionesNivel || [];

    if (this.isEditMode && data.alarmList) {
      this.AlarmListAnterior = data.alarmList;
      if (this.AlarmListAnterior) {
        this.nombre = this.AlarmListAnterior.nombre;
        this.alias = this.AlarmListAnterior.alias;
        this.estado = this.AlarmListAnterior.estado;
        this.id_origen = this.AlarmListAnterior.id_origen;
        this.id_nivel_alarma = this.AlarmListAnterior.id_nivel_alarma;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarAlarmList(): void {
    if (
      this.nombre &&
      this.alias &&
      this.id_origen &&
      this.id_nivel_alarma >= 0
    ) {
      const nuevaAlarmList: Partial<NewAlarmaList> = {};

      if (this.isEditMode) {
        if (this.nombre !== this.AlarmListAnterior?.nombre) {
          nuevaAlarmList.nombre = this.nombre;
        }
        if (this.alias !== this.AlarmListAnterior?.alias) {
          nuevaAlarmList.alias = this.alias;
        }
        if (this.estado !== this.AlarmListAnterior?.estado) {
          nuevaAlarmList.estado = this.estado;
        }
        if (this.id_origen !== this.AlarmListAnterior?.id_origen) {
          nuevaAlarmList.id_origen = this.id_origen;
        }
        if (this.id_nivel_alarma !== this.AlarmListAnterior?.id_nivel_alarma) {
          nuevaAlarmList.id_nivel_alarma = this.id_nivel_alarma;
        }
      } else {
        nuevaAlarmList.nombre = this.nombre;
        nuevaAlarmList.alias = this.alias;
        nuevaAlarmList.estado = this.estado;
        nuevaAlarmList.id_origen = this.id_origen;
        nuevaAlarmList.id_nivel_alarma = this.id_nivel_alarma;
      }

      this.dialogRef.close(nuevaAlarmList);
      return;
    }

    this.dialogRef.close();
  }
}
