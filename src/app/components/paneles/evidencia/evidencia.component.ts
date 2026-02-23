import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { AssetsService } from '../../../services/assets.service';
import { UtilidadesService } from '../../../services/utilidades.service';
import { FiltroAssets } from '../../../models/filtro-assets';
import { EvidenciaFiltroComponent } from './evidencia-filtro/evidencia-filtro.component';
import { GraficoPotenciaComponent } from './grafico-potencia/grafico-potencia.component';
import { GraficoPotenciaPorDiaComponent } from './grafico-potencia-por-dia/grafico-potencia-por-dia.component';

// Modelo
import { Evidencia, ZonasIA} from '../../../models/evidencia-potencia';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EvidenciaPotenciaService } from '../../../services/evidencia-potencia.service';
import { lastValueFrom, forkJoin } from 'rxjs';
import { EvidenciaTablaComponent } from "./evidencia-tabla/evidencia-tabla.component";
import { EvidenciaGenerico } from '../../../models/evidencia-generico';
import { GraficoGenericoComponent } from "./grafico-generico/grafico-generico.component";

@Component({
  selector: 'app-evidencia',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIcon,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    GraficoPotenciaComponent,
    GraficoPotenciaPorDiaComponent,
    EvidenciaTablaComponent,
    GraficoGenericoComponent
],
  providers: [DatePipe],
  templateUrl: './evidencia.component.html',
  styleUrl: './evidencia.component.css',
})
export class EvidenciaComponent {
  private _snackBar = inject(MatSnackBar);

  // Filtro
  nombreAssets: string[] = [];
  range = { start: new Date(), end: new Date() };
  selectedAsset: FiltroAssets = { id: 0, code: '' };
  assetsFiltro: FiltroAssets[] = [];

  selectedAssetIds: number[] = [];

  cargando = false;
  perDay = false;

  // Evidencias separadas por tipo
  evidenciasPower: Evidencia[] = [];
  evidenciasCurrent: EvidenciaGenerico[] = [];
  evidenciasTension: EvidenciaGenerico[] = [];
  evidenciasZonasIA: {
    assetId: number;
    code: string;
    tareas: ZonasIA[];
  }[] = [];

  // Data sources
  dataSourceEvidencias = new MatTableDataSource<Evidencia>([]);

  // ViewChild
  @ViewChild('paginatorEvidencias', { static: false })
  paginatorEvidencias!: MatPaginator; // Paginador para evidencias

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private assetsService: AssetsService,
    private evidenciaPotenciaService: EvidenciaPotenciaService,
    private datePipe: DatePipe,
  ) {}

  // Cargar datos
  // Load de activos
  async loadDataAssets() {
    try {
      const response = await this.assetsService.getFiltroAssets().toPromise();
      this.assetsFiltro = response?.length ? response : [];
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  // Load de evidencias por filtro
  async loadDataEvidenciasByFilter() {
    this.evidenciasPower = [];
    this.evidenciasCurrent = [];
    this.evidenciasTension = [];
    this.evidenciasZonasIA = [];
    this.dataSourceEvidencias.data = [];

    if (!this.selectedAsset?.id) return;

    const formattedStart =
      this.datePipe.transform(this.range.start, 'yyyy-MM-dd HH:mm:ss') ?? '';

    const formattedEnd =
      this.datePipe.transform(this.range.end, 'yyyy-MM-dd HH:mm:ss') ?? '';

    // ARRAY CON PADRE + SUBACTIVOS
    const assetsAConsultar: { id: number; type: string }[] = [
      {
        id: this.selectedAsset.id,
        type: 'tablero_electrico', // el padre siempre es tablero
      },
      ...(this.selectedAsset.subAssets ?? []),
    ];

    for (const sa of assetsAConsultar) {

      try {
        const result = await this.ejecutarSubAsset(
          sa,
          formattedStart,
          formattedEnd,
        );

        if (!result.data) continue;

        if (result.tipo === 'tablero_electrico') {
          this.evidenciasPower.push(result.data.power);
          this.evidenciasCurrent.push(result.data.current);
          this.evidenciasTension.push(result.data.tension);
        }

        if (result.tipo === 'camara' && result.data?.length) {
          this.evidenciasZonasIA.push({
            assetId: sa.id,
            code: result.data[0].code,
            tareas: result.data,
          });
        }
      } catch (e) {
        console.error('Error inesperado procesando asset', sa, e);

        this._snackBar.open('Error filtrando evidencias', 'Cerrar', {
          duration: 3000,
        });
      }
    }
  }

  // Helper para ejecutar una promesa por sub-activo
  private async ejecutarSubAsset(
    sa: { id: number; type: string },
    desde: string,
    hasta: string,
  ): Promise<{ tipo: 'tablero_electrico' | 'camara'; data: any | null }> {
    try {
      // TABLERO ELECTRICO
      if (sa.type === 'tablero_electrico') {
        const res = await lastValueFrom(
          forkJoin({
            power: this.evidenciaPotenciaService.getEvidenciaPowerById(
              sa.id,
              desde,
              hasta,
            ),
            current: this.evidenciaPotenciaService.getEvidenciaCurrentById(
              sa.id,
              desde,
              hasta,
            ),
            tension: this.evidenciaPotenciaService.getEvidenciaTensionById(
              sa.id,
              desde,
              hasta,
            ),
          }),
        );

        return { tipo: 'tablero_electrico', data: res };
      }

      // CAMARA
      if (sa.type === 'camara') {
        const res = await lastValueFrom(
          this.evidenciaPotenciaService.getEvidenciaZonasIaById(
            sa.id,
            desde,
            hasta,
          ),
        );

        return { tipo: 'camara', data: res };
      }

      // Tipo desconocido
      return { tipo: 'tablero_electrico', data: null };
    } catch (err) {
      console.warn(`SubAsset ${sa.id} (${sa.type}) falló`, err);

      return {
        tipo: sa.type === 'camara' ? 'camara' : 'tablero_electrico',
        data: null,
      };
    }
  }

  ngOnInit() {
    this.loadDataAssets();
    this.loadDataEvidenciasByFilter();
  }

  async cargarDatos() {
    if (
      this.range.end.getTime() - this.range.start.getTime() >
      7 * 24 * 60 * 60 * 1000
    ) {
      this.perDay = true;
    } else {
      this.perDay = false;
    }
    this.cdr.detectChanges();
  }

  async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(EvidenciaFiltroComponent, {
      width: '400px',
      data: {
        start: this.range.start,
        end: this.range.end,
        opciones: this.assetsFiltro.map((item) => ({
          value: item.id,
          viewValue: item.code,
        })),
        selectedAssets: this.selectedAssetIds,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;

      this.cargando = true;
      this.range = result.dateRange;

      const selectedIds: number[] = result.selectedOptions.map((x: string) =>
        Number(x),
      );

      this.selectedAssetIds = result.selectedOptions ?? [];

      const selectedAssets = this.assetsFiltro.filter((item) =>
        selectedIds.includes(item.id),
      );

      if (selectedAssets.length > 0) {
        this.selectedAsset = selectedAssets[0];
        this.nombreAssets = selectedAssets.map((a) => a.code);

        // PASO NUEVO (ACÁ)
        const assetCompleto = await lastValueFrom(
          this.assetsService.getAssetById(this.selectedAsset.id),
        );

        this.selectedAsset.subAssets = assetCompleto.sub_asset.map((sa) => ({
          id: sa.id_asset,
          type: sa.assettype,
        }));
      }

      // Ajuste de fechas (igual que antes)
      if (this.range.start && this.range.end) {
        this.range.start.setHours(0, 0, 0, 0);

        const endDate = new Date(this.range.end);
        const hoy = new Date();

        if (
          endDate.getFullYear() === hoy.getFullYear() &&
          endDate.getMonth() === hoy.getMonth() &&
          endDate.getDate() === hoy.getDate()
        ) {
          this.range.end = hoy;
        } else {
          endDate.setHours(23, 59, 59, 999);
          this.range.end = endDate;
        }

        await this.cargarDatos();
        await this.loadDataEvidenciasByFilter();
      }

      this.cargando = false;
    });
  }

  async recargar() {
    this.cargando = true;

    await this.cargarDatos();
    await this.loadDataEvidenciasByFilter();

    this.cargando = false;
  }
}
