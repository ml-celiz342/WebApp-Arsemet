import { Component, Input, OnChanges } from '@angular/core';
import {
  ChartComponent,
  NgApexchartsModule,
  ChartType,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { CHART_COLORS } from '../../../../constants/chart-colors.constants';

type SerieBarraSimple = {
  name: string;
  data: {
    categoria: string;
    valor: number;
  }[];
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  colors: string[];
};

@Component({
  selector: 'app-kpi-grafico-barra',
  standalone: true,
  imports: [ChartComponent, NgApexchartsModule, CommonModule],
  templateUrl: './kpi-grafico-barra.component.html',
  styleUrl: './kpi-grafico-barra.component.css',
})
export class KpiGraficoBarraComponent implements OnChanges {
  @Input() data: SerieBarraSimple[] = [];

  chartOptions!: ChartOptions;

  ngOnChanges(): void {
    if (!this.data || this.data.length === 0) return;

    const categorias = this.data[0].data.map((d) => d.categoria);

    const series = this.data.map((serie) => ({
      name: serie.name,
      data: serie.data.map((d) => d.valor),
    }));

    this.chartOptions = {
      series,

      chart: {
        type: 'bar' as ChartType,
        height: 260,
        toolbar: { show: false },
      },

      xaxis: {
        categories: categorias,
      },

      dataLabels: {
        enabled: true,
      },

      colors: [CHART_COLORS.ERROR],
    };
  }
}
