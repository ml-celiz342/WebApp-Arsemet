import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NuevoOperario, Operarios } from '../../../../models/operarios';

@Component({
  selector: 'app-operario-agregar',
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
  templateUrl: './operario-agregar.component.html',
  styleUrl: './operario-agregar.component.css',
})
export class OperarioAgregarComponent {
  isEditMode: boolean = false;

  nombre: string = '';
  apellido: string = '';
  identificador: string = '';
  rfid: number = 0;
  sector: number = 0;

  operarioAnterior?: Operarios;

  sectores: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<OperarioAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode || false;
    this.sectores = this.data.opcionesSectores;
    if (this.isEditMode && data.operario) {
      this.operarioAnterior = data.operario;
      if (this.operarioAnterior) {
        this.nombre = this.operarioAnterior.nombre;
        this.apellido = this.operarioAnterior.apellido;
        this.identificador = this.operarioAnterior.identificador;
        this.rfid = this.operarioAnterior.rfid;
        this.sector = this.operarioAnterior.id_sector;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarOperario(): void {
    if (this.rfid && this.rfid > 0 && this.sector) {
      var nuevoOperario: NuevoOperario = {};
      if (this.isEditMode) {
        if (this.nombre != this.operarioAnterior?.nombre) {
          nuevoOperario.nombre = this.nombre;
        }
        if (this.apellido != this.operarioAnterior?.apellido) {
          nuevoOperario.apellido = this.apellido;
        }
        if (this.identificador != this.operarioAnterior?.identificador) {
          nuevoOperario.identificador = this.identificador;
        }
        if (this.rfid != this.operarioAnterior?.rfid) {
          nuevoOperario.rfid = Number(this.rfid);
        }
        if (this.sector != this.operarioAnterior?.id_sector) {
          nuevoOperario.idSector = this.sector;
        }
      } else {
        nuevoOperario.nombre = this.nombre;
        nuevoOperario.apellido = this.apellido;
        nuevoOperario.identificador = this.identificador;
        nuevoOperario.rfid = Number(this.rfid);
        nuevoOperario.idSector = this.sector;
      }
      this.dialogRef.close(nuevoOperario); // Devuelve el objeto con los datos
      return;
    }
    this.dialogRef.close();
  }
}
