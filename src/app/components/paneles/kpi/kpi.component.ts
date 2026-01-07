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

  selectedAssetIds: number[] = [];

  cargando = false;
  perDay = false;
  cdr: any;

  constructor(
    private assetsService: AssetsService,
    private dialog: MatDialog
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
        Number(x)
      );

      this.selectedAssetIds = result.selectedOptions ?? [];

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
      width: '600px',
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

    colors: [CHART_COLORS.BASE, CHART_COLORS.DARK_2],
  };

  // ENERGÍA NO PRODUCTIVA
  chartNoProductiva: ChartOptions = {
    series: [22], // valor de energía no productiva del activo plegadora_1

    chart: {
      type: 'radialBar' as ChartType,
      height: 250,
    },

    labels: ['Energía no productiva'],

    colors: [CHART_COLORS.BASE],

    plotOptions: {
      radialBar: {
        hollow: {
          size: '65%', // mismo hollow que Utilización
        },

        track: {
          background: '#E3F1FB', // mismo track
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

  // ACTOS INSEGUROS
  chartActosInseguros: ChartOptions = {
    series: [
      {
        name: 'Actos inseguros',
        data: [1, 0, 2, 3, 1, 0, 2], // ejemplo
      },
    ] as ApexAxisChartSeries,

    chart: {
      type: 'bar' as ChartType,
      height: 260,
      width: '600px',
      toolbar: {
        show: false,
      },
    },

    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    },

    dataLabels: {
      enabled: true,
    },

    colors: [CHART_COLORS.ERROR],
  };

  // PIEZAS PRODUCIDAS POR HORA
  chartPiezasHora: ChartOptions = {
    series: [
      {
        name: 'Piezas / hora',
        data: [14, 16, 18, 17, 20, 19, 21], // ejemplo
      },
    ] as ApexAxisChartSeries,

    chart: {
      type: 'line' as ChartType,
      height: 260,
      width: '600px',
      toolbar: {
        show: false,
      },
    },

    xaxis: {
      categories: [
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
      ],
    },

    stroke: {
      width: 3,
      curve: 'smooth',
    },

    colors: [CHART_COLORS.WARNING],
  };

  // TIEMPO VS ESTADO (TIMELINE / GANTT)
  chartTiempoEstado: ChartOptions = {
    series: [
      {
        name: 'Plegadora 1',
        data: [
          {
            x: 'Apagado',
            y: [
              new Date('2025-01-10T06:00:00').getTime(),
              new Date('2025-01-10T07:30:00').getTime(),
            ],
          },
          {
            x: 'Operativo',
            y: [
              new Date('2025-01-10T07:30:00').getTime(),
              new Date('2025-01-10T11:00:00').getTime(),
            ],
          },
          {
            x: 'Operativo en vacío',
            y: [
              new Date('2025-01-10T11:00:00').getTime(),
              new Date('2025-01-10T12:00:00').getTime(),
            ],
          },
          {
            x: 'Mantenimiento',
            y: [
              new Date('2025-01-10T12:00:00').getTime(),
              new Date('2025-01-10T13:00:00').getTime(),
            ],
          },
          {
            x: 'Operativo',
            y: [
              new Date('2025-01-10T13:00:00').getTime(),
              new Date('2025-01-10T15:00:00').getTime(),
            ],
          },
        ],
      },
    ] as ApexAxisChartSeries,

    chart: {
      type: 'rangeBar' as ChartType,
      height: '100%',
      width: '600px',
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        distributed: true, // 🔑 clave para colorear por estado
      },
    },

    xaxis: {
      type: 'datetime',
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      position: 'top',
    },

    // colores en el mismo orden en que aparecen los estados
    colors: [
      CHART_COLORS.ERROR, // Apagado
      CHART_COLORS.WARNING, // Operativo
      CHART_COLORS.LIGHT_2, // Operativo en vacío
      CHART_COLORS.DARK_2, // Mantenimiento
      CHART_COLORS.WARNING, // Operativo (segunda aparición)
    ],
  };

  // CONTADORES
  piezasTotales = 130;
  horasUltimoMantenimiento = 72;
  consumoEspecifico = 1.8; // kWh/pieza
  consumoAlambre = 12.5; // kg
}
