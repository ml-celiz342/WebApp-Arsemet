import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-usuarios-clave',
  imports: [
    CommonModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  templateUrl: './usuarios-clave.component.html',
  styleUrl: './usuarios-clave.component.css',
})
export class UsuariosClaveComponent {
  contrasenea: string = '';
  contraseneaR: string = '';

  hideContrasenea = signal(true);
  hideRContrasenea = signal(true);

  validationErrors: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<UsuariosClaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  clickEventHideContrasenea(event: MouseEvent) {
    this.hideContrasenea.set(!this.hideContrasenea());
    event.stopPropagation();
  }

  clickEventRHideContrasenea(event: MouseEvent) {
    this.hideRContrasenea.set(!this.hideRContrasenea());
    event.stopPropagation();
  }

  close(): void {
    this.dialogRef.close();
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

  guardarContrasenea(): void {
    if (this.contrasenea != this.contraseneaR || this.contrasenea == '' || this.validationErrors.length !=0) {
      return;
    }
    this.dialogRef.close(this.contrasenea);
  }
}
