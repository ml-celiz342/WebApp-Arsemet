import { Component, Input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexXAxis,
  ChartComponent,
  ChartType,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CHART_COLORS } from '../../../../constants/chart-colors.constants';
import { CommonModule } from '@angular/common';

type EstadoTiempo = {
  estado: string;
  fecha: string;
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip?: ApexTooltip;
  colors?: string[];
};

@Component({
  selector: 'app-kpi-grafico-gantt',
  standalone: true,
  imports: [ChartComponent, NgApexchartsModule, CommonModule],
  templateUrl: './kpi-grafico-gantt.component.html',
  styleUrl: './kpi-grafico-gantt.component.css',
})
export class KpiGraficoGanttComponent {
  @Input() data: EstadoTiempo[] = [];

  chartOptions!: ChartOptions;

  ngOnChanges(): void {
    if (!this.data || this.data.length < 2) return;

    const seriesData = this.buildSeries(this.data);

    this.chartOptions = {
      series: [
        {
          data: seriesData,
        },
      ],

      chart: {
        type: 'rangeBar' as ChartType,
        height: 240,
        toolbar: { show: false },
      },

      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '60%',
        },
      },

      xaxis: {
        type: 'datetime',
      },

      dataLabels: {
        enabled: false,
      },

      legend: {
        position: 'top',
      },
    };
  }

  // Transformacion
  private buildSeries(data: EstadoTiempo[]) {
    const result: any[] = [];

    for (let i = 0; i < data.length - 1; i += 2) {
      const inicio = data[i];
      const fin = data[i + 1];

      if (inicio.estado !== fin.estado) continue;

      result.push({
        x: inicio.estado,
        y: [new Date(inicio.fecha).getTime(), new Date(fin.fecha).getTime()],
        fillColor: this.ESTADO_COLORS[inicio.estado] ?? '#999999',
      });
    }

    return result;
  }

  private ESTADO_COLORS: Record<string, string> = {
    Apagado: CHART_COLORS.ERROR,
    Operativo: CHART_COLORS.WARNING,
    'Operativo en vacío': CHART_COLORS.LIGHT_2,
    Mantenimiento: CHART_COLORS.DARK_2,
  };
}
