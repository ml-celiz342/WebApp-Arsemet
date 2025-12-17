import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ModeloDispositivo,
  NewModeloDispositivo,
} from '../../../../models/devices';

@Component({
  selector: 'app-modelos-dispositivos-agregar',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './modelos-dispositivos-agregar.component.html',
  styleUrl: './modelos-dispositivos-agregar.component.css',
})
export class ModelosDispositivosAgregarComponent {
  nombre: string = '';
  template: string = '';
  modeloAnterior?: ModeloDispositivo;

  constructor(
    public dialogRef: MatDialogRef<ModelosDispositivosAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.tipo) {
      this.modeloAnterior = data.tipo;
      if (this.modeloAnterior) {
        this.nombre = this.modeloAnterior.nombre;
        this.template = JSON.stringify(this.modeloAnterior.template);
      }
    }
  }
  close(): void {
    this.dialogRef.close();
  }

  guardarModeloDispositivo(): void {
    if (this.nombre && this.template) {
      var nuevoModelo: NewModeloDispositivo = {};
      nuevoModelo.nombre = this.nombre;
      nuevoModelo.template = JSON.parse(this.template);

      this.dialogRef.close(nuevoModelo);
      return;
    }
  }
}
