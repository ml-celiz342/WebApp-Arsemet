import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NuevoUsuario, Usuarios } from '../../../../models/usuarios';

@Component({
  selector: 'app-usuarios-agregar',
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
  ],
  templateUrl: './usuarios-agregar.component.html',
  styleUrl: './usuarios-agregar.component.css',
})
export class UsuariosAgregarComponent {
  isEditMode: boolean = false;
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  rol: number = -1;
  contrasenea: string = '';
  contraseneaR: string = '';

  tiposRoles: any = [];
  usuarioAnterior?: Usuarios;

  hideContrasenea = signal(true);
  hideRContrasenea = signal(true);

  validationErrors: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<UsuariosAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode || false;
    this.tiposRoles = data.roles || [];
    if (this.isEditMode && data.usuario) {
      this.usuarioAnterior = data.usuario;
      if (this.usuarioAnterior) {
        this.nombre = this.usuarioAnterior.nombre;
        this.apellido = this.usuarioAnterior.apellido;
        this.email = this.usuarioAnterior.email;
        this.rol = this.usuarioAnterior.rol_id;
      }
    }
  }

  clickEventHideContrasenea(event: MouseEvent) {
    this.hideContrasenea.set(!this.hideContrasenea());
    event.stopPropagation();
  }

  clickEventRHideContrasenea(event: MouseEvent) {
    this.hideRContrasenea.set(!this.hideRContrasenea());
    event.stopPropagation();
  }

  validatePassword() {
    const errors = [];

    if (this.contrasenea.length < 12 || this.contrasenea.length > 32) {
      errors.push('Debe tener entre 12 y 32 caracteres.');
    }
    if (!/[a-z]/.test(this.contrasenea)) {
      errors.push('Debe contener al menos una letra minúscula.');
    }
    if (!/[A-Z]/.test(this.contrasenea)) {
      errors.push('Debe contener al menos una letra mayúscula.');
    }
    if (!/\d/.test(this.contrasenea)) {
      errors.push('Debe contener al menos un número.');
    }
    if (!/[$@$!%*?&_]/.test(this.contrasenea)) {
      errors.push('Debe contener al menos un carácter especial ($@$!%*?&_).');
    }

    this.validationErrors = errors;
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarUsuario(): void {
    if (
      this.nombre != '' &&
      this.apellido != '' &&
      this.email != '' &&
      this.rol != -1
    ) {
      var nuevoUsuario: NuevoUsuario = {};
      if (this.isEditMode) {
        if (this.nombre != this.usuarioAnterior?.nombre) {
          nuevoUsuario.nombre = this.nombre;
        }
        if (this.apellido != this.usuarioAnterior?.apellido) {
          nuevoUsuario.apellido = this.apellido;
        }
        if (this.rol != this.usuarioAnterior?.rol_id) {
          nuevoUsuario.rol_id = this.rol;
        }
      } else {
        if (
          this.contrasenea != this.contraseneaR ||
          this.contrasenea == '' ||
          this.validationErrors.length !=0
        ) {
          return;
        }
        nuevoUsuario.nombre = this.nombre;
        nuevoUsuario.apellido = this.apellido;
        nuevoUsuario.email = this.email;
        nuevoUsuario.contrasenea = this.contrasenea;
        nuevoUsuario.rol_id = this.rol;
      }
      this.dialogRef.close(nuevoUsuario); // Devuelve el objeto con los datos
      return;
    }
    this.dialogRef.close();
  }
}
