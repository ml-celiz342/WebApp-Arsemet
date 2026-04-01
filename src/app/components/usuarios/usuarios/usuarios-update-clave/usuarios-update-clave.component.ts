import { Component, Inject } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  titulo: string;
  mensaje: string;
  detalle?: string;
  icono?: string; // opcional
}

@Component({
  selector: 'app-usuarios-update-clave',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './usuarios-update-clave.component.html',
  styleUrl: './usuarios-update-clave.component.css',
})
export class UsuariosUpdateClaveComponent {
  constructor(
    public dialogRef: MatDialogRef<UsuariosUpdateClaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}

  cancelar() {
    this.dialogRef.close(false);
  }

  aceptar() {
    this.dialogRef.close(true);
  }
}
