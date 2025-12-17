import { Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Para usar ngModel
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Assets, NewAssets } from '../../../../models/assets';

@Component({
  selector: 'app-activos-agregar',
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
  templateUrl: './activos-agregar.component.html',
  styleUrl: './activos-agregar.component.css',
})
export class ActivosAgregarComponent {
  codigoInterno: string = '';
  observacion: string = '';
  tipoActivo: number = 0;
  isEditMode: boolean = false;

  activoAnterior?: Assets;

  tiposActivos: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ActivosAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode || false;
    this.tiposActivos = this.data.opcionesActivos;
    if (this.isEditMode && data.activo) {
      this.activoAnterior = data.activo;
      if (this.activoAnterior){
        this.codigoInterno = this.activoAnterior.code;
        this.observacion = this.activoAnterior.observation;
        this.tipoActivo = this.activoAnterior.id_type;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarActivo(): void {
    if (this.codigoInterno && this.tipoActivo) {
      var nuevoActivo: NewAssets = {};
      if(this.isEditMode){
        if(this.codigoInterno != this.activoAnterior?.code){
          nuevoActivo.code = this.codigoInterno;
        }
        if (this.tipoActivo != this.activoAnterior?.id_type) {
          nuevoActivo.id_type = this.tipoActivo;
        }
        if (this.observacion != this.activoAnterior?.observation) {
          nuevoActivo.observation = this.observacion;
        }
      }else{
        nuevoActivo.code = this.codigoInterno;
        nuevoActivo.id_type = this.tipoActivo;
        if(this.observacion != ""){
          nuevoActivo.observation = this.observacion;
        }
      }
      this.dialogRef.close(nuevoActivo); // Devuelve el objeto con los datos
      return;
    }
    this.dialogRef.close();
  }
}
