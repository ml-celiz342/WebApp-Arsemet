import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent, ChartType, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexLegend,
  ApexFill,
} from 'ng-apexcharts';

import { CHART_COLORS } from '../../../../constants/chart-colors.constants';

type SeriePromedio = {
  name: string;
  data: {
    categoria: string;
    valor: number;
  }[];
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  colors: string[];
};

@Component({
  selector: 'app-kpi-grafico-barra-apilado',
  standalone: true,
  imports: [ChartComponent, NgApexchartsModule, CommonModule],
  templateUrl: './kpi-grafico-barra-apilado.component.html',
  styleUrl: './kpi-grafico-barra-apilado.component.css',
})
export class KpiGraficoBarraApiladoComponent implements OnChanges {

  @Input() data: SeriePromedio[] = [];

  chartOptions!: ChartOptions;

  ngOnChanges(): void {
    if (!this.data || this.data.length === 0) {
      return;
    }

    // categorías del eje X
    const categories = this.data[0].data.map(d => d.categoria);

    // series apiladas
    const series = this.data.map(serie => ({
      name: serie.name,
      data: serie.data.map(d => d.valor),
    }));

    this.chartOptions = {
      series,

      chart: {
        type: 'bar' as ChartType,
        height: 260,
        stacked: true,
        toolbar: { show: false },
      },

      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 6,
          columnWidth: '55%',
        },
      },

      xaxis: {
        categories,
        labels: {
          rotate: -45,
          rotateAlways: true,
          hideOverlappingLabels: false,
          trim: false,
          style: {
            fontSize: '11px',
          },
        },
      },

      legend: {
        position: 'top',
        horizontalAlign: 'center',
        markers: {
          shape: 'circle',
        },
      },

      fill: {
        opacity: 1,
      },

      colors: [
        CHART_COLORS.BASE, // kWh
        CHART_COLORS.DARK_2, // kvarh
      ],
    };
  }
}

