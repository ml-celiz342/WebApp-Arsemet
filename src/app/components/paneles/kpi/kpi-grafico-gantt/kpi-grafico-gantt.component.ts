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
    if (!this.data || this.data.length === 0) return;

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
    return data.map((item) => ({
      x: item.alias,
      y: [new Date(item.from).getTime(), new Date(item.to).getTime()],
      fillColor: this.ESTADO_COLORS[item.state] ?? '#999999',
    }));
  }

  private ESTADO_COLORS: Record<string, string> = {
    Planning: CHART_COLORS.BASE,
    Folding: CHART_COLORS.COMPLEMENTARY,
    Work_Zone: CHART_COLORS.SUCCESS,
    Mixed: CHART_COLORS.WARNING,
    Measure: CHART_COLORS.DARK_1,
    Undefined: CHART_COLORS.ERROR,
    Tunning: CHART_COLORS.DARK_2,
  };
}
