import { Component, Inject } from '@angular/core';
import { Servicio } from '../../../../models/servicio';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-service-codes-agregar',
  imports: [CommonModule,
      MatDialogModule,
      MatFormFieldModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatInputModule,],
  templateUrl: './service-codes-agregar.component.html',
  styleUrl: './service-codes-agregar.component.css',
})
export class ServiceCodesAgregarComponent {
  nombre: string = '';
  servicioAnterior?: Servicio;

  constructor(
    public dialogRef: MatDialogRef<ServiceCodesAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.code) {
      this.servicioAnterior = data.code;
      if (this.servicioAnterior) {
        this.nombre = this.servicioAnterior.nombre;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarServiceCode(): void {
    if (this.nombre) {

      this.dialogRef.close(this.nombre);
      return;
    }
  }
}
