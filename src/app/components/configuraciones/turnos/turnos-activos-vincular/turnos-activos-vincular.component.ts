import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { map, Observable, startWith } from 'rxjs';

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
    MatAutocompleteModule,
  ],
  templateUrl: './turnos-activos-vincular.component.html',
  styleUrl: './turnos-activos-vincular.component.css',
})
export class TurnosActivosVincularComponent {
  turnos: any[] = [];
  activos: any[] = [];

  selectTurno: number = -1;
  selectActivo: number = -1;

  activoControl = new FormControl('');
  activosFiltrados!: Observable<any[]>;
  turnoControl = new FormControl('');
  turnosFiltrados!: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<TurnosActivosVincularComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.turnos = data.turnos;
    this.activos = data.activos;

    this.turnosFiltrados = this.turnoControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filtro = (value || '').toLowerCase();
        return this.turnos.filter((t) => t.name.toLowerCase().includes(filtro));
      }),
    );

    this.activosFiltrados = this.activoControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filtro = (value || '').toLowerCase();
        return this.activos.filter((a) =>
          a.code.toLowerCase().includes(filtro),
        );
      }),
    );
  }

  selectTurnoFromAutocomplete(turno: any) {
    this.selectTurno = turno.id_shift;
  }

  selectActivoFromAutocomplete(activo: any) {
    this.selectActivo = activo.id;
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
