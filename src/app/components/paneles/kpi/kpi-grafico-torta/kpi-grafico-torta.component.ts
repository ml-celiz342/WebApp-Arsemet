import { Component, Input, OnChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexDataLabels,
} from 'ng-apexcharts';

export interface KpiTortaItem {
  label: string;
  value: number;
  color?: string;
}

export type ChartOptions = {
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
  imports: [NgApexchartsModule],
  templateUrl: './kpi-grafico-torta.component.html',
  styleUrl: './kpi-grafico-torta.component.css',
})
export class KpiGraficoTortaComponent implements OnChanges {
  @Input() titulo = '';
  @Input() data: KpiTortaItem[] = [];

  chartOptions!: ChartOptions;

  ngOnChanges(): void {
    if (!this.data?.length) return;

    this.chartOptions = {
      series: this.data.map((d) => d.value),
      labels: this.data.map((d) => d.label),
      colors: this.data.map((d) => d.color ?? '#999'),
      chart: {
        type: 'pie',
        height: 200,
      },
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
