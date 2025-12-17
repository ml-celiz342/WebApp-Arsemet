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
import { Modulos, NewModulo } from '../../../../models/modulos';

@Component({
  selector: 'app-modulos-agregar',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './modulos-agregar.component.html',
  styleUrl: './modulos-agregar.component.css',
})
export class ModulosAgregarComponent {
  nombre: string = '';
  moduloAnterior?: Modulos;

  constructor(
    public dialogRef: MatDialogRef<ModulosAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  close(): void {
    this.dialogRef.close();
  }

  guardarModulo(): void {
    if (this.nombre) {
      var nuevoModulo: NewModulo = {};
      nuevoModulo.nombre = this.nombre;

      this.dialogRef.close(nuevoModulo);
      return;
    }
    this.dialogRef.close();
  }
}
