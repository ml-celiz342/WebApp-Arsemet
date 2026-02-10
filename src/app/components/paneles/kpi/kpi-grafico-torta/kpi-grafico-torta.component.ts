import { Component, Input, OnChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexDataLabels,
  ChartType,
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { CHART_COLORS } from '../../../../constants/chart-colors.constants';

interface PieDataItem {
  valor: number;
  estado: string;
}

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
};

@Component({
  selector: 'app-kpi-grafico-torta',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './kpi-grafico-torta.component.html',
  styleUrl: './kpi-grafico-torta.component.css',
})
export class KpiGraficoTortaComponent implements OnChanges {
  @Input() data: PieDataItem[] = [];

  chartOptions!: PieChartOptions;

  ngOnChanges(): void {
    if (!this.data || this.data.length === 0) {
      return;
    }

    const series = this.data.map((item) => item.valor);
    const labels = this.data.map((item) => item.estado);

    this.chartOptions = {
      series,

      chart: {
        type: 'pie' as ChartType,
        height: 250,
      },

      labels,

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
  }
}
