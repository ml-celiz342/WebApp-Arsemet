import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-analiticas-configurar',
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
  templateUrl: './analiticas-configurar.component.html',
  styleUrl: './analiticas-configurar.component.css',
})
export class AnaliticasConfigurarComponent {
  camposAnterior?: { [key: string]: any };
  camposActual: { [key: string]: any } = {};

  ignoredFields: string[] = [
    'id',
    'id_usuario_actualizacion',
    'fecha_actualizacion',
  ];

  objectKeys = Object.keys;

  constructor(
    public dialogRef: MatDialogRef<AnaliticasConfigurarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.campos) {
      this.camposActual = structuredClone(data.campos);
      this.camposAnterior = structuredClone(data.campos);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  shouldIgnoreField(key: string): boolean {
    return this.ignoredFields.includes(key);
  }

  isBoolean(key: string): boolean {
    return typeof this.camposAnterior?.[key] === 'boolean';
  }

  isNumber(key: string): boolean {
    return typeof this.camposAnterior?.[key] === 'number';
  }

  onNumberChange(key: string, valor: any) {
    this.camposActual[key] =
      valor !== '' && valor !== null ? Number(valor) : null;
  }

  obtenerCamposModificados(
    anterior: { [key: string]: any },
    actual: { [key: string]: any },
    ignorar: string[]
  ) {
    const modificados: { [key: string]: any } = {};

    for (const key of Object.keys(anterior)) {
      if (ignorar.includes(key)) continue;

      if (anterior[key] !== actual[key]) {
        modificados[key] = actual[key];
      }
    }

    return modificados;
  }

  guardarAnalitica(): void {
    if (this.camposAnterior) {
      const nuevosValores = this.obtenerCamposModificados(
        this.camposAnterior,
        this.camposActual,
        this.ignoredFields
      );
      if (Object.keys(nuevosValores).length > 0) {
        this.dialogRef.close(this.camposActual);
        return;
      }
    }
    this.dialogRef.close();
  }
}
