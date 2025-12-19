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
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TasksService } from '../../../services/tasks.service';
import { TareaOperario } from '../../../models/tasks';
import { AuthService } from '../../../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmarComponent } from '../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { TareasFiltroComponent } from './tareas-filtro/tareas-filtro.component';
import { FiltroTareas } from '../../../models/filtro-tareas';
import { AssetsService } from '../../../services/assets.service';
import { FiltroAssets } from '../../../models/filtro-assets';
import { MatSelectModule } from '@angular/material/select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { environment } from '../../../../environments/environment';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

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
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
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
  selectedTarea: FiltroTareas = { id_task: 0, detail: '' };
  tareasFiltro: FiltroTareas[] = [];

  // Activos
  assets: FiltroAssets[] = [];

  // Para metodo agregar/ editar tareas
  activos: any[] = [];

  // Ordenar por fecha
  ordenFecha: 'asc' | 'desc' = 'desc';

  // Columnas tabla de tareas
  displayedColumnsTasks: string[] = [
    'product',
    'estimated_start_time',
    'actual_start_time',
    'estimated_end_time',
    'actual_end_time',
    'estimated_duration',
    'actual_duration',
    'client',
  ];
  dataSourceTasks = new MatTableDataSource<TareaOperario>([]);
  @ViewChild('paginatorTasks') paginatorTasks!: MatPaginator;

  private _snackBar = inject(MatSnackBar);

  // Constructor
  constructor(
    private dialog: MatDialog,
    private tasksService: TasksService,
    private assetsService: AssetsService,
    public authService: AuthService,
    private dialogDescripcion: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.setRangoAHora();
    //this.loadDataTasks();
    this.loadDataAssets();
  }

  ngAfterViewInit() {
    this.dataSourceTasks.paginator = this.paginatorTasks;
  }

  /*
  // Carga de datos
  // Cargar datos de tareas
  async loadDataTasks() {
    const formattedStart =
      this.datePipe.transform(this.range.start, 'yyyy-MM-dd HH:mm:ss') ?? '';
    const formattedEnd =
      this.datePipe.transform(this.range.end, 'yyyy-MM-dd HH:mm:ss') ?? '';

    try {
      const response = await lastValueFrom(
        this.tasksService.getTasks(
          formattedStart, // desde
          formattedEnd
        )
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
    */

  // Carga de datos de activos
  async loadDataAssets() {
    try {
      const response = await lastValueFrom(this.assetsService.getAssets());
      if (response.length !== 0) {
        this.assets = response;
      } else {
        this.assets = [];
      }

      // Cargar activos
      this.activos = this.assets;
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

  // Filtrado por fecha
  async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(TareasFiltroComponent, {
      width: '400px',
      data: {
        start: this.range.start,
        end: this.range.end,
        opciones: this.tareasFiltro.map((item) => ({
          value: item.id_task,
          viewValue: item.detail,
        })),
        selectedTarea: this.selectedTarea.id_task,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        this.range = result.dateRange;
        if (this.range.start && this.range.end) {
          this.range.start.setHours(0, 0, 0, 0);
          const endDate = new Date(this.range.end);
          endDate.setHours(23, 59, 59, 999);
          this.range.end = endDate;
          //await this.loadDataTasks();
        }
      } else {
        this.dataSourceTasks.data = [];
      }
      this.cargando = false;
    });
  }

  /* AGREGAR + ADELANTE
  // Visualizacion de planos en pdf de piezas
  async onPlanosClick(row: Parts) {
    if (!row.plan) {
      alert('No hay planos para mostrar.');
      return;
    }

    // Abrimos el diálogo, el componente interno se encarga de pedir el PDF
    this.dialog.open(PiezaPlanosComponent, {
      data: { id_part: row.id_part, title: row.name || 'Plano de pieza' },
      width: '90vw',
      height: '90vh',
    });
  }
  */

  async recargar() {
    this.cargando = true;
    //await this.loadDataTasks();
    await this.loadDataAssets();
    this.cargando = false;
  }
}
