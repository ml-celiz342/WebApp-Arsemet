import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProduccionInfoComponent } from './produccion-info/produccion-info.component';
import { MatCard } from "@angular/material/card";
import svgPanZoom from 'svg-pan-zoom';
import { State } from '../../../models/state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from '../../../services/state.service';
import { interval, lastValueFrom, Subscription, switchMap } from 'rxjs';
import { AssetsService } from '../../../services/assets.service';
import { CHART_COLORS } from '../../../constants/chart-colors.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ProduccionInfoComponent, MatCard],
  templateUrl: './produccion.component.html',
  styleUrl: './produccion.component.css',
})
export class ProduccionComponent implements AfterViewInit {
  title = 'miMapa';
  hoveredCode: string = '';
  panZoomInstance: any;

  private _snackBar = inject(MatSnackBar);

  // Actualizaciones automaticas
  stateSubscription!: Subscription;

  // Estados, activos y tipos de activos
  estados: any[] = [];
  activos: any[] = [];
  tiposActivos: any[] = [];

  // Data sources
  dataSourceStates = new MatTableDataSource<State>([]);

  // ViewChilds
  @ViewChild('svgElement', { static: false }) svgElement!: ElementRef;
  @ViewChild('paginatorStates', { static: false })
  paginatorStates!: MatPaginator; // Paginador para estados

  tooltipX: number = 0;
  tooltipY: number = 0;

  // Constructor
  constructor(
    private stateService: StateService,
    private activosService: AssetsService
  ) {}

  ngOnInit() {
    this.loadDataAssets();
    this.loadDataTiposActivos();
    this.loadDataStates();
    this.iniciarActualizacionEstados();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initPanZoom();
      this.addEventListeners();
      this.pintarEstadosEnSvg();
    }, 100);

    this.dataSourceStates.paginator = this.paginatorStates;
  }

  // Carga de datos
  // Load de activos
  async loadDataAssets() {
    try {
      const response = await lastValueFrom(this.activosService.getAssets());
      if (response.length !== 0) {
        this.activos = response;
      } else {
        this.activos = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  // Load de tipos de activos
  async loadDataTiposActivos() {
    try {
      const response = await lastValueFrom(this.activosService.getAssetsType());

      if (response.length !== 0) {
        this.tiposActivos = response;
      } else {
        this.tiposActivos = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los tipos de activos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  // Load de state
  async loadDataStates() {
    try {
      const response = await lastValueFrom(this.stateService.getStates());

      if (response.length !== 0) {
        this.dataSourceStates.data = response;
      } else {
        this.dataSourceStates.data = [];
      }

      // Cargar estados y asignar: COORDENADAS Y TIPO DE ACTIVO segun ID
      this.estados = this.dataSourceStates.data.map((estado: any) => {
        // Tipo de activo
        const activo = this.activos.find((a) => a.id === estado.id); // Buscar activo por id
        const idType = activo ? activo.id_type : null; // Id del tipo de activo
        const tipoActivo = this.tiposActivos.find((t) => t.id === idType); // Buscar tipo de activo por idType
        const type = tipoActivo ? tipoActivo.nombre : ''; // Nombre del tipo de activo

        return {
          ...estado,
          type,
        };
      });

      setTimeout(() => {
        this.pintarEstadosEnSvg();
      }, 0);
    } catch (err) {
      this._snackBar.open('Error al obtener los estados', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  // Actualizacion automatica de estados
  iniciarActualizacionEstados(): void {
    // Llamada inmediata
    this.stateService.getStates().subscribe((response) => {
      this.procesarEstados(response);
    });

    // Repeticion cada 2 minutos
    this.stateSubscription = interval(120000)
      .pipe(switchMap(() => this.stateService.getStates()))
      .subscribe((response) => {
        this.procesarEstados(response);
      });
  }

  private procesarEstados(response: State[]): void {
    if (!response || response.length === 0) {
      this.dataSourceStates.data = [];
      this.estados = [];

      setTimeout(() => {
        this.pintarEstadosEnSvg();
      }, 0);

      return;
    }

    // Actualizar tabla
    this.dataSourceStates.data = response;

    // Agregar COORDENADAS y TIPO DE ACTIVO segun ID
    this.estados = response.map((estado: State) => {
      // Tipo de activo
      const activo = this.activos.find((a) => a.id === estado.id); // Buscar activo por id
      const idType = activo ? activo.id_type : null; // Id del tipo de activo
      const tipoActivo = this.tiposActivos.find((t) => t.id === idType); // Buscar tipo de activo por idType
      const type = tipoActivo ? tipoActivo.nombre : ''; // Nombre del tipo de activo

      return {
        ...estado,
        type,
      };
    });
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
  }

  // Zoom
  initPanZoom() {
    if (this.svgElement && this.svgElement.nativeElement) {
      this.panZoomInstance = svgPanZoom(this.svgElement.nativeElement, {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
        minZoom: 0.5,
        maxZoom: 10,
        zoomScaleSensitivity: 0.3,
      });

      // Personalizar tooltips en español
      setTimeout(() => {
        const zoomIn = document.querySelector('.svg-pan-zoom-zoom-in');
        const zoomOut = document.querySelector('.svg-pan-zoom-zoom-out');
        const reset = document.querySelector('.svg-pan-zoom-reset-pan-zoom');

        if (zoomIn) zoomIn.setAttribute('title', 'Acercar');
        if (zoomOut) zoomOut.setAttribute('title', 'Alejar');
        if (reset) reset.setAttribute('title', 'Restablecer');
      }, 200);
    }
  }

  private actualizarTooltip(element: SVGGraphicsElement) {
    const svgRect = this.svgElement.nativeElement.getBoundingClientRect();
    const rectBox = element.getBoundingClientRect();

    this.tooltipX = rectBox.left - svgRect.left + rectBox.width / 2;

    this.tooltipY = rectBox.top - svgRect.top;
  }

  // Eventos al tocar el area del plano
  addEventListeners() {
    const targetIds = ['1', '2'];

    targetIds.forEach((id) => {
      const element = document.getElementById(id) as unknown as SVGGraphicsElement;
      if (!element) return;

      element.addEventListener('click', () => {
        const estado = this.estados.find((e) => e.id === Number(id));
        const code = estado?.code ?? '';
        const type = estado?.type ?? '';
        this.abrirModal(Number(id), code, type);
      });

      element.addEventListener('mouseover', () => {
        const estado = this.estados.find((e) => e.id === Number(id));
        this.hoveredCode = estado?.code ?? '';
        this.actualizarTooltip(element);
      });

      element.addEventListener('mousemove', () => {
        this.actualizarTooltip(element);
      });

      element.addEventListener('mouseout', () => {
        this.hoveredCode = '';
      });
    });
  }

  resetZoom() {
    if (this.panZoomInstance) {
      this.panZoomInstance.reset();
    }
  }

  // Estado clase
  estadoClase(estado: string) {
    return (
      {
        Crítico: 'critico',
        Advertencia: 'advertencia',
        Información: 'informacion',
        Normal: 'normal',
        Desconectado: 'desconectado',
      }[estado] || 'normal'
    );
  }

  private obtenerRectDePattern(patternId: string): SVGRectElement | null {
    let pattern = document.getElementById(
      patternId
    ) as unknown as SVGPatternElement;
    if (!pattern) return null;

    while (pattern.hasAttribute('xlink:href')) {
      const refId = pattern.getAttribute('xlink:href')!.replace('#', '');

      pattern = document.getElementById(refId) as unknown as SVGPatternElement;
      if (!pattern) return null;
    }

    const rect = pattern.querySelector('rect');
    return rect instanceof SVGRectElement ? rect : null;
  }

  private colorPorEstado(state: string): string {
    switch (state) {
      case 'critico':
        return CHART_COLORS.ERROR;
      case 'advertencia':
        return CHART_COLORS.WARNING;
      case 'informacion':
        return CHART_COLORS.SUCCESS;
      case 'normal':
        return CHART_COLORS.BASE;
      case 'desconectado':
        return CHART_COLORS.TEXT_LIGHT;
      default:
        return CHART_COLORS.TEXT_LIGHT;
    }
  }

  pintarEstadosEnSvg(): void {
    this.estados.forEach((estado) => {
      const elemento = document.getElementById(
        String(estado.id)
      ) as unknown as SVGRectElement;
      if (!elemento) return;

      const fill = elemento.getAttribute('fill');
      if (!fill || !fill.startsWith('url(')) return;

      const patternId = fill.replace('url(#', '').replace(')', '');
      const rectPattern = this.obtenerRectDePattern(patternId);
      if (!rectPattern) return;

      // definir color por estado
      const clase = this.estadoClase(estado.state);
      const color = this.colorPorEstado(clase);

      // aplicar color al patrón
      rectPattern.setAttribute('fill', color);
    });
  }

  // MODAL
  // Variables
  modalAbierto = false;
  modalId = 0;
  modalNombre = '';
  modalTipo = '';

  // Modal control
  abrirModal(id: number, code: string, type: string) {
    this.modalId = id;
    this.modalNombre = code;
    this.modalTipo = type;
    this.modalAbierto = true;
  }

  // Cerrar modal
  cerrarModal() {
    this.modalAbierto = false;
  }
}
