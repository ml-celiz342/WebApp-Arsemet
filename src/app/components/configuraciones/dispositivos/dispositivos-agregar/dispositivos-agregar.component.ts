import { Component, Inject, OnInit } from '@angular/core';
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
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Devices, NewDevice } from '../../../../models/devices';

@Component({
  selector: 'app-dispositivos-agregar',
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
  ],
  templateUrl: './dispositivos-agregar.component.html',
  styleUrl: './dispositivos-agregar.component.css',
})
export class DispositivosAgregarComponent {
  numero_serie: string = '';
  tipoModelo: number = -1;
  manifiesto: string = '';
  isEditMode: boolean = false;
  tiposModelos: any[] = [];
  tipoServicios: any[] = [];
  tipoServicio: number = -1;
  dispositivoAnterior?: Devices;

  constructor(
    public dialogRef: MatDialogRef<DispositivosAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode || false;
    this.tiposModelos = this.data.opcionesDisposotivos;
    this.tipoServicios = this.data.opcionesServicios;
    if (this.isEditMode && data.dispositivo) {
      this.dispositivoAnterior = data.dispositivo;
      if (this.dispositivoAnterior) {
        this.numero_serie = this.dispositivoAnterior.numero_serie;
        this.manifiesto = JSON.stringify(
          this.dispositivoAnterior.manifiesto_arq
        );
        this.tipoModelo = this.dispositivoAnterior.id_model;
        this.tipoServicio = this.dispositivoAnterior.id_code_service;
      }
    }
  }

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }

  seleccionarModelo(event: MatSelectChange) {
    this.manifiesto = JSON.stringify(
      this.tiposModelos.find((item) => item.id == event.value).template
    );
  }

  guardarDispositivo(): void {
    if (this.numero_serie && this.tipoModelo) {
      var nuevoDispositivo: NewDevice = {};
      if (this.isEditMode) {
        if (this.numero_serie != this.dispositivoAnterior?.numero_serie) {
          nuevoDispositivo.numero_serie = this.numero_serie;
        }
        if (this.tipoModelo != this.dispositivoAnterior?.id_model) {
          nuevoDispositivo.id_model = this.tipoModelo;
        }
        if (this.tipoServicio != this.dispositivoAnterior?.id_code_service){
          nuevoDispositivo.id_code_service = this.tipoServicio;
        }
        if (
          this.manifiesto !=
          JSON.stringify(this.dispositivoAnterior?.manifiesto_arq)
        ) {
          nuevoDispositivo.manifiesto_arq = JSON.parse(this.manifiesto);
        }
      } else {
        nuevoDispositivo.numero_serie = this.numero_serie;
        nuevoDispositivo.id_model = this.tipoModelo;
        nuevoDispositivo.id_code_service = this.tipoServicio;
        nuevoDispositivo.manifiesto_arq = JSON.parse(this.manifiesto);
      }
      this.dialogRef.close(nuevoDispositivo); // Devuelve el objeto con los datos
      return;
    }
    this.dialogRef.close();
  }
}
