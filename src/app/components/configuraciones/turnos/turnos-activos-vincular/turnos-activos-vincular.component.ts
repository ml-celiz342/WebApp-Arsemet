import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-turnos-activos-vincular',
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
  templateUrl: './turnos-activos-vincular.component.html',
  styleUrl: './turnos-activos-vincular.component.css',
})
export class TurnosActivosVincularComponent {
  turnos: any[] = [];
  activos: any[] = [];

  selectTurno: number = -1;
  selectActivo: number = -1;

  constructor(
    public dialogRef: MatDialogRef<TurnosActivosVincularComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.turnos = data.turnos;
    this.activos = data.activos;
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarVinculacion(): void {
    if (this.selectTurno > 0 && this.selectActivo > 0) {
      const nuevaVinculacion = {
        id_turno: this.selectTurno,
        id_activo: this.selectActivo,
      };
      this.dialogRef.close(nuevaVinculacion);
      return;
    }

    this.dialogRef.close();
  }
}
