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
import { ZonasTareasEstado } from '../../../../models/kpi-temporales';

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
  @Input() data: ZonasTareasEstado[] = [];

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
  private buildSeries(data: ZonasTareasEstado[]) {
    return data.map((item) => {
      return {
        x: item.alias, // alias directo de la API
        y: [new Date(item.from).getTime(), new Date(item.to).getTime()],
        fillColor: this.ESTADO_COLORS[item.state] ?? '#999999',
      };
    });
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
