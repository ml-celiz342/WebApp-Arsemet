import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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
import { Analitica, AnaliticaObservacion } from '../../../models/analitica';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { AnalyticService } from '../../../services/analytic.service';
import { AnaliticasAgregarComponent } from './analiticas-agregar/analiticas-agregar.component';
import { DialogoConfirmarComponent } from '../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { ObservacionesAnaliticasFiltroComponent } from './observaciones-analiticas-filtro/observaciones-analiticas-filtro.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AuthService } from '../../../auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AnaliticasConfigurarComponent } from './analiticas-configurar/analiticas-configurar.component';
import { AnaliticasHistoricoComponent } from './analiticas-historico/analiticas-historico.component';

@Component({
  selector: 'app-analiticas',
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
    MatSortModule,
    MatTooltipModule,
  ],
  providers: [DatePipe],
  templateUrl: './analiticas.component.html',
  styleUrl: './analiticas.component.css',
})
export class AnaliticasComponent {
  selectedPage = new FormControl(0);

  range = { start: new Date(), end: new Date() };
  selectedAnalitica: Analitica = {
    id: 0,
    nombre: '',
    comentario: '',
    ruta: '',
    pausa: false,
    fecha_alta: new Date(),
    fecha_baja: new Date(),
  };

  cargando = false;
  checkActivos = true;
  checkInactivos = false;

  displayedColumnsAnaliticas: string[] = [
    'nombre',
    'descripcion',
    'pausa',
    'registro',
    'lowdate',
    'configuracion',
    'acciones',
  ];
  dataSourceAnalytics = new MatTableDataSource<Analitica>([]);
  @ViewChild('paginatorAnaliticas') paginatorAnaliticas!: MatPaginator;

  displayedColumnsLogsAnaliticas: string[] = [
    'nombre',
    'numero_serie',
    'observacion',
    'desde',
    'hasta',
    'fecha',
  ];
  dataSourceLogsAnaliticas = new MatTableDataSource<AnaliticaObservacion>([]);
  @ViewChild('paginatorLogsAnaliticas') paginatorLogsAnaliticas!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  private _snackBar = inject(MatSnackBar);

  campos: { [key: string]: any } = {
    alarma_traslado_medio: true,
    fecha_actualizacion: '2025-06-24T12:41:52.36932-03:00',
    id: 1,
    id_usuario_actualizacion: 2,
    tiempo_alarma_medio: 60,
    tiempo_ejecucion: 120,
    tiempo_limite_acomodo: 30,
  };

  constructor(
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private analyticService: AnalyticService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Filtro personalizado para la columna 'id' con el rango
    this.dataSourceAnalytics.filterPredicate = (
      data: Analitica,
      filter: string
    ) => {
      if (filter == '-1') {
        return false;
      }
      if (filter == '0') {
        return data.fecha_baja == null; //Miro si esta definido o no la fecha de baja
      }
      if (filter == '1') {
        return data.fecha_baja != null;
      }
      return true;
    };

    this.loadDataAanaliticas();
  }

  ngAfterViewInit() {
    this.dataSourceAnalytics.paginator = this.paginatorAnaliticas;
    this.dataSourceLogsAnaliticas.paginator = this.paginatorLogsAnaliticas;
    this.dataSourceLogsAnaliticas.sort = this.sort;
  }

  async loadDataAanaliticas() {
    try {
      const response = await lastValueFrom(this.analyticService.getAnalytic());
      if (response.length !== 0) {
        this.dataSourceAnalytics.data = response;
        this.aplicarfiltro();
      } else {
        this.dataSourceAnalytics.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async agregarEditarAnaliticas(
    analitica: Analitica | null = null
  ): Promise<void> {
    const isEditMode = !!analitica;
    const dialogRef = this.dialog.open(AnaliticasAgregarComponent, {
      width: '400px',
      data: { analitica, isEditMode },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        if (isEditMode) {
          try {
            const response = await lastValueFrom(
              this.analyticService.updateAnalytic(result, analitica.id)
            );
            if (response === 200) {
              this._snackBar.open('Analítica actualizada', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataAanaliticas();
            } else {
              this._snackBar.open(
                'No fue posible actualizar la analítica',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
            }
          } catch (err) {
            this._snackBar.open('Error al actualizar los datos', 'Cerrar', {
              duration: 3000,
            });
          }
        } else {
          try {
            const response = await lastValueFrom(
              this.analyticService.createAnalytic(result)
            );
            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Analítica agregada', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataAanaliticas();
            } else {
              this._snackBar.open(
                'No fue posible agregar la analítica',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
            }
          } catch (err) {
            this._snackBar.open('Error al agregar los datos', 'Cerrar', {
              duration: 3000,
            });
          }
        }
        this.cargando = false;
      }
    });
  }

  async eliminarAnalitica(element: Analitica): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.analyticService.deleteAnalytic(element.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue desactivado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataAanaliticas();
          } else {
            this._snackBar.open(
              'No fue posible deshabilitar el registro',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
        } catch (err) {
          this._snackBar.open('Error al obtener los datos', 'Cerrar', {
            duration: 3000,
          });
        }
        this.cargando = false;
      }
    });
  }

  async loadDataBobinasResumen() {
    const formattedStart =
      this.datePipe.transform(this.range.start, 'yyyy-MM-dd HH:mm:ss') ?? '';
    const formattedEnd =
      this.datePipe.transform(this.range.end, 'yyyy-MM-dd HH:mm:ss') ?? '';
    try {
      const response = await lastValueFrom(
        this.analyticService.getObservationsAnalytic(
          formattedStart,
          formattedEnd,
          this.selectedAnalitica.id.toString()
        )
      );
      if (response.length !== 0) {
        this.dataSourceLogsAnaliticas.data = response;
      } else {
        this.dataSourceLogsAnaliticas.data = [];
      }
    } catch (err) {
      console.error('Error al obtener datos:', err);
    }
  }

  async filtrarAnaliticas(): Promise<void> {
    const dialogRef = this.dialog.open(ObservacionesAnaliticasFiltroComponent, {
      width: '400px',
      data: {
        opciones: this.dataSourceAnalytics.data.map((item) => {
          return { value: item.id, viewValue: item.nombre };
        }),
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        this.range = result.dateRange;
        const resultAnalitica = this.dataSourceAnalytics.data.find(
          (item) => item.id === result.selectedOption
        );
        if (resultAnalitica) {
          this.selectedAnalitica = resultAnalitica;
          if (this.range.start && this.range.end) {
            const endDate = new Date(this.range.end);
            endDate.setHours(23, 59, 59, 999);
            this.range.end = endDate;
            await this.loadDataBobinasResumen();
          }
        }
        this.cargando = false;
      }
    });
  }

  async configuracion(element: Analitica): Promise<void> {
    var dataConfig = {};
    try {
      const response = await lastValueFrom(
        this.analyticService.getConfigAnalytic(element.id)
      );
      if (response) {
        dataConfig = response;
      } else {
        this._snackBar.open('No se encontraron los datos', 'Cerrar', {
          duration: 3000,
        });
        return;
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    const campos = dataConfig;
    const dialogRef = this.dialog.open(AnaliticasConfigurarComponent, {
      width: '400px',
      data: { campos },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const response = await lastValueFrom(
            this.analyticService.updateConfig(result, element.id)
          );
          if (response === 200) {
            this._snackBar.open('Configuración actualizada', 'Cerrar', {
              duration: 3000,
            });
          } else {
            this._snackBar.open(
              'No fue posible actualizar la configuración',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
        } catch (err) {
          this._snackBar.open('Error al actualizar los datos', 'Cerrar', {
            duration: 3000,
          });
        }
      }
    });
  }

  async historialConfiguracion(element: Analitica): Promise<void> {
    var dataConfig: any[]=[];
    try {
      const response = await lastValueFrom(
        this.analyticService.getAllConfigAnalytic(element.id)
      );
      if (response) {
        dataConfig = response;
      } else {
        this._snackBar.open('No se encontraron los datos', 'Cerrar', {
          duration: 3000,
        });
        return;
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    const campos = dataConfig;
    const dialogRef = this.dialog.open(AnaliticasHistoricoComponent, {
      width: '500px',
      data: { campos },
    });
  }

  selectPage(event: any) {
    this.selectedPage.setValue(event);
    this.recargar();
  }

  aplicarfiltro() {
    var filtroEstado = -1;
    if (this.checkActivos && this.checkInactivos) {
      filtroEstado = 2;
    } else if (this.checkActivos && !this.checkInactivos) {
      filtroEstado = 0;
    } else if (!this.checkActivos && this.checkInactivos) {
      filtroEstado = 1;
    }

    if (this.selectedPage.value == 0) {
      this.dataSourceAnalytics.filter = filtroEstado.toString();
    }
  }

  toggleChecked(element: string): void {
    if (element == 'activos') {
      this.checkActivos = !this.checkActivos;
    }
    if (element == 'inactivos') {
      this.checkInactivos = !this.checkInactivos;
    }
    this.aplicarfiltro();
  }

  isSelected(element: string): boolean {
    if (element == 'activos') {
      return this.checkActivos;
    }
    if (element == 'inactivos') {
      return this.checkInactivos;
    }
    return false;
  }

  async recargar() {
    this.cargando = true;
    if (this.selectedPage.value == 0) {
      await this.loadDataAanaliticas();
      this.checkActivos = true;
      this.checkInactivos = false;
      this.aplicarfiltro();
    } else if (this.selectedPage.value == 1) {
      await this.loadDataAanaliticas();
      await this.loadDataBobinasResumen();
    }
    this.cargando = false;
  }
}
