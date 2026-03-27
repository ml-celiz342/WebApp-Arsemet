import { Component, Input, OnChanges } from '@angular/core';
import {
  ChartComponent,
  NgApexchartsModule,
  ChartType,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { CHART_COLORS } from '../../../../constants/chart-colors.constants';

type SerieLinea = {
  name: string;
  data: {
    hora: Date;
    valor: number;
  }[];
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  colors: string[];
};

@Component({
  selector: 'app-kpi-grafico-linea',
  standalone: true,
  imports: [ChartComponent, NgApexchartsModule, CommonModule],
  templateUrl: './kpi-grafico-linea.component.html',
  styleUrl: './kpi-grafico-linea.component.css',
})
export class KpiGraficoLineaComponent implements OnChanges {
  @Input() data: SerieLinea[] = [];

  chartOptions?: ChartOptions;

  ngOnChanges(): void {

    if (!this.data || this.data.length === 0) {
      this.chartOptions = undefined;
      return;
    }


    const series: ApexAxisChartSeries = this.data.map((serie) => ({
      name: 'Piezas/Hora',
      data: serie.data.map((d) => ({
        x: new Date(d.hora).getTime(),
        y: d.valor,
      })),
    }));

    this.chartOptions = {
      series,

      chart: {
        type: 'line',
        height: 260,
        toolbar: { show: true },
      },

      xaxis: {
        type: 'datetime',
        tickAmount: 10,
        labels: {
          datetimeUTC: false,
          datetimeFormatter: {
            year: 'yyyy',
            month: 'dd MMM',
            day: 'dd MMM',
            hour: 'HH:mm',
          },
        },
      },

      stroke: {
        width: 3,
        curve: 'smooth',
      },

      colors: [CHART_COLORS.WARNING],
    };
  }
}
