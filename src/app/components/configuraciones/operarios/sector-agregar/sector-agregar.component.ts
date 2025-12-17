import { Component, Inject } from '@angular/core';
import { NuevoSector, Sector } from '../../../../models/sector';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-sector-agregar',
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sector-agregar.component.html',
  styleUrl: './sector-agregar.component.css',
})
export class SectorAgregarComponent {
  isEditMode: boolean = false;

  nombre: string = '';

  sectorAnterior?: Sector;

  constructor(
    public dialogRef: MatDialogRef<SectorAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode || false;
    if (this.isEditMode && data.sector) {
      this.sectorAnterior = data.sector;
      if (this.sectorAnterior) {
        this.nombre = this.sectorAnterior.nombre;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarSector(): void {
    if ( this.nombre) {
      var NuevoSector: NuevoSector = {};
      if (this.isEditMode) {
        if (this.nombre != this.sectorAnterior?.nombre) {
          NuevoSector.nombre = this.nombre;
        }
      } else {
        NuevoSector.nombre = this.nombre;
      }
      this.dialogRef.close(NuevoSector); // Devuelve el objeto con los datos
      return;
    }
    this.dialogRef.close();
  }
}
