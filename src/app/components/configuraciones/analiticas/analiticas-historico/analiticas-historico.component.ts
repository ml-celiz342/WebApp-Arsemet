import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-analiticas-historico',
  imports: [CommonModule, MatDialogModule, MatExpansionModule, MatButtonModule],
  templateUrl: './analiticas-historico.component.html',
  styleUrl: './analiticas-historico.component.css',
})
export class AnaliticasHistoricoComponent {
  configs: { [key: string]: any }[] = [];

  objectKeys = Object.keys;

  constructor(
    public dialogRef: MatDialogRef<AnaliticasHistoricoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.campos && data.campos.length !=0) {
      this.configs = data.campos;
    }else{
      this.dialogRef.close();
    }
  }

  getKeys(obj: { [key: string]: any }): string[] {
    return Object.keys(obj).filter((k) => k !== 'fecha_actualizacion');
  }

  obtenerTitulo(cabecera: { [key: string]: any }): string {
    if (cabecera['fecha_actualizacion']) {
      const fecha = new Date(cabecera['fecha_actualizacion']);
      return fecha.toString();
    }
    return 'No disponible';
  }

  close(): void {
    this.dialogRef.close();
  }
}
