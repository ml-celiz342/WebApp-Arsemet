import {Component, inject } from '@angular/core';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexAxisChartSeries,
  ApexResponsive,
  ApexPlotOptions,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexFill,
  ChartType,
  ChartComponent,
} from 'ng-apexcharts';
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

// PALETA DE COLORES DE LA APP
export const CHART_COLORS = {
  BASE: '#3784c5',
  LIGHT_1: '#E3F1FB',
  LIGHT_2: '#A9D0F0',
  DARK_1: '#2F6DA4',
  DARK_2: '#1E4D75',
  COMPLEMENTARY: '#F5A25D',
  SUCCESS: '#48C57A',
  WARNING: '#F9D976',
  ERROR: '#E57373',
};

export type ChartOptions = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  labels?: string[];
  responsive?: ApexResponsive[];
  plotOptions?: ApexPlotOptions;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  fill?: ApexFill;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  colors?: string[];
  legend?: ApexLegend;
};

@Component({
  selector: 'app-kpi',
  standalone: true,
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css'],
  imports: [
    CommonModule,
    MatCard,
    ChartComponent,
    MatProgressSpinner,
    MatIcon,
    MatTooltipModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class KpiComponent {
  private _snackBar = inject(MatSnackBar);

  // Filtro
  nombreAssets: string[] = [];
  range = { start: new Date(), end: new Date() };
  selectedAsset: FiltroAssets = { id: 0, code: '' };
  assetsFiltro: FiltroAssets[] = [];

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
        selectedAssets: this.nombreAssets, // ahora es array
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;

      this.cargando = true;

      this.range = result.dateRange;

      const selectedIds: number[] = result.selectedOptions.map((x: string) =>
        Number(x)
      );

      const selectedAssets = this.assetsFiltro.filter((item) =>
        selectedIds.includes(item.id)
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

    // Crear fechas del día actual
    const hoy = new Date();

    const inicio = new Date(hoy);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(hoy);
    fin.setHours(23, 59, 59, 999);

    // Aplicar al filtro del componente
    this.range = { start: inicio, end: fin };

    // Resetear filtro de activo seleccionado ("Todos")
    this.selectedAsset = { id: 0, code: '' };

    // Recargar tablas de activos y evidencias
    await this.cargarDatos();
    await this.loadDataAssets();

    this.cargando = false;
  }

  // GRAFICOS
  // DISTRIBUCIÓN DE ESTADOS
  chartEstados: ChartOptions = {
    series: [40, 35, 15, 10],
    chart: {
      type: 'pie' as ChartType,
      height: 200,
    },
    labels: ['Apagado', 'Operativo', 'Operativo en vacío', 'Mantenimiento'],
    colors: [
      CHART_COLORS.ERROR,
      CHART_COLORS.WARNING,
      CHART_COLORS.LIGHT_2,
      CHART_COLORS.DARK_2,
    ],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
      fontSize: '10.5px',
      itemMargin: {
        horizontal: 8,
      },
      formatter: (seriesName: string, opts: any) => {
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${seriesName}: ${value}%`;
      },
    },
  };

  // TASA DE UTILIZACIÓN
  chartUtilizacion: ChartOptions = {
    series: [67],
    chart: {
      type: 'radialBar' as ChartType,
      height: 250,
    },
    labels: ['Utilización promedio'],
    colors: [CHART_COLORS.BASE],
    plotOptions: {
      radialBar: {
        hollow: {
          size: '65%',
        },
        track: {
          background: '#E3F1FB',
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '14px',
            offsetY: 10,
          },
          value: {
            show: true,
            fontSize: '14px',
            fontWeight: 700,
            formatter: (val: number) => `${Math.round(val)}%`,
          },
        },
      },
    },
  };

  // ENERGÍA TOTAL CONSUMIDA
  chartEnergia: ChartOptions = {
    series: [
      {
        name: 'Plegadora 1',
        data: [60, 70, 80, 75, 85, 95, 100],
      },
      {
        name: 'Plegadora 2',
        data: [40, 50, 60, 65, 70, 80, 85],
      },
    ] as ApexAxisChartSeries,

    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
      stacked: true,
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
      },
    },

    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    },

    legend: {
      position: 'top',
      horizontalAlign: 'center',
      markers: {
        shape: 'circle',
        size: 8,
      },
    },

    fill: {
      opacity: 1,
    },

    colors: [
      CHART_COLORS.BASE, 
      CHART_COLORS.DARK_2,
    ],
  };

  // ENERGÍA NO PRODUCTIVA
  chartNoProductiva: ChartOptions = {
    series: [22, 40],

    chart: {
      type: 'radialBar',
      height: 260,
    },

    labels: ['Brazo', 'Soldadura'],

    colors: [
      CHART_COLORS.BASE,
      CHART_COLORS.DARK_1,
    ],

    plotOptions: {
      radialBar: {
        hollow: {
          size: '55%',
        },

        track: {
          background: '#eef2f6',
        },

        dataLabels: {
          name: {
            show: true,
            fontSize: '13px',
            offsetY: -4,
          },

          value: {
            show: true,
            fontSize: '13px',
            fontWeight: 600,
            offsetY: 4,
          },

          total: {
            show: true,
            label: 'Total',
            fontSize: '13px',
            fontWeight: 600,
            color: CHART_COLORS.BASE,

            formatter: function (w) {
              const values = w.globals.seriesTotals;
              const avg =
                values.reduce((a: number, b: number) => a + b, 0) /
                values.length;
              return `${avg.toFixed(0)}%`;
            },
          },
        },
      },
    },
  };

  // PIEZAS POR DÍA
  chartPiezas: ChartOptions = {
    series: [
      {
        name: 'Piezas',
        data: [12, 19, 15, 22, 18, 24, 20],
      },
    ] as ApexAxisChartSeries,
    chart: {
      type: 'line' as ChartType,
      height: '100%',
      width: '100%',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    },
    stroke: { width: 3 },
    colors: [CHART_COLORS.BASE],
  };

  // CONTADORES
  piezasTotales = 130;
  horasUltimoMantenimiento = 72;
  consumoEspecifico = 1.8; // kWh/pieza
  consumoAlambre = 12.5; // kg
}
