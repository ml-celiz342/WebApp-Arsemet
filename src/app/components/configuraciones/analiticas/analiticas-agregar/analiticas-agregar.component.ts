import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Analitica, NewAnalitica } from '../../../../models/analitica';

@Component({
  selector: 'app-analiticas-agregar',
  imports: [
    CommonModule,
    MatInputModule,
    MatOptionModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  templateUrl: './analiticas-agregar.component.html',
  styleUrl: './analiticas-agregar.component.css',
})
export class AnaliticasAgregarComponent {
  nombre: string = '';
  descripcion: string = '';
  ruta: string = '';
  pausada: boolean = false;

  isEditMode: boolean = false;
  analiticaAnterior?: Analitica;

  constructor(
    public dialogRef: MatDialogRef<AnaliticasAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode || false;
    if (this.isEditMode && data.analitica) {
      this.analiticaAnterior = data.analitica;
      if (this.analiticaAnterior) {
        this.nombre = this.analiticaAnterior.nombre;
        this.descripcion = this.analiticaAnterior.comentario;
        this.ruta = this.analiticaAnterior.ruta;
        this.pausada = this.analiticaAnterior.pausa;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarAnalitica(): void {
    if (this.nombre) {
      var nuevaAnalitica: NewAnalitica = {};
      if (this.isEditMode) {
        if (this.nombre != this.analiticaAnterior?.nombre) {
          nuevaAnalitica.nombre = this.nombre;
        }
        if (this.descripcion != this.analiticaAnterior?.comentario) {
          nuevaAnalitica.comentario = this.descripcion;
        }
        if (this.ruta != this.analiticaAnterior?.ruta) {
          nuevaAnalitica.ruta = this.ruta;
        }
        if (this.pausada != this.analiticaAnterior?.pausa) {
          nuevaAnalitica.pausa = this.pausada;
        }
      } else {
        nuevaAnalitica.nombre = this.nombre;
        nuevaAnalitica.pausa = this.pausada;
        if (this.ruta != '') {
          nuevaAnalitica.ruta = this.ruta;
        }
        if (this.descripcion != '') {
          nuevaAnalitica.comentario = this.descripcion;
        }
      }
      this.dialogRef.close(nuevaAnalitica); // Devuelve el objeto con los datos
      return;
    }
    this.dialogRef.close();
  }
}
