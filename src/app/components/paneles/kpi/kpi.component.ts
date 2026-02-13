import {Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatIcon } from "@angular/material/icon";
import { FiltroAssets } from '../../../models/filtro-assets';
import { AssetsService } from '../../../services/assets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';
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
import { KpiTemporalesService } from '../../../services/kpi-temporales.service';
import { ZonasTareasEstado } from '../../../models/kpi-temporales';
import { firstValueFrom } from 'rxjs';
import { KpiEstaticosService } from '../../../services/kpi-estaticos.service';
import { DistribucionTareas, KpiStats } from '../../../models/kpi-estaticos';

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
    BlockWheelScrollDirective,
  ],
  providers: [DatePipe],
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
    private kpiTemporalesService: KpiTemporalesService,
    private kpiEstaticosService: KpiEstaticosService,
    private datePipe: DatePipe,
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

    await this.loadDataGantt(); // cargar datos para el gantt
    await this.loadDataTorta(); // cargar datos para el pie chart
    await this.loadDataLinealBar(); // cargar datos para el radial bar + ...
    await this.loadDataPiecesPerHour(); // cargar datos para el lineal chart


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
  estadosTorta: { estado: string; valor: number }[] = [];

  private async loadDataTorta(): Promise<void> {
    const idAsset = this.selectedAsset?.id ?? 0;

    const formattedStart =
      this.datePipe.transform(this.range.start, 'yyyy-MM-dd HH:mm:ss') ?? '';

    const formattedEnd =
      this.datePipe.transform(this.range.end, 'yyyy-MM-dd HH:mm:ss') ?? '';

    try {
      const resp: DistribucionTareas = await firstValueFrom(
        this.kpiEstaticosService.getKpiTasksDistribution(
          idAsset,
          formattedStart,
          formattedEnd,
        ),
      );

      // convertir segundos → porcentajes
      const totalSeg = resp.estados.reduce((a, b) => a + b.valor, 0);

      this.estadosTorta = resp.estados.map((e) => ({
        estado: e.estado,
        valor:
          totalSeg > 0 ? Number(((e.valor / totalSeg) * 100).toFixed(2)) : 0,
      }));

      console.log('Torta real %:', this.estadosTorta);
    } catch (err) {
      console.error(err);
      this._snackBar.open('Error cargando torta', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  // Radial bar
  promediosRadial = {
    tasa_de_utilizacion: 0,
    energia_no_productiva: 0,
  };

  private async loadDataLinealBar(): Promise<void> {
    const idAsset = this.selectedAsset?.id ?? 0;

    const formattedStart =
      this.datePipe.transform(this.range.start, 'yyyy-MM-dd HH:mm:ss') ?? '';

    const formattedEnd =
      this.datePipe.transform(this.range.end, 'yyyy-MM-dd HH:mm:ss') ?? '';

    try {
      const resp: KpiStats = await firstValueFrom(
        this.kpiEstaticosService.getKpiStats(
          idAsset,
          formattedStart,
          formattedEnd,
        ),
      );

      this.promediosRadial = {
        tasa_de_utilizacion: Number(
          resp.linealbar.tasa_de_utilizacion.toFixed(2),
        ),
        energia_no_productiva: Number(
          resp.linealbar.energia_no_productiva.toFixed(2),
        ),
      };

      console.log('LinealBar real:', this.promediosRadial);
    } catch (err) {
      console.error(err);
      this._snackBar.open('Error cargando radial', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  // Gantt
  estadosGantt: ZonasTareasEstado[] = [];

  private async loadDataGantt(): Promise<void> {
    const idAsset = this.selectedAsset?.id ?? 0;

    const formattedStart =
      this.datePipe.transform(this.range.start, 'yyyy-MM-dd HH:mm:ss') ?? '';

    const formattedEnd =
      this.datePipe.transform(this.range.end, 'yyyy-MM-dd HH:mm:ss') ?? '';

    try {
      this.estadosGantt = await firstValueFrom(
        this.kpiTemporalesService.getKpiTasksStates(
          idAsset,
          formattedStart,
          formattedEnd,
        ),
      );

      console.log('Gantt real:', this.estadosGantt);
    } catch (err) {
      console.error(err);
      this._snackBar.open('Error cargando gantt', 'Cerrar', {
        duration: 3000,
      });
    }
  }

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
  piezasPorHoraLinea: {
    name: string;
    data: { hora: string; valor: number }[];
  }[] = [];

  private async loadDataPiecesPerHour(): Promise<void> {
    const idAsset = this.selectedAsset?.id ?? 0;

    const formattedStart =
      this.datePipe.transform(this.range.start, 'yyyy-MM-dd HH:mm:ss') ?? '';

    const formattedEnd =
      this.datePipe.transform(this.range.end, 'yyyy-MM-dd HH:mm:ss') ?? '';

    try {
      const resp = await firstValueFrom(
        this.kpiTemporalesService.getPiecesPerHour(
          idAsset,
          formattedStart,
          formattedEnd,
        ),
      );

      if (!resp || resp.length === 0) {
        this.piezasPorHoraLinea = [];
        return;
      }

      // solo un activo → una serie
      const serie = resp[0];

      this.piezasPorHoraLinea = [
        {
          name: 'Pieces / hour',
          data: serie.data.map((p) => ({
            hora: this.datePipe.transform(p.fecha, 'HH:mm') ?? '',
            valor: Number(p.valor.toFixed(2)),
          })),
        },
      ];

      console.log('Pieces/hour real:', this.piezasPorHoraLinea);
    } catch (err) {
      console.error(err);
      this._snackBar.open('Error cargando piezas por hora', 'Cerrar', {
        duration: 3000,
      });
    }
  }

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
