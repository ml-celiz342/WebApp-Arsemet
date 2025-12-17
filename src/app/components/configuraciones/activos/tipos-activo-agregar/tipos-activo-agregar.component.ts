import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-tipos-activo-agregar',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './tipos-activo-agregar.component.html',
  styleUrl: './tipos-activo-agregar.component.css',
})
export class TiposActivoAgregarComponent {
  nombre: string = '';

  isEditMode: boolean = false;
  nombreAnterior: string = '';

  constructor(
    public dialogRef: MatDialogRef<TiposActivoAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode || false;
    if (this.isEditMode && data.nombre) {
      this.nombreAnterior = data.nombre;
      this.nombre = data.nombre;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarActivo(): void {
    if (this.nombre && this.nombre != '') {
      if (this.isEditMode) {
        if (this.nombre == this.nombreAnterior) {
          this.dialogRef.close();
          return;
        }
      }
      this.dialogRef.close(this.nombre);
      return;
    }
    this.dialogRef.close();
  }
}
