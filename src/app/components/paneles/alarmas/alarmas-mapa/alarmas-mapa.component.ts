import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LeafletMapaComponent } from "../../../utilidades/leaflet-mapa/leaflet-mapa.component";
import { DataMapaGPS } from '../../../../models/data-mapa-gps';
import { MatButtonModule } from '@angular/material/button';

const puntoMapaDefault: DataMapaGPS = {
  lat: -33.3813667,
  lon: -60.1564369,
  color: '#3784c5',
  label: 'Provser',
  capa: 'Provser',
};
const puntoBaseMapaDefault: number[] = [-33.3813667, -60.1564369];

@Component({
  selector: 'app-alarmas-mapa',
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, LeafletMapaComponent, MatButtonModule],
  templateUrl: './alarmas-mapa.component.html',
  styleUrl: './alarmas-mapa.component.css',
})
export class AlarmasMapaComponent {

  puntosMapa: DataMapaGPS[] = [puntoMapaDefault];
  puntoBaseMapa: number[] = puntoBaseMapaDefault;

  latitud:number = 0;
  longitud:number = 0;
  nombre:string = '';


  constructor(
    public dialogRef: MatDialogRef<AlarmasMapaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.latitud = data.latitud;
    this.longitud = data.longitud;
    this.nombre = data.nombre;
    if (this.latitud && this.longitud && this.nombre) {
      this.puntoBaseMapa = [this.latitud, this.longitud];
      this.puntosMapa = [
        {
          lat: this.latitud,
          lon: this.longitud,
          color: '#3784c5',
          label: this.nombre,
          capa: this.nombre,
        },
      ];
    }else{
      this.dialogRef.close();
    }
  }

  ngOnInit() {
    if (this.data) {
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
