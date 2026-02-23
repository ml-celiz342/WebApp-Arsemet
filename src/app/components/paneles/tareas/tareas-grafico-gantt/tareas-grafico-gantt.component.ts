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
  ApexAnnotations,
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
  annotations?: ApexAnnotations;
};

@Component({
  selector: 'app-tareas-grafico-gantt',
  standalone: true,
  imports: [ChartComponent, NgApexchartsModule, CommonModule],
  templateUrl: './tareas-grafico-gantt.component.html',
  styleUrl: './tareas-grafico-gantt.component.css',
})
export class TareasGraficoGanttComponent implements OnChanges {
  @Input() data: ZonasTareasEstado[] = [];
  @Input() cycleStart!: string;
  @Input() cycleEnd!: string;
  @Input() rangeStart!: Date;
  @Input() rangeEnd!: Date;

  chartOptions!: ChartOptions;

  ngOnChanges(): void {
    if (!this.data || this.data.length === 0) return;

    // Lineas verticales para marcar el ciclo
    const startTimestamp = new Date(this.cycleStart).getTime();
    const endTimestamp = new Date(this.cycleEnd).getTime();

    // Rango para dibujar el grafico
    const rangeStartTimestamp = new Date(this.rangeStart).getTime();
    const rangeEndTimestamp = new Date(this.rangeEnd).getTime();

    console.log(this.rangeStart, this.rangeEnd);

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
        //min: rangeStartTimestamp,
        //max: rangeEndTimestamp,
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

      annotations: {
        xaxis: [
          {
            x: startTimestamp,
            borderColor: '#000',
            strokeDashArray: 4,
          },
          {
            x: endTimestamp,
            borderColor: '#000',
            strokeDashArray: 4,
          },
        ],
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
