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
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexFill,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { Evidencia } from '../../../../models/evidencia-potencia';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-grafico-potencia-por-dia',
  templateUrl: './grafico-potencia-por-dia.component.html',
  styleUrls: ['./grafico-potencia-por-dia.component.css'],
  imports: [ChartComponent],
})
export class GraficoPotenciaPorDiaComponent
  implements OnChanges, AfterViewInit
{
  @Input() evidencia!: Evidencia;
  @Input() titulo: string = 'KWh por día';

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
    if (!this.evidencia || !this.evidencia.detail_consumption) return;

    const consumo = this.evidencia.detail_consumption;

    // Etiqueta de fecha
    const labels = consumo.map((item) =>
      new Date(item.hour).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    );

    const valores = consumo.map((item) => item.value ?? 0);

    this.chartOptions = {
      series: [
        {
          name: 'kWh',
          data: valores,
          color: '#2F6DA4',
        },
      ],

      chart: {
        height: '100%',
        width: '100%',
        type: 'bar',
        toolbar: { show: true },
        fontFamily: 'Roboto, sans-serif',
      },

      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top',
          },
        },
      },

      dataLabels: {
        enabled: false,
        formatter: (val) => `${val} kWh`,
        offsetY: -18,
        style: {
          fontSize: '12px',
          colors: ['#304758'],
        },
      },

      xaxis: {
        categories: labels,
        position: 'bottom',
        labels: {
          offsetY: 0.5,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },

      fill: {
        type: 'solid',
        colors: ['#2F6DA4'],
      },

      yaxis: {
        labels: {
          formatter: (val) => `${val} kWh`,
        },
        title: {
          text: 'Energía acumulada (kWh)',
        },
      },

      title: {
        text: this.titulo || this.evidencia.code,
        align: 'center',
        style: {
          color: '#000000',
          fontWeight: 'bold',
          fontSize: '15px',
        },
      },
    };
  }
}
