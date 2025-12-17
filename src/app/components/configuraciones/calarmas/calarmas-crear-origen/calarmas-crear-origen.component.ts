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
import { AlarmSource, NewAlarmSource } from '../../../../models/alarmas';


@Component({
  selector: 'app-calarmas-crear-origen',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './calarmas-crear-origen.component.html',
  styleUrl: './calarmas-crear-origen.component.css',
})
export class CalarmasCrearOrigenComponent {
  nombre: string = '';
  origenAnterior?: AlarmSource;

  constructor(
    public dialogRef: MatDialogRef<CalarmasCrearOrigenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  guardarOrigen(): void {
    if (this.nombre) {
      var nuevoOrigen: NewAlarmSource = {};
      nuevoOrigen.nombre = this.nombre;

      this.dialogRef.close(nuevoOrigen);
      return;
    }
    this.dialogRef.close();
  }
}

