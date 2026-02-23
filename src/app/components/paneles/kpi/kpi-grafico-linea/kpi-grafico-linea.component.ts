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
    hora: string;
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

  chartOptions!: ChartOptions;

  ngOnChanges(): void {
    if (!this.data || this.data.length === 0) return;

    const categorias = this.data[0].data.map((d) => d.hora);

    const series = this.data.map((serie) => ({
      name: serie.name,
      data: serie.data.map((d) => d.valor),
    }));

    this.chartOptions = {
      series,

      chart: {
        type: 'line' as ChartType,
        height: 260,
        toolbar: { show: true },
      },

      xaxis: {
        categories: categorias,
      },

      stroke: {
        width: 3,
        curve: 'smooth',
      },

      colors: [CHART_COLORS.WARNING],
    };
  }
}
