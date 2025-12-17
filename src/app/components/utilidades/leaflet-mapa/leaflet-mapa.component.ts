import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { DataMapaGPS } from '../../../models/data-mapa-gps';

@Component({
  selector: 'app-leaflet-mapa',
  imports: [],
  templateUrl: './leaflet-mapa.component.html',
  styleUrl: './leaflet-mapa.component.css',
})
export class LeafletMapaComponent implements AfterViewInit, OnChanges {
  @Input() puntos: DataMapaGPS[] = [];
  @Input() punto_base: number[] = [-33.371359331118825, -60.1496335876623];
  @Input() zoom: number = 13;
  @Input() mostrarControlCapa: boolean = false;
  @Input() fijarLabel: boolean = false;

  @Output() eventoClick = new EventEmitter<DataMapaGPS>();

  private map: L.Map | undefined;
  private capaControl: L.Control.Layers | undefined;

  private resizeObserver: ResizeObserver | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.map && document.getElementById('map')) {
        this.initMap();
        this.setupResizeObserver();
      }
    }, 100);
  }

  private setupResizeObserver(): void {
    if (this.map) {
      this.resizeObserver = new ResizeObserver(() => {
        this.map?.invalidateSize(); // Llama a invalidateSize para redimensionar el mapa
      });

      // Obtenemos el contenedor del mapa
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        this.resizeObserver.observe(mapContainer);
      }
    }
  }

  private initMap(): void {
    const container = L.DomUtil.get('map');
    if (container != null) {
      container.innerHTML = ''; // limpiar contenedor si quedó algo
    }

    this.map = L.map('map', {
      center: [this.punto_base[0], this.punto_base[1]],
      zoom: this.zoom,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution:
        '&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google</a>',
      updateWhenIdle: false,
      updateWhenZooming: false,
      keepBuffer: 1,
    }).addTo(this.map);

    this.addPoints();
  }

  private addPoints(): void {
    if (!this.map) return; // Verificar que el mapa esté inicializado

    // Eliminar el control de capas si ya existe
    if (this.capaControl) {
      this.map.removeControl(this.capaControl);
      this.capaControl = undefined;
    }

    // Obtener las capas únicas a partir del array de puntos
    const capasUnicas = [...new Set(this.puntos.map((punto) => punto.capa))];

    // Crear un objeto para las capas dinámicas
    const capas: { [key: string]: L.LayerGroup } = {};

    // Crear un LayerGroup para cada capa
    capasUnicas.forEach((capa) => {
      capas[capa] = L.layerGroup();
    });

    // Agregar los puntos a sus respectivas capas
    this.puntos.forEach((point) => {
      var marker
      marker = L.circleMarker([point.lat, point.lon], {
        radius: 5,
        fillColor: point.color,
        color: 'black',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
      if(this.fijarLabel){
        marker.bindTooltip(point.label, {
          permanent: true,
          direction: 'top',
          offset: [0, -10],
        });
      }else{
        marker.bindPopup(point.label);
      }

      marker.on('click', () => this.eventoClick.emit(point));

      capas[point.capa].addLayer(marker);
    });

    // Añadir las capas al mapa
    Object.keys(capas).forEach((capa) => {
      capas[capa].addTo(this.map!);
    });

    // Crear el control de capas correctamente
    if (this.mostrarControlCapa) {
      this.capaControl = L.control.layers({}, capas).addTo(this.map);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateMap();
  }

  private updateMap(): void {
    if (!this.map) return;

    // 🔹 Remover el control de capas si ya existe
    if (this.capaControl) {
      this.map.removeControl(this.capaControl);
      this.capaControl = undefined;
    }

    // Eliminar todas las capas excepto el TileLayer
    this.map.eachLayer((layer) => {
      // Asegurarse de no eliminar el TileLayer
      if (layer instanceof L.LayerGroup || layer instanceof L.CircleMarker) {
        this.map!.removeLayer(layer);
      }
    });

    if (this.punto_base && this.punto_base.length === 2) {
      this.map.setView([this.punto_base[0], this.punto_base[1]], this.zoom);
    }

    this.addPoints();
  }

  ngOnDestroy(): void {
    // Detener el observador al destruir el componente
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.map) {
      this.map.remove(); // Esto libera recursos y destruye completamente el mapa
      this.map = undefined;
    }
  }
}
