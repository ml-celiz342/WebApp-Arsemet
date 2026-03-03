import {
  Component,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ApexTooltip,
} from 'ng-apexcharts';
import { EvidenciaGenerico } from '../../../../models/evidencia-generico';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  markers: ApexMarkers;
  yaxis: ApexYAxis | ApexYAxis[];
  grid: ApexGrid;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-grafico-generico',
  imports: [ChartComponent],
  templateUrl: './grafico-generico.component.html',
  styleUrl: './grafico-generico.component.css',
})
export class GraficoGenericoComponent implements OnChanges, AfterViewInit {
  @Input() evidencia!: EvidenciaGenerico;
  @Input() unidad: string = 'KWh';
  @Input() titulo: string = '';
  @Input() yAxisLabel: string = 'Potencia instantánea';

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['evidencia'] && this.evidencia) {
      this.initChart();
    }
  }

  private initChart() {
    if (!this.evidencia || !this.evidencia.generic) return;

    const colores = ['#A9D0F0', '#2F6DA4', '#1E4D75'];

    // ---- 1) Ordenar datos por hora ----
    const powerSorted = [...this.evidencia.generic].sort(
      (a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime(),
    );

    // ---- 2) Series con DATETIME ----
    const series: ApexAxisChartSeries = [
      {
        name: 'R',
        data: powerSorted.map((p) => ({
          x: new Date(p.hour).getTime(), // timestamp
          y: p.r,
        })),
        color: colores[0],
      },
      {
        name: 'S',
        data: powerSorted.map((p) => ({
          x: new Date(p.hour).getTime(),
          y: p.s,
        })),
        color: colores[1],
      },
      {
        name: 'T',
        data: powerSorted.map((p) => ({
          x: new Date(p.hour).getTime(),
          y: p.t,
        })),
        color: colores[2],
      },
    ];

    // ---- 3) Configuración Apex con eje datetime ----
    this.chartOptions = {
      series,
      chart: {
        type: 'line',
        height: '100%',
        width: '100%',
        toolbar: { show: true },
        zoom: { enabled: true },
        fontFamily: 'Roboto, sans-serif',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      markers: {
        size: 3,
        colors: colores,
        strokeColors: colores,
      },
      xaxis: {
        type: 'datetime', // IMPORTANTE
        tickAmount: 12, // menos labels (cada ~2 horas)
        labels: {
          datetimeUTC: false,
          datetimeFormatter: {
            year: 'dd MMM yyyy',
            month: 'dd MMM',
            day: 'dd/MM',
            hour: 'HH:mm',
          },
        },
        title: { text: 'Hora' },
      },
      yaxis: {
        title: { text: `${this.yAxisLabel} (${this.unidad})` },
        labels: {
          formatter: (value) => Number(value).toFixed(2), // 2 decimales
        },
      },
      grid: {
        borderColor: '#e7e7e7',
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
      tooltip: {
        x: {
          format: 'dd/MM HH:mm',
        },
        y: {
          formatter: (v) => `${v} ${this.unidad}`,
        },
      },
      legend: { position: 'top' },
      title: {
        text: this.titulo || this.evidencia.code,
        align: 'center',
        style: {
          color: '#000',
          fontWeight: 'bold',
          fontSize: '15px',
        },
      },
    };
  }
}
