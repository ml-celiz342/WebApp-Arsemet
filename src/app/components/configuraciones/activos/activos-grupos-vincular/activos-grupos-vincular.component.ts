import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { MatSelectModule } from '@angular/material/select';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-activos-grupos-vincular',
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
  templateUrl: './activos-grupos-vincular.component.html',
  styleUrl: './activos-grupos-vincular.component.css',
})
export class ActivosGruposVincularComponent {
  activos: any[] = [];
  sub_activos: any[] = [];

  selectActivo: number = -1;
  selectSubActivo: number = -1;

  activoControl = new FormControl('');
  activosFiltrados!: Observable<any[]>;

  subActivoControl = new FormControl('');
  subActivosFiltrados!: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<ActivosGruposVincularComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.activos = data.activos;
    this.sub_activos = data.sub_activos;

    this.activosFiltrados = this.activoControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filtro = (value || '').toLowerCase();
        return this.activos.filter((a) =>
          a.code.toLowerCase().includes(filtro),
        );
      }),
    );

    this.subActivosFiltrados = this.subActivoControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filtro = (value || '').toLowerCase();
        return this.sub_activos.filter((s) =>
          s.code.toLowerCase().includes(filtro),
        );
      }),
    );
  }

  selectActivoFromAutocomplete(activo: any) {
    this.selectActivo = activo.id;
  }

  selectSubActivoFromAutocomplete(subActivo: any) {
    this.selectSubActivo = subActivo.id;
  }

  displayActivo(activo: any): string {
    return activo ? activo.code : '';
  }

  displaySubActivo(activo: any): string {
    return activo ? activo.code : '';
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarVinculacion(): void {
    if (this.selectActivo > 0 && this.selectSubActivo > 0) {
      const nuevaVinculacion = {
        id_activo: this.selectActivo,
        id_sub_activo: this.selectSubActivo,
      };
      this.dialogRef.close(nuevaVinculacion);
      return;
    }

    this.dialogRef.close();
  }
}
