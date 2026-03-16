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
    MatAutocompleteModule,
  ],
  templateUrl: './activos-dispositivos-vincular.component.html',
  styleUrl: './activos-dispositivos-vincular.component.css',
})
export class ActivosDispositivosVincularComponent {
  activos: any[] = [];
  dispositivos: any[] = [];

  selectActivo: number = -1;
  selectDispositivo: number = -1;

  activoControl = new FormControl('');
  activosFiltrados!: Observable<any[]>;
  dispositivoControl = new FormControl('');
  dispositivosFiltrados!: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<ActivosDispositivosVincularComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.activos = data.activos;
    this.dispositivos = data.dispositivos;

    this.activosFiltrados = this.activoControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filtro = (value || '').toLowerCase();
        return this.activos.filter((a) =>
          a.code.toLowerCase().includes(filtro),
        );
      }),
    );

    this.dispositivosFiltrados = this.dispositivoControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filtro = (value || '').toLowerCase();
        return this.dispositivos.filter((d) =>
          d.numero_serie.toLowerCase().includes(filtro),
        );
      }),
    );
  }

  selectActivoFromAutocomplete(activo: any) {
    this.selectActivo = activo.id;
  }

  selectDispositivoFromAutocomplete(dispositivo: any) {
    this.selectDispositivo = dispositivo.id;
  }

  displayActivo(activo: any): string {
    return activo ? activo.code : '';
  }

  displayDispositivo(dispositivo: any): string {
    return dispositivo ? dispositivo.numero_serie : '';
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarVinculacion(): void {
    if (this.selectActivo > 0 && this.selectDispositivo > 0) {
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
