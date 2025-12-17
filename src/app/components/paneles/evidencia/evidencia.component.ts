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
import { Evidencia} from '../../../models/evidencia-potencia';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EvidenciaPotenciaService } from '../../../services/evidencia-potencia.service';
import { lastValueFrom } from 'rxjs';

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

  cargando = false;
  perDay = false;

  // Evidencias separadas por tipo
  evidenciasPower: Evidencia[] = [];

  // Data sources
  dataSourceEvidencias = new MatTableDataSource<Evidencia>([]);

  // ViewChild
  @ViewChild('paginatorEvidencias', { static: false })
  paginatorEvidencias!: MatPaginator; // Paginador para evidencias

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private assetsService: AssetsService,
    private utilidades: UtilidadesService,
    private evidenciaPotenciaService: EvidenciaPotenciaService
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

    // Resetear arreglos
    this.evidenciasPower = [];
    this.dataSourceEvidencias.data = [];

    if (!this.selectedAsset?.subAssets?.length) {
      return;
    }

    const desde = this.range.start.toISOString();
    const hasta = this.range.end.toISOString();

    try {
      const requests = this.selectedAsset.subAssets.map((sa) => {

        console.log(`→ Llamando API para subAsset ${sa.id} (${sa.type})`);

        return lastValueFrom(
          this.evidenciaPotenciaService.getEvidenciaPowerById(
            sa.id,
            desde,
            hasta
          )
        );
      });

      const responses = await Promise.all(requests);

      responses.forEach((res) => {
        if (!res) return;
        this.evidenciasPower.push(res);
      });

    } catch (error) {
      console.error('Error filtrando evidencias', error);
      this._snackBar.open('Error filtrando evidencias', 'Cerrar', {
        duration: 3000,
      });
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
        selectedAssets: this.nombreAssets,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;

      this.cargando = true;
      this.range = result.dateRange;

      const selectedIds: number[] = result.selectedOptions.map((x: string) =>
        Number(x)
      );

      const selectedAssets = this.assetsFiltro.filter((item) =>
        selectedIds.includes(item.id)
      );

      if (selectedAssets.length > 0) {
        this.selectedAsset = selectedAssets[0];
        this.nombreAssets = selectedAssets.map((a) => a.code);

        // PASO NUEVO (ACÁ)
        const assetCompleto = await lastValueFrom(
          this.assetsService.getAssetById(this.selectedAsset.id)
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

    // Crear fechas del día actual
    const hoy = new Date();

    const inicio = new Date(hoy);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(hoy);
    fin.setHours(23, 59, 59, 999);

    // Aplicar al filtro del componente
    this.range = { start: inicio, end: fin };

    // Resetear filtro de activo seleccionado ("Todos")
    this.selectedAsset = { id: 0, code: '' };

    // Recargar tablas de activos y evidencias
    await this.cargarDatos();
    await this.loadDataAssets();
    await this.loadDataEvidenciasByFilter();

    this.cargando = false;
  }
}
