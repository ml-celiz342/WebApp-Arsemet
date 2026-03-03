import { Component, Input, OnChanges } from '@angular/core';
import {
  ApexChart,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
  ChartType,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { CHART_COLORS } from '../../../../constants/chart-colors.constants';

export type RadialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-kpi-grafico-radial-bar',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './kpi-grafico-radial-bar.component.html',
  styleUrl: './kpi-grafico-radial-bar.component.css',
})
export class KpiGraficoRadialBarComponent implements OnChanges {
  @Input() valor = 0;
  @Input() label = '';

  chartOptions!: RadialChartOptions;

  ngOnChanges(): void {
    this.chartOptions = {
      series: [this.valor],

      chart: {
        type: 'radialBar' as ChartType,
        height: 250,
      },

      labels: [this.label],

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
  }
}
