import { Component } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';

type SeriePromedio = {
  name: string;
  data: {
    fecha: string;
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
export class KpiGraficoBarraApiladoComponent {
  @Input() data: SeriePromedio[] = [];

  chartOptions!: ChartOptions;

  ngOnChanges(): void {
    if (!this.data || this.data.length === 0) return;

    // Categorías → DD/MM
    const categories = this.data[0].data.map((d) => this.formatFecha(d.fecha));

    // Series
    const series = this.data.map((serie) => ({
      name: serie.name,
      data: serie.data.map((d) => d.valor),
    }));

    this.chartOptions = {
      series,

      chart: {
        type: 'bar' as ChartType,
        height: 240,
        stacked: true,
        toolbar: { show: false },
      },

      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 6,
        },
      },

      xaxis: {
        categories,
        labels: {
          rotate: -45,
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

      colors: [CHART_COLORS.BASE, CHART_COLORS.DARK_2],
    };
  }

  private formatFecha(fecha: string): string {
    const [datePart] = fecha.split(' ');
    const [day, month] = datePart.split('/');
    return `${day}/${month}`;
  }
}
