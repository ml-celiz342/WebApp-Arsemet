import {Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatIcon } from "@angular/material/icon";
import { FiltroAssets } from '../../../models/filtro-assets';
import { AssetsService } from '../../../services/assets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KpiFiltroComponent } from './kpi-filtro/kpi-filtro.component';
import { MatDialog } from '@angular/material/dialog';
import { KpiGraficoTortaComponent } from "./kpi-grafico-torta/kpi-grafico-torta.component";
import { KpiGraficoRadialBarComponent } from "./kpi-grafico-radial-bar/kpi-grafico-radial-bar.component";
import { KpiGraficoGanttComponent } from "./kpi-grafico-gantt/kpi-grafico-gantt.component";
import { KpiGraficoBarraApiladoComponent } from "./kpi-grafico-barra-apilado/kpi-grafico-barra-apilado.component";
import { KpiGraficoBarraComponent } from "./kpi-grafico-barra/kpi-grafico-barra.component";
import { KpiGraficoLineaComponent } from "./kpi-grafico-linea/kpi-grafico-linea.component";
import { BlockWheelScrollDirective } from '../../../directives/block-wheel-scroll.directive';

@Component({
  selector: 'app-kpi',
  standalone: true,
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css'],
  imports: [
    CommonModule,
    MatCard,
    MatProgressSpinner,
    MatIcon,
    MatTooltipModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    KpiGraficoTortaComponent,
    KpiGraficoRadialBarComponent,
    KpiGraficoGanttComponent,
    KpiGraficoBarraApiladoComponent,
    KpiGraficoBarraComponent,
    KpiGraficoLineaComponent,
    BlockWheelScrollDirective
  ],
})
export class KpiComponent {
  private _snackBar = inject(MatSnackBar);

  // Filtro
  nombreAssets: string[] = [];
  range = { start: new Date(), end: new Date() };
  selectedAsset: FiltroAssets = { id: 0, code: '' };
  assetsFiltro: FiltroAssets[] = [];

  selectedAssetIds: number[] = [];

  cargando = false;
  perDay = false;
  cdr: any;

  constructor(
    private assetsService: AssetsService,
    private dialog: MatDialog,
  ) {}

  // Cargar datos
  // Load de activos
  async loadDataAssets() {
    try {
      const response = await this.assetsService.getFiltroAssets().toPromise();
      this.assetsFiltro = response?.length ? response : [];
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  ngOnInit() {
    this.loadDataAssets();
  }

  async cargarDatos() {
    if (
      this.range.end.getTime() - this.range.start.getTime() >
      7 * 24 * 60 * 60 * 1000
    ) {
      this.perDay = true;
    } else {
      this.perDay = false;
    }
    this.cdr.detectChanges();
  }

  async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(KpiFiltroComponent, {
      width: '400px',
      data: {
        start: this.range.start,
        end: this.range.end,
        opciones: this.assetsFiltro.map((item) => ({
          value: item.id,
          viewValue: item.code,
        })),
        selectedAssets: this.selectedAssetIds,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;

      this.cargando = true;

      this.range = result.dateRange;

      const selectedIds: number[] = result.selectedOptions.map((x: string) =>
        Number(x),
      );

      this.selectedAssetIds = result.selectedOptions ?? [];

      const selectedAssets = this.assetsFiltro.filter((item) =>
        selectedIds.includes(item.id),
      );

      if (selectedAssets.length > 0) {
        this.selectedAsset = selectedAssets[0];
        this.nombreAssets = selectedAssets.map((a) => a.code);
      }

      // Ajustar horas
      if (this.range.start && this.range.end) {
        this.range.start.setHours(0, 0, 0, 0);

        const endDate = new Date(this.range.end);
        const hoy = new Date();

        const mismaFecha =
          endDate.getFullYear() === hoy.getFullYear() &&
          endDate.getMonth() === hoy.getMonth() &&
          endDate.getDate() === hoy.getDate();

        if (mismaFecha) {
          this.range.end = hoy;
        } else {
          endDate.setHours(23, 59, 59, 999);
          this.range.end = endDate;
        }

        await this.cargarDatos();
      }

      this.cargando = false;
    });
  }

  async recargar() {
    this.cargando = true;

    await this.cargarDatos();

    this.cargando = false;
  }

  // GRAFICOS
  /* Data cruda para pasarle a charts */

  // Torta
  estadosTorta = [
    { valor: 40, estado: 'Apagado' },
    { valor: 35, estado: 'Operativo' },
    { valor: 15, estado: 'Operativo en vacío' },
    { valor: 10, estado: 'Mantenimiento' },
  ];

  // Radial bar
  promediosRadial = {
    tasa_de_utilizacion: 67,
    energia_no_productiva: 22,
  };

  // Gantt
  estadosGantt = [
    { estado: 'Apagado', fecha: '2025-01-10T05:30:00' },
    { estado: 'Apagado', fecha: '2025-01-10T07:00:00' },
    { estado: 'Operativo', fecha: '2025-01-10T07:00:00' },
    { estado: 'Operativo', fecha: '2025-01-10T10:30:00' },
    { estado: 'Operativo en vacío', fecha: '2025-01-10T10:30:00' },
    { estado: 'Operativo en vacío', fecha: '2025-01-10T11:15:00' },
    { estado: 'Operativo', fecha: '2025-01-10T11:15:00' },
    { estado: 'Operativo', fecha: '2025-01-10T13:00:00' },
    { estado: 'Mantenimiento', fecha: '2025-01-10T13:00:00' },
    { estado: 'Mantenimiento', fecha: '2025-01-10T13:45:00' },
    { estado: 'Operativo', fecha: '2025-01-10T13:45:00' },
    { estado: 'Operativo', fecha: '2025-01-10T17:30:00' },
    { estado: 'Operativo en vacío', fecha: '2025-01-10T17:30:00' },
    { estado: 'Operativo en vacío', fecha: '2025-01-10T18:00:00' },
    { estado: 'Apagado', fecha: '2025-01-10T18:00:00' },
    { estado: 'Apagado', fecha: '2025-01-10T20:00:00' },
  ];

  // Barra apilado
  energiaConsumidaBarra = [
    {
      name: 'Plegadora 1',
      data: [
        { fecha: '14/01/2026 13:27:28', valor: 60 },
        { fecha: '15/01/2026 13:27:28', valor: 70 },
        { fecha: '16/01/2026 13:27:28', valor: 80 },
        { fecha: '17/01/2026 13:27:28', valor: 75 },
        { fecha: '18/01/2026 13:27:28', valor: 85 },
        { fecha: '19/01/2026 13:27:28', valor: 95 },
        { fecha: '20/01/2026 13:27:28', valor: 100 },
      ],
    },
    {
      name: 'Plegadora 2',
      data: [
        { fecha: '14/01/2026 13:27:28', valor: 40 },
        { fecha: '15/01/2026 13:27:28', valor: 50 },
        { fecha: '16/01/2026 13:27:28', valor: 60 },
        { fecha: '17/01/2026 13:27:28', valor: 65 },
        { fecha: '18/01/2026 13:27:28', valor: 70 },
        { fecha: '19/01/2026 13:27:28', valor: 80 },
        { fecha: '20/01/2026 13:27:28', valor: 85 },
      ],
    },
  ];

  // Piezas producidas por hora
  piezasPorHoraLinea = [
    {
      name: 'Piezas / hora',
      data: [
        { hora: '08:00', valor: 14 },
        { hora: '09:00', valor: 16 },
        { hora: '10:00', valor: 18 },
        { hora: '11:00', valor: 17 },
        { hora: '12:00', valor: 20 },
        { hora: '13:00', valor: 19 },
        { hora: '14:00', valor: 21 },
      ],
    },
  ];

  // Actos inseguros
  actosInsegurosBarra = [
    {
      name: 'Actos inseguros',
      data: [
        { categoria: 'Lun', valor: 1 },
        { categoria: 'Mar', valor: 0 },
        { categoria: 'Mié', valor: 2 },
        { categoria: 'Jue', valor: 3 },
        { categoria: 'Vie', valor: 1 },
        { categoria: 'Sáb', valor: 0 },
        { categoria: 'Dom', valor: 2 },
      ],
    },
  ];

  // CONTADORES
  piezasTotales = 130;
  horasUltimoMantenimiento = 72;
  consumoEspecifico = 1.8; // kWh/pieza
  consumoAlambre = 12.5; // kg
}
