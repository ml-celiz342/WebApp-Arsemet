import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OperarioEjecucion, Operarios, OperariosServicios } from '../../../models/operarios';
import { Sector } from '../../../models/sector';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../auth.service';
import { WorkersService } from '../../../services/workers.service';
import { SectorsService } from '../../../services/sectors.service';
import { lastValueFrom } from 'rxjs';
import { DialogoConfirmarComponent } from '../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { OperarioAgregarComponent } from './operario-agregar/operario-agregar.component';
import { SectorAgregarComponent } from './sector-agregar/sector-agregar.component';
import { UtilidadesService } from '../../../services/utilidades.service';
import { FormControl } from '@angular/forms';
import { OpejecucionFiltroComponent } from './opejecucion-filtro/opejecucion-filtro.component';
import { OpservicioEditarComponent } from './opservicio-editar/opservicio-editar.component';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-operarios',
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
    MatTooltipModule,
    MatSortModule,
  ],
  providers: [DatePipe],
  templateUrl: './operarios.component.html',
  styleUrl: './operarios.component.css',
})
export class OperariosComponent {
  selectedPage = new FormControl(0);

  cargando = false;
  checkActivos = true;
  checkInactivos = false;

  displayedColumnsData: string[] = [
    'identificador',
    'nombre',
    'apellido',
    'rfid',
    'sector',
    'registro',
    'lowdate',
    'acciones',
  ];
  dataSourceOperarios = new MatTableDataSource<Operarios>([]);
  @ViewChild('paginatorData') paginatorData!: MatPaginator;

  displayedColumnsSector: string[] = ['sector', 'acciones'];
  dataSourceSector = new MatTableDataSource<Sector>();
  @ViewChild('paginatorSector') paginatorSector!: MatPaginator;

  range = { start: new Date(), end: new Date() };

  displayedColumnsEjecucion: string[] = [
    'id',
    'cambios',
    'ejecucion',
    'temporal',
  ];
  dataSourceEjecucion = new MatTableDataSource<OperarioEjecucion>();
  @ViewChild('paginatorEjecucion') paginatorEjecucion!: MatPaginator;

  private _snackBar = inject(MatSnackBar);

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private workersService: WorkersService,
    private sectorsService: SectorsService,
    public authService: AuthService,
    private datePipe: DatePipe,
    public utilities: UtilidadesService
  ) {}

  ngOnInit(): void {
    this.dataSourceOperarios.filterPredicate = (
      data: Operarios,
      filter: string
    ) => {
      if (filter == '-1') {
        return false;
      }
      if (filter == '0') {
        return data.low_date == null; //Miro si esta definido o no la fecha de baja
      }
      if (filter == '1') {
        return data.low_date != null;
      }
      return true;
    };

    this.loadDataOperarios();
    this.loadDataSectores();
    this.setRangoAHora();
  }

  ngAfterViewInit() {
    this.dataSourceOperarios.paginator = this.paginatorData;
    this.dataSourceSector.paginator = this.paginatorSector;
    this.dataSourceEjecucion.paginator = this.paginatorEjecucion;
    this.dataSourceEjecucion.sort = this.sort;
  }

  async loadDataOperarios() {
    try {
      const response = await lastValueFrom(this.workersService.getOperarios());
      if (response.length !== 0) {
        this.dataSourceOperarios.data = response;
        this.aplicarfiltro();
      } else {
        this.dataSourceOperarios.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataSectores() {
    try {
      const response = await lastValueFrom(this.sectorsService.getSector());
      if (response.length !== 0) {
        this.dataSourceSector.data = response;
      } else {
        this.dataSourceSector.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async agregarEditarOperario(
    operario: Operarios | null = null
  ): Promise<void> {
    const isEditMode = !!operario;
    const opcionesSectores = this.dataSourceSector.data;
    if (opcionesSectores.length == 0) {
      this._snackBar.open('No hay tipos de secotres registrados ', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
    const dialogRef = this.dialog.open(OperarioAgregarComponent, {
      width: '400px',
      data: { operario, isEditMode, opcionesSectores },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        if (isEditMode) {
          //LLamo a la API de put /workers/id
          try {
            const response = await lastValueFrom(
              this.workersService.updateOperario(result, operario.id)
            );

            if (response === 200) {
              this._snackBar.open('Operario actualizado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataOperarios();
            } else {
              this._snackBar.open(
                'No fue posible actualizar el operario',
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
          //LLamo a la API de post /workers
          try {
            const response = await lastValueFrom(
              this.workersService.createOperario(result)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Operario agregado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataOperarios();
            } else {
              this._snackBar.open(
                'No fue posible agregar el operario',
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

  async eliminarOperario(element: Operarios): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /workers/{id}
        try {
          const response = await lastValueFrom(
            this.workersService.deleteOperario(element.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue desactivado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataOperarios();
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
          this._snackBar.open('Error al deshabilitar el registro', 'Cerrar', {
            duration: 3000,
          });
        }
        this.cargando = false;
      }
    });
  }

  async agregarEditarSector(sector: Sector | null = null): Promise<void> {
    const isEditMode = !!sector;
    const dialogRef = this.dialog.open(SectorAgregarComponent, {
      width: '400px',
      data: { sector, isEditMode },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        console.log(result);
        console.log(isEditMode);
        if (isEditMode) {
          //LLamo a la API de put /workers/id
          try {
            const response = await lastValueFrom(
              this.sectorsService.updateSector(result, sector.id)
            );

            if (response === 200) {
              this._snackBar.open('Sector actualizado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataSectores();
            } else {
              this._snackBar.open(
                'No fue posible actualizar el sector',
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
          //LLamo a la API de post /workers
          try {
            const response = await lastValueFrom(
              this.sectorsService.createSector(result)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Sector agregado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataSectores();
            } else {
              this._snackBar.open(
                'No fue posible agregar el sector',
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

  async eliminarSector(element: Sector): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { eliminar: true },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /sectors/{id}
        try {
          const response = await lastValueFrom(
            this.sectorsService.deleteSector(element.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue eliminado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataSectores();
          } else {
            this._snackBar.open(
              'No fue posible eliminar el registro',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
        } catch (err) {
          this._snackBar.open('Error al eliminar el registro', 'Cerrar', {
            duration: 3000,
          });
        }
        this.cargando = false;
      }
    });
  }

  async loadDataEjecucion() {
    const formattedStart =
      this.datePipe.transform(this.range.start, 'yyyy-MM-dd HH:mm:ss') ?? '';
    const formattedEnd =
      this.datePipe.transform(this.range.end, 'yyyy-MM-dd HH:mm:ss') ?? '';
    try {
      const response = await lastValueFrom(
        this.workersService.getOperariosEjecucion(formattedStart, formattedEnd)
      );
      console.log(response);
      if (response.length !== 0) {
        this.dataSourceEjecucion.data = response;
      } else {
        this.dataSourceEjecucion.data = [];
      }
    } catch (err) {
      console.log(err);
      this._snackBar.open('Error al obtener los datos1', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  setRangoAHora() {
    const ahora = new Date();
    const hace24h = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

    this.range.start = hace24h;
    this.range.end = ahora;
  }

  async loadDataOperariosServicios(): Promise<OperariosServicios[]> {
    try {
      const response = await lastValueFrom(
        this.workersService.getOperarioServicios()
      );
      if (Array.isArray(response) && response.length !== 0) {
        return response;
      } else {
        return [];
      }
    } catch (err) {
      this._snackBar.open(
        'Error al obtener los servicios de operarios',
        'Cerrar',
        {
          duration: 3000,
        }
      );
      return [];
    }
  }

  async ejecutar(): Promise<void> {
    this.cargando = true;
    try {
      const response = await lastValueFrom(
        this.workersService.ejecutarOperarioServicio()
      );
    }catch (err) {
      this._snackBar.open('Error al ejecutar el servicio de operarios', 'Cerrar', {
          duration: 3000,
      });
    }
    this.cargando = false;
  }

  async openDialogConfig(): Promise<void> {
    const servicios = await this.loadDataOperariosServicios();

    const servicio = servicios.reduce((max, actual) =>
      actual.id > max.id ? actual : max
    );

    const dialogRef = this.dialog.open(OpservicioEditarComponent, {
      width: '400px',
      data: { servicio },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        if (servicios.length != 0) {
          //LLamo a la API de put
          try {
            const response = await lastValueFrom(
              this.workersService.updateOperarioServicio(result, servicio.id)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open(
                'Servicios de operarios actualizados',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
            } else {
              this._snackBar.open(
                'No fue posible actualizar los servicios de operarios',
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
          //LLamo a la API de post
          try {
            const response = await lastValueFrom(
              this.workersService.createOperarioServicio(result)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Servicio de operario agregado', 'Cerrar', {
                duration: 3000,
              });
            } else {
              this._snackBar.open(
                'No fue posible agregar el servicio de operario',
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

  async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(OpejecucionFiltroComponent, {
      width: '400px',
      data: {
        start: this.range.start,
        end: this.range.end,
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
          await this.loadDataEjecucion();
        }
        this.cargando = false;
      }
    });
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
      this.dataSourceOperarios.filter = filtroEstado.toString();
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

  selectPage(event: any) {
    this.selectedPage.setValue(event);
    this.recargar();
  }

  async recargar() {
    this.cargando = true;
    if (this.selectedPage.value == 0) {
      await this.loadDataOperarios();
      await this.loadDataSectores();
      this.aplicarfiltro();
    } else if (this.selectedPage.value == 1) {
      await this.loadDataEjecucion();
    }
    this.cargando = false;
  }
}
