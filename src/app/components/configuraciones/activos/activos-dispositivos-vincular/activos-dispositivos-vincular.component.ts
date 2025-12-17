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

@Component({
  selector: 'app-activos-dispositivos-vincular',
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
  templateUrl: './activos-dispositivos-vincular.component.html',
  styleUrl: './activos-dispositivos-vincular.component.css',
})
export class ActivosDispositivosVincularComponent {
  activos: any[] = [];
  dispositivos: any[] = [];

  selectActivo: number = -1;
  selectDispositivo: number = -1;

  constructor(
    public dialogRef: MatDialogRef<ActivosDispositivosVincularComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.activos = data.activos;
    this.dispositivos = data.dispositivos;
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarVinculacion(): void {
    if (this.selectActivo > 0 && this.selectDispositivo >0){
      const nuevaVinculacion = {
        id_activo: this.selectActivo,
        id_dispositivo: this.selectDispositivo,
      };
      this.dialogRef.close(nuevaVinculacion);
      return;
    }

    this.dialogRef.close();
  }
}
