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
  selector: 'app-dispositivos-analiticas-vincular',
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
  templateUrl: './dispositivos-analiticas-vincular.component.html',
  styleUrl: './dispositivos-analiticas-vincular.component.css',
})
export class DispositivosAnaliticasVincularComponent {
  dispositivos: any[] = [];
  analiticas: any[] = [];

  selectAnalitica: number = -1;
  selectDispositivo: number = -1;

  dispositivoControl = new FormControl('');
  analiticaControl = new FormControl('');

  dispositivosFiltrados!: Observable<any[]>;
  analiticasFiltradas!: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<DispositivosAnaliticasVincularComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.analiticas = data.analiticas;
    this.dispositivos = data.dispositivos;

    this.dispositivosFiltrados = this.dispositivoControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filtro = (value || '').toLowerCase();
        return this.dispositivos.filter((d) =>
          d.numero_serie.toLowerCase().includes(filtro),
        );
      }),
    );

    this.analiticasFiltradas = this.analiticaControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filtro = (value || '').toLowerCase();
        return this.analiticas.filter((a) =>
          a.nombre.toLowerCase().includes(filtro),
        );
      }),
    );
  }

  selectDispositivoFromAutocomplete(dispositivo: any) {
    this.selectDispositivo = dispositivo.id;
  }

  selectAnaliticaFromAutocomplete(analitica: any) {
    this.selectAnalitica = analitica.id;
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarVinculacion(): void {
    if (this.selectAnalitica > 0 && this.selectDispositivo > 0) {
      const nuevaVinculacion = {
        id_analitica: this.selectAnalitica,
        id_dispositivo: this.selectDispositivo,
      };
      this.dialogRef.close(nuevaVinculacion);
      return;
    }

    this.dialogRef.close();
  }
}
