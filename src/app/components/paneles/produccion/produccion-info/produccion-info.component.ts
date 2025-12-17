import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  NgApexchartsModule,
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
} from 'ng-apexcharts';
import { CHART_COLORS } from '../../../../constants/chart-colors.constants';
import { MatDividerModule } from '@angular/material/divider';
import { DetailService } from '../../../../services/detail.service';
import { Detalle, DetalleBalanza } from '../../../../models/detalle';
import { interval, Subscription, switchMap } from 'rxjs';
import { UtilidadesService } from '../../../../services/utilidades.service';
import { AlarmasService } from '../../../../services/alarmas.service';
import { Alarmas } from '../../../../models/alarmas';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  title: ApexTitleSubtitle;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  colors: string[];
};

@Component({
  selector: 'app-produccion-info',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    NgApexchartsModule,
    MatDividerModule,
  ],
  templateUrl: './produccion-info.component.html',
  styleUrl: './produccion-info.component.css',
})
export class ProduccionInfoComponent implements OnInit, OnDestroy {
  @Output() eventoCerrar = new EventEmitter();

  // Inputs
  @Input() id_activo: number = 0;
  @Input() codigo: string = '';
  @Input() tipo_activo: string = '';

  // Charts
  @ViewChild('chartEncendido', { static: false })
  chartEncendido!: ChartComponent; // Horas encendido
  @ViewChild('chartNoOperativo', { static: false })
  chartNoOperativo!: ChartComponent; // Potencia actual

  chartOptionsEncendido: any;
  chartOptionsNoOperativo: any;

  // Estados
  detalleSubscription!: Subscription;
  alarmaSubscription!: Subscription;

  // POWER
  codigo_activo: string = '';
  estado_actual: string = '';
  horas_encendido: string = '00:00:00';
  potencia_actual: number = 0;
  consumo_total_actual: number = 0;
  tipo: string = '';
  local_activo: number = 0; // Que es esto?

  rawDetail: Detalle = {
    state: '',
    turned_on: 0,
    current_power: 0,
    total_consumption: 0,
  };

  rawDetailActual: Detalle = {
    state: '',
    turned_on: 0,
    current_power: 0,
    total_consumption: 0,
  };

  alarmas: Alarmas[] = [];

  constructor(
    private deatilService: DetailService,
    private utilidades: UtilidadesService,
    private alarmService: AlarmasService
  ) {}

  ngOnInit() {
    if (this.id_activo == 0) {
      this.cerrar();
    } else {
      this.local_activo = this.id_activo;
    }

    this.local_activo = this.id_activo;
    this.codigo_activo = this.codigo;

    this.initCharts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.id_activo != this.local_activo) {
      if (this.id_activo == 0) {
        this.cerrar();
      } else {
        this.local_activo = this.id_activo;
      }

      this.local_activo = this.id_activo;
      this.codigo_activo = this.codigo;

      this.resetearEstado();
      this.reiniciarSubscripciones();
    }
  }

  ngAfterViewInit() {
    this.iniciarActualizacionAlarma();
    this.iniciarActualizacionActivo();
  }

  ngOnDestroy(): void {
    this.detalleSubscription?.unsubscribe();
    this.alarmaSubscription?.unsubscribe();
  }

  // CONFIGURACION
  /* ================= CONFIG ================= */

  private resetearEstado(): void {
    this.rawDetailActual = { ...this.rawDetail };
  }

  private reiniciarSubscripciones(): void {
    this.detalleSubscription?.unsubscribe();
    this.alarmaSubscription?.unsubscribe();

    this.iniciarActualizacionActivo();
    this.iniciarActualizacionAlarma();
  }

  initCharts() {
    // HORAS ENCENDIDAS
    this.chartOptionsEncendido = {
      series: [0],
      chart: { height: '100%', width: '100%', type: 'radialBar' },
      colors: ['#2E93fA'],
      title: {
        text: 'Horas encendido',
        align: 'center',
        style: { fontSize: '12px' },
      },
      plotOptions: {
        radialBar: {
          hollow: { size: '40%' },
          dataLabels: {
            name: {
              show: true,
              fontSize: '12px',
              offsetY: -30,
            },
            value: {
              show: true,
              fontSize: '10px',
              offsetY: -12,
              formatter: (val: number) => `${val}%`,
            },
          },
        },
      },
      labels: ['00:00:00 Hrs'],
    };

    // POTENCIA ACTUAL
    this.chartOptionsNoOperativo = {
      series: [0],
      chart: { height: '100%', width: '100%', type: 'radialBar' },
      colors: ['#2E93fA'],
      title: {
        text: 'Potencia actual',
        align: 'center',
        style: { fontSize: '12px' },
      },
      plotOptions: {
        radialBar: {
          hollow: { size: '40%' },
          dataLabels: {
            name: {
              show: true,
              fontSize: '12px',
              offsetY: -30,
            },
            value: {
              show: true,
              fontSize: '10px',
              offsetY: -12,
              formatter: (val: number) => `${val}%`,
            },
          },
        },
      },
      labels: ['0 kW'],
    };
  }

  iniciarActualizacionAlarma(): void {
    // Llamada inmediata
    this.alarmService
      .getAlarmByFiltro(
        '', // desde
        '', // hasta
        [this.local_activo], // id_activos vacío → no se incluye "status"
        ['activa', 'inactiva'], // estados vacío → no se incluye "state"
        [], // nivels vacío → no se incluye "level"
        [] // origen
      )
      .subscribe((response) => {
        this.alarmas = response;
      });

    // Luego cada 2 minutos
    this.alarmaSubscription = interval(120000) // 2 minutos
      .pipe(
        switchMap(() =>
          this.alarmService.getAlarmByFiltro(
            '', // desde
            '', // hasta
            [this.local_activo], // id_activos
            ['activa', 'inactiva'], // estados
            [], // nivels
            [] //origen
          )
        )
      )
      .subscribe((response) => {
        this.alarmas = response;
      });
  }

  iniciarActualizacionActivo(): void {
    // Llamada inmediata
    this.deatilService
      .getDetallePower(this.local_activo)
      .subscribe((response) => {
        this.rawDetail = response;
        this.updateChart();
      });

    // Luego cada 2 minutos
    this.detalleSubscription = interval(120000) // 2 minutos
      .pipe(
        switchMap(() => this.deatilService.getDetallePower(this.local_activo))
      )
      .subscribe((response) => {
        this.rawDetail = response;
        this.updateChart();
      });
  }

  updateChart() {
    if (
      this.rawDetail.state.toLocaleLowerCase() !==
      this.rawDetailActual.state.toLocaleLowerCase()
    ) {
      this.rawDetailActual.state = this.rawDetail.state;
      this.estado_actual = this.convertirNombreEstado(
        this.rawDetailActual.state
      );
    }

    // HORAS ENCENDIDO
    if (this.rawDetail.turned_on !== this.rawDetailActual.turned_on) {
      this.rawDetailActual.turned_on = this.rawDetail.turned_on;

      const auxCursor = Math.round(
        (this.rawDetailActual.turned_on * 100) / (24 * 3600)
      );

      const auxLabel = this.utilidades.convertirSegundosAStringTime(
        this.rawDetailActual.turned_on
      );

      this.chartEncendido.updateSeries([auxCursor]);
      this.chartEncendido.updateOptions({
        labels: [auxLabel + ' Hrs'],
      });
    }

    // POTENCIA ACTUAL
    if (this.rawDetail.current_power !== this.rawDetailActual.current_power) {
      this.rawDetailActual.current_power = this.rawDetail.current_power;

      const valorKW = this.truncar2(this.rawDetailActual.current_power);
      const maxKW = 380 * 80 * 3; // <- VALOR MAXIMO DE POTENCIA?

      const porcentaje = Math.round((valorKW * 100) / maxKW);

      this.chartNoOperativo.updateSeries([porcentaje]);

      this.chartNoOperativo.updateOptions({
        labels: [`${valorKW} kW`],
      });
    }

    if (
      this.rawDetail.total_consumption !==
      this.rawDetailActual.total_consumption
    ) {
      this.rawDetailActual.total_consumption = this.rawDetail.total_consumption;
      this.consumo_total_actual = this.rawDetailActual.total_consumption;
    }
  }

  cerrar() {
    this.eventoCerrar.emit();
  }

  getIcono(nivel: string): string {
    switch (nivel) {
      case 'información':
        return 'info';
      case 'advertencia':
        return 'warning';
      case 'crítica':
        return 'error';
      default:
        return 'info';
    }
  }

  convertirNombreEstado(estado: string) {
    switch (estado.toUpperCase()) {
      case 'NULL':
        return 'Null';
      case 'APAGADO':
        return 'Apagado';
      case 'ENCENDIDO':
        return 'Encendido';
      case 'OPERANDO':
        return 'Operando';
    }
    return '';
  }

  private truncar2(num: number): number {
    return Math.floor(num * 100) / 100;
  }
}
