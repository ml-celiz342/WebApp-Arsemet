import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NewOperariosServicios, OperariosServicios } from '../../../../models/operarios';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-opservicio-editar',
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
  templateUrl: './opservicio-editar.component.html',
  styleUrl: './opservicio-editar.component.css',
})
export class OpservicioEditarComponent {
  usuario: string = '';
  contrasenea: string = '';
  url_login: string = '';
  url_data: string = '';
  intervalo: number = 0;

  servicioAnterior?: OperariosServicios;

  constructor(
    public dialogRef: MatDialogRef<OpservicioEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.servicio) {
      this.servicioAnterior = data.servicio;
      if (this.servicioAnterior) {
        this.usuario = this.servicioAnterior.usuario;
        this.contrasenea = this.servicioAnterior.contrasenea;
        this.url_data = this.servicioAnterior.url_data;
        this.url_login = this.servicioAnterior.url_login;
        this.intervalo = this.servicioAnterior.intervalo;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarServicio(): void {
    if (this.usuario && this.contrasenea) {
      var nuevoServicio: NewOperariosServicios = {};
      if (this.servicioAnterior) {
        if (this.usuario != this.servicioAnterior?.usuario) {
          nuevoServicio.usuario = this.usuario;
        }
        if (this.contrasenea != this.servicioAnterior?.contrasenea) {
          nuevoServicio.contrasenea = this.contrasenea;
        }
        if (this.url_data != this.servicioAnterior?.url_data) {
          nuevoServicio.url_data = this.url_data;
        }
        if (this.url_login != this.servicioAnterior?.url_login) {
          nuevoServicio.url_login = this.url_login;
        }
        if (this.intervalo != this.servicioAnterior?.intervalo) {
          nuevoServicio.intervalo = Number(this.intervalo);
        }
      } else {
        nuevoServicio.usuario = this.usuario;
        nuevoServicio.contrasenea = this.contrasenea;
        nuevoServicio.url_data = this.url_data;
        nuevoServicio.url_login = this.url_login;
        nuevoServicio.intervalo = Number(this.intervalo);
      }
      this.dialogRef.close(nuevoServicio); // Devuelve el objeto con los datos
      return;
    }
    this.dialogRef.close();
  }
}
