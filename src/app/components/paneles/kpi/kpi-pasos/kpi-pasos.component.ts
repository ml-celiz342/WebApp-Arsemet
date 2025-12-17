import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  NgApexchartsModule,
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
} from 'ng-apexcharts';
import { CHART_COLORS } from '../../../../constants/chart-colors.constants';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  colors: string[];
};

@Component({
  selector: 'app-kpi-pasos',
  imports: [NgApexchartsModule],
  templateUrl: './kpi-pasos.component.html',
  styleUrl: './kpi-pasos.component.css',
})
export class KpiPasosComponent implements OnInit, OnChanges {
  @ViewChild('chartPasos', { static: false }) chart!: ChartComponent;
  @ViewChild('chartContainerPasos', { static: false })chartContainer!: ElementRef;

  @Input() ejeyData: number[] = [];
  @Input() label: string = '';

  chartOptions!: ChartOptions;

  private resizeObserver: ResizeObserver | undefined;

  constructor() {}

  ngOnInit() {
    this.chartOptions = {
      series: [{ name: this.label, data: this.ejeyData }],
      chart: {
        type: 'bar', // Cambio a gráfico de barras
        height: '100%',
        width: '100%',
        stacked: false,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
          type: 'x',
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758'],
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top',
          },
        },
      },
      colors: [CHART_COLORS.BASE], // Color de las barras}
      title: {
        text: 'Carga de bobinas',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
      xaxis: {
        type: 'category',
        categories: ['Izar', 'Trasladar', 'Acomodar', 'Depositar'],
        title: {
          text: 'Pasos',
          style: {
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        min: 0,
        tickAmount: 5,
        title: {
          text: 'Cantidad correcta', // Etiqueta personalizada en el eje Y
          style: {
            fontSize: '12px',
          },
        },
      },
    };
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateChart();
    });

    if (this.chartContainer) {
      this.resizeObserver.observe(this.chartContainer.nativeElement);
    }

    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateChart();
  }

  updateChart() {
    if (this.chart) {
      this.chart.updateSeries([{ name: this.label, data: this.ejeyData }]);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
