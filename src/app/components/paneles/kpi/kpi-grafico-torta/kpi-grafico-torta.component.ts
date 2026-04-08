import { Component, Input, OnChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexDataLabels,
  ChartType,
  ApexTooltip,
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { CHART_COLORS } from '../../../../constants/chart-colors.constants';

interface PieDataItem {
  valor: number;
  estado: string;
}

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-kpi-grafico-torta',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './kpi-grafico-torta.component.html',
  styleUrl: './kpi-grafico-torta.component.css',
})
export class KpiGraficoTortaComponent implements OnChanges {
  @Input() data: PieDataItem[] = [];

  chartOptions?: PieChartOptions;

  private ESTADO_TRANSLATE: Record<string, string> = {
    folding: 'Plegado',
    planing: 'Planificacion',
    measure: 'Medicion',
    tunning: 'Ajuste',
    mixed: 'Mixto',
    undefined: 'Indefinido',
    start_end: 'Inicio_Fin',
    mantenimiento: 'Mantenimiento',
    apagado: 'Apagado',
  };

  private ESTADO_COLORS: Record<string, string> = {
    Planificacion: CHART_COLORS.SUCCESS,
    Plegado: CHART_COLORS.COMPLEMENTARY,
    Mixto: CHART_COLORS.WARNING,
    Medicion: CHART_COLORS.DARK_1,
    Indefinido: CHART_COLORS.ERROR,
    Ajuste: CHART_COLORS.DARK_2,
    Inicio_Fin: CHART_COLORS.LIGHT_1,
    Mantenimiento: CHART_COLORS.BASE,
    Apagado: CHART_COLORS.TEXT_DARK,
  };

  ngOnChanges(): void {
    if (!this.data || this.data.length === 0) {
      this.chartOptions = undefined;
      return;
    }

    const normalize = (text: string): string => {
      return text?.toLowerCase().trim();
    };

    const translate = (estado: string): string => {
      const key = normalize(estado);
      return this.ESTADO_TRANSLATE[key] || estado; // fallback: deja el original
    };

    const series = this.data.map((item) => item.valor);

    const labels = this.data.map((item) => translate(item.estado));

    const colors = this.data.map((item) => {
      const estadoTraducido = translate(item.estado);
      return (
        this.ESTADO_COLORS[estadoTraducido] || CHART_COLORS.LIGHT_2 // fallback
      );
    });

    this.chartOptions = {
      series,

      chart: {
        type: 'pie' as ChartType,
        height: 250,
      },

      labels,

      colors,

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
          return `${seriesName}: ${value.toFixed(2)}%`;
        },
      },

      tooltip: {
        y: {
          formatter: (val: number) => `${val.toFixed(2)}%`,
        },
      },
    };
  }
}
