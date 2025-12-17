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
  ApexStroke,
  ApexFill,
} from 'ng-apexcharts';
import { CHART_COLORS } from '../../../../constants/chart-colors.constants';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  fill: ApexFill;
  colors: string[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-kpi-resumen-grafico',
  imports: [NgApexchartsModule],
  templateUrl: './kpi-resumen-grafico.component.html',
  styleUrl: './kpi-resumen-grafico.component.css',
})
export class KpiResumenGraficoComponent implements OnInit, OnChanges {
  @ViewChild('chartHoras', { static: false }) chart!: ChartComponent;
  @ViewChild('chartContainerHoras', { static: false })
  chartContainer!: ElementRef;
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() ejeyData: number[] = [];
  @Input() label: string = '';
  @Input() labelsX: string[] = [];
  @Input() unidadVisual: string = '';
  @Input() limite: number = 60;

  chartOptions!: ChartOptions;

  private resizeObserver: ResizeObserver | undefined;

  constructor() {}

  ngOnInit() {
    this.chartOptions = {
      series: [
        {
          name: 'Test',
          data: this.ejeyData,
        },
      ],
      chart: {
        type: 'area',
        height: '100%',
        width: '100%',
        sparkline: {
          enabled: true,
        },
      },
      stroke: {
        curve: 'straight',
        width: 2,
      },
      fill: {
        opacity: 1,
      },
      colors: [CHART_COLORS.BASE], // Color de las barras}
      title: {
        text: this.titulo,
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
      subtitle: {
        text: this.subtitulo,
        align: 'center',
        style: {
          fontSize: '14px',
          color: '#666',
        },
      },
      xaxis: {
        type: 'category',
        categories: this.labelsX,
      },
      yaxis: {
        min: 0,
        max: this.limite,
      },
      tooltip: {
        y: {
          formatter: (val: number) => val + ' [' + this.unidadVisual + ']',
        },
        style: {
          fontSize: '10px',
        },
        fixed: {
          enabled: true,
          position: 'topRight', // o 'topLeft', 'bottomRight', 'bottomLeft'
          offsetX: 0,
          offsetY: 0,
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

      this.chart.updateOptions({
        xaxis: {
          categories: this.labelsX, // <-- asegurate que esté definido
        },
        subtitle: {
          text: this.subtitulo,
        },
        yaxis: {
          min: 0,
          max: this.limite,
          show: false,
        },
        tooltip: {
          y: {
            formatter: (val: number) => this.formatear(val),
          },
        },
      });
    }
  }

  formatear (val: number){
    if (this.unidadVisual === 'hrs') {
      const horas = Math.floor(val);
      const minutos = Math.round((val - horas) * 60);
      const hh = String(horas).padStart(2, '0');
      const mm = String(minutos).padStart(2, '0');
      return `${hh}:${mm} [${this.unidadVisual}]`;
    } else {
      return `${val} [${this.unidadVisual}]`;
    }
  }



  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
