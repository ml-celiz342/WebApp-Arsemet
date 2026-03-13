import { Component, Input, OnChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexXAxis,
  ApexTooltip,
  ChartComponent,
  ChartType,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CHART_COLORS } from '../../../../constants/chart-colors.constants';
import { CommonModule } from '@angular/common';
import { ZonasTareasEstado } from '../../../../models/kpi-temporales';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  colors?: string[];
};

@Component({
  selector: 'app-kpi-grafico-gantt',
  standalone: true,
  imports: [ChartComponent, NgApexchartsModule, CommonModule],
  templateUrl: './kpi-grafico-gantt.component.html',
  styleUrl: './kpi-grafico-gantt.component.css',
})
export class KpiGraficoGanttComponent implements OnChanges {
  @Input() data: ZonasTareasEstado[] = [];

  chartOptions!: ChartOptions;

  ngOnChanges(): void {
    if (!this.data || this.data.length === 0) {
      this.chartOptions = undefined as any;
      return;
    }

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
        toolbar: { show: true },
      },

      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '60%',
        },
      },

      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
        },
      },

      dataLabels: {
        enabled: false,
      },

      legend: {
        position: 'top',
      },

      tooltip: {
        custom: ({ seriesIndex, dataPointIndex, w }) => {
          const point = w.config.series[seriesIndex].data[dataPointIndex];

          const inicio = new Date(point.y[0]).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });

          const fin = new Date(point.y[1]).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });

          return `
            <div style="padding:8px">
              <strong>${point.x}</strong><br/>
              ${inicio} - ${fin}
            </div>
          `;
        },
      },
    };
  }

  private buildSeries(data: ZonasTareasEstado[]) {
    const sorted = [...data].sort((a, b) => {
      if (a.state === 'Start_end' && b.state !== 'Start_end') return 1;
      if (b.state === 'Start_end' && a.state !== 'Start_end') return -1;

      return new Date(a.from).getTime() - new Date(b.from).getTime();
    });

    return sorted.map((item) => ({
      x: this.ESTADO_LABELS[item.state] ?? item.alias,
      y: [new Date(item.from).getTime(), new Date(item.to).getTime()],
      fillColor: this.ESTADO_COLORS[item.state] ?? '#999999',
    }));
  }

  private ESTADO_COLORS: Record<string, string> = {
    operativo: CHART_COLORS.ERROR,
    operativo_en_vacio: CHART_COLORS.WARNING,
    Start_end: CHART_COLORS.DARK_2,
  };

  private ESTADO_LABELS: Record<string, string> = {
    operativo: 'Operativo',
    operativo_en_vacio: 'Operativo en vacío',
    Start_end: 'Inicio/ Fin de Turno',
  };
}
