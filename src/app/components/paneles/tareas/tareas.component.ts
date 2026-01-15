import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TasksService } from '../../../services/tasks.service';
import { Tarea} from '../../../models/tasks';
import { AuthService } from '../../../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { TareasFiltroComponent } from './tareas-filtro/tareas-filtro.component';
import { AssetsService } from '../../../services/assets.service';
import { FiltroAssets } from '../../../models/filtro-assets';
import { MatSelectModule } from '@angular/material/select';
import { CsvService } from '../../../services/csv.service';
import { TareasCargarCsvComponent } from './tareas-cargar-csv/tareas-cargar-csv.component';
import { TareasDetalleComponent } from './tareas-detalle/tareas-detalle.component';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-tareas',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatBadgeModule,
    MatListModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatSortHeader,
    MatSort,
    MatSortModule,
  ],
  providers: [DatePipe],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css',
})
export class TareasComponent {
  cargando = false;
  perDay = false;

  // Filtro por fechas
  range = { start: new Date(), end: new Date() };

  // Activos filtro
  assetsFiltro: FiltroAssets[] = [];

  // Mapa para id_activo - code
  assetCodeMap = new Map<number, string>();

  // Para metodo agregar/ editar tareas
  activos: number[] = [];

  // Ordenar por fecha
  ordenFecha: 'asc' | 'desc' = 'desc';

  // Columnas tabla de tareas
  displayedColumnsTasks: string[] = [
    'codigo_activo',
    'codigo_articulo',
    'ciclo_fecha_fin',
    'ciclo_fecha_inicio_est',
    'ciclo_fecha_inicio_medida',
    'pza_cant_prog',
    'pza_cant_buenas',
    'pza_cant_malas',
    'pza_cant_usuario',
    'detalle',
  ];
  dataSourceTasks = new MatTableDataSource<Tarea>([]);
  @ViewChild('paginatorTasks') paginatorTasks!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  private _snackBar = inject(MatSnackBar);

  // Constructor
  constructor(
    private dialog: MatDialog,
    private tasksService: TasksService,
    private assetsService: AssetsService,
    private csvService: CsvService,
    public authService: AuthService,
    private dialogDescripcion: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.setRangoAHora();
    this.loadDataTasks();
    this.loadDataAssets();
  }

  ngAfterViewInit() {
    this.dataSourceTasks.paginator = this.paginatorTasks;
    this.dataSourceTasks.sort = this.sort;

    // Ordenar por codigo articulo
    this.dataSourceTasks.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'codigo_articulo':
          return item.article_code?.toLowerCase() ?? '';
        default:
          return (item as any)[property];
      }
    };
  }

  // Carga de datos
  // Cargar datos de tareas
  async loadDataTasks() {
    const formattedStart =
      this.datePipe.transform(this.range.start, 'yyyy-MM-dd HH:mm:ss') ?? '';
    const formattedEnd =
      this.datePipe.transform(this.range.end, 'yyyy-MM-dd HH:mm:ss') ?? '';

    try {
      const response = await lastValueFrom(
        this.tasksService.getTasks(formattedStart, formattedEnd, this.activos)
      );
      if (response.length !== 0) {
        this.dataSourceTasks.data = response;
      } else {
        this.dataSourceTasks.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
      this.dataSourceTasks.data = [];
    }
  }

  // Carga de datos de activos
  async loadDataAssets() {
    try {
      const response = await lastValueFrom(
        this.assetsService.getFiltroAssets(true)
      );
      if (response.length !== 0) {
        this.assetsFiltro = response;
        this.activos = this.assetsFiltro.map((item) => item.id);

        // Mapa id -> code
        this.assetCodeMap.clear();
        this.assetsFiltro.forEach((asset) => {
          this.assetCodeMap.set(asset.id, asset.code);
        });
      } else {
        this.assetsFiltro = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  setRangoAHora() {
    this.range.start = new Date();
    this.range.start.setHours(0, 0, 0, 0);

    this.range.end = new Date();
    this.range.end.setHours(23, 59, 59, 0);
  }

  // Filtros
  async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(TareasFiltroComponent, {
      width: '400px',
      data: {
        start: this.range.start,
        end: this.range.end,
        activos: this.assetsFiltro
          .filter((item) => this.activos.includes(item.id))
          .map((item) => item.code),
        activosList: this.assetsFiltro.map((item) => item.code),
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        this.range = result.dateRange;
        this.activos = this.assetsFiltro
          .filter((item) => result.activos.includes(item.code))
          .map((item) => item.id);
        if (this.activos.length > 0) {
          if (this.range.start && this.range.end) {
            this.range.start.setHours(0, 0, 0, 0);
            const endDate = new Date(this.range.end);
            endDate.setHours(23, 59, 59, 999);
            this.range.end = endDate;
            await this.loadDataTasks();
          }
        } else {
          this.dataSourceTasks.data = [];
        }
        this.cargando = false;
      }
    });
  }

  /* Cargar csv */
  cargarCsv(): void {
    const dialogRef = this.dialog.open(TareasCargarCsvComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((file: File | undefined) => {
      if (!file) return;

      this.csvService.uploadCsv(file).subscribe({
        next: () => {
          alert('Archivo cargado correctamente');
        },
        error: (err) => {
          alert(err?.error?.descripcion || 'Error al cargar el archivo');
        },
      });
    });
  }

  // Detalle de piezas
  async onDetalleClick(row: Tarea) {
    this.dialogDescripcion.open(TareasDetalleComponent, {
      data: row,
      width: '800px',
    });
  }

  // Obtener codigo de activo por id
  getAssetCode(idActivo: number): string {
    return this.assetCodeMap.get(idActivo) ?? '-';
  }

  async recargar() {
    this.cargando = true;

    await this.loadDataTasks();

    this.cargando = false;
  }
}
