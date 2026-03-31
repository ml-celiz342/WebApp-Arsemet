import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlarmSource, NewAlarmSource } from '../../../../models/alarmas';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-calarmas-crear-origen',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
  templateUrl: './calarmas-crear-origen.component.html',
  styleUrl: './calarmas-crear-origen.component.css',
})
export class CalarmasCrearOrigenComponent {
  nombre: string = '';
  email: boolean = false;
  origenAnterior?: AlarmSource;
  isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CalarmasCrearOrigenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isEditMode = data.isEditMode || false;
    if (this.isEditMode && data.alarmOrigen) {
      this.origenAnterior = data.alarmOrigen;
      if(this.origenAnterior){
        this.nombre = this.origenAnterior.nombre;
        this.email = this.origenAnterior.flag_email;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarOrigen(): void {
    if (this.nombre) {
      var nuevoOrigen: NewAlarmSource = {};

      if (this.isEditMode){
        if (this.email != this.origenAnterior?.flag_email){
           nuevoOrigen.flag_email = this.email;
        }
      }else{
        nuevoOrigen.nombre = this.nombre;
        nuevoOrigen.flag_email = this.email;
      }
      this.dialogRef.close(nuevoOrigen);
      return;
    }
    this.dialogRef.close();
  }
}

