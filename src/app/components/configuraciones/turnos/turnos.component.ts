import { Component, inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../auth.service';
import { Shift, ShiftDetail } from '../../../models/shift';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShiftsService } from '../../../services/shifts.service';
import { lastValueFrom } from 'rxjs';
import { TurnosHistoricoComponent } from './turnos-historico/turnos-historico.component';
import { TurnosAgregarComponent } from './turnos-agregar/turnos-agregar.component';
import { DialogoConfirmarComponent } from '../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { TurnosActivos } from '../../../models/turnos-activos';
import { AssetsService } from '../../../services/assets.service';
import { Assets } from '../../../models/assets';
import { TurnosActivosVincularComponent } from './turnos-activos-vincular/turnos-activos-vincular.component';

@Component({
  selector: 'app-turnos',
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
  ],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css',
})
export class TurnosComponent {
  selectedPage = new FormControl(0);
  cargando = false;
  checkActivos = true;
  checkInactivos = false;

  private _snackBar = inject(MatSnackBar);

  constructor(
    private dialog: MatDialog,
    private shiftsService: ShiftsService,
    private assetsService: AssetsService,
    public authService: AuthService
  ) {}

  /* -------------- TURNOS -------------- */
  displayedColumnsTurnos: string[] = [
    'nombre',
    'inicio',
    'fin',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun',
    'descansos',
    'acciones',
  ];
  dataSourceTurnos = new MatTableDataSource<Shift>([]);
  @ViewChild('paginatorTurnos') paginatorTurnos!: MatPaginator;

  /* LOAD DATA */
  /* Load de turnos */
  async loadDataTurnos() {
    try {
      const response = await lastValueFrom(this.shiftsService.getShifts());
      if (response.length !== 0) {
        this.dataSourceTurnos.data = response;
        this.aplicarfiltro();
      } else {
        this.dataSourceTurnos.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  /* CRUD TURNOS */
  /* Agregar / Editar Turnos */
  async agregarEditarTurno(turno: Shift | null = null): Promise<void> {
    const isEditMode = !!turno;

    const dialogRef = this.dialog.open(TurnosAgregarComponent, {
      width: '400px',
      data: {
        turno,
        isEditMode,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }

      this.cargando = true;

      if (isEditMode) {
        // EDITAR
        try {
          const response = await lastValueFrom(
            this.shiftsService.updateShift(turno.id_shift, result)
          );

          if (response === 200) {
            this._snackBar.open('Turno actualizado', 'Cerrar', {
              duration: 3000,
            });
            await this.loadDataTurnos();
          } else {
            this._snackBar.open(
              'No fue posible actualizar el turno',
              'Cerrar',
              { duration: 3000 }
            );
          }
        } catch (err) {
          this._snackBar.open('Error al actualizar el turno', 'Cerrar', {
            duration: 3000,
          });
        }
      } else {
        // CREAR
        try {
          const response = await lastValueFrom(
            this.shiftsService.createShift(result)
          );

          if (response.status === 200) {
            this._snackBar.open('Turno agregado', 'Cerrar', {
              duration: 3000,
            });
            await this.loadDataTurnos();
          } else {
            this._snackBar.open('No fue posible agregar el turno', 'Cerrar', {
              duration: 3000,
            });
          }
        } catch (err) {
          this._snackBar.open('Error al agregar el turno', 'Cerrar', {
            duration: 3000,
          });
        }
      }

      this.cargando = false;
    });
  }

  /* Eliminar turno */
  async eliminarTurno(turno: Shift): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;

        try {
          const response = await lastValueFrom(
            this.shiftsService.deleteShift(turno.id_shift)
          );

          if (response === 200) {
            this._snackBar.open(
              'El turno fue deshabilitado correctamente',
              'Cerrar',
              { duration: 3000 }
            );

            await this.loadDataTurnos();
          } else {
            this._snackBar.open(
              'No fue posible deshabilitar el turno',
              'Cerrar',
              { duration: 3000 }
            );
          }
        } catch (err) {
          this._snackBar.open('Error al deshabilitar el turno', 'Cerrar', {
            duration: 3000,
          });
        }

        this.cargando = false;
      }
    });
  }

  /* Historial de turnos */
  async historialTurnos(element: ShiftDetail): Promise<void> {
    let dataConfig: ShiftDetail | null = null;

    try {
      const response = await lastValueFrom(
        this.shiftsService.getShift(element.id_shift)
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

    const dialogRef = this.dialog.open(TurnosHistoricoComponent, {
      width: '500px',
      data: { campos },
    });
  }

  /* -------------- TURNOS - ACTIVOS -------------- */
  displayedColumnsTurnosActivos: string[] = [
    'name',
    'code',
    'fecha_alta',
    'fecha_baja',
    'acciones',
  ];
  dataSourceTurnosActivos = new MatTableDataSource<TurnosActivos>([]);
  @ViewChild('paginatorTurnosActivos') paginatorTurnosActivos!: MatPaginator;

  dataSourceAsset = new MatTableDataSource<Assets>([]);

  /* LOAD DATA */
  /* Load de turnos - activos */
  async loadDataTurnosActivos() {
    try {
      const response = await lastValueFrom(
        this.shiftsService.getShiftsAssets()
      );
      if (response.length !== 0) {
        this.dataSourceTurnosActivos.data = response;
        this.aplicarfiltro();
      } else {
        this.dataSourceTurnosActivos.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  /* Load de activos */
  async loadDataAssets() {
    try {
      const response = await lastValueFrom(this.assetsService.getAssets());
      if (response.length !== 0) {
        this.dataSourceAsset.data = response;
        this.aplicarfiltro();
      } else {
        this.dataSourceAsset.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  /* CRUD */
  /* Agregar vinculo */
  async agregarVinculo(): Promise<void> {
    const turnos = this.dataSourceTurnos.data;

    const activos = this.dataSourceAsset.data
      .filter((item) => item.low_date == null) // <-- Filtra solo los activos que están activos
      .map((item) => {
        return { id: item.id, code: item.code };
      });

    const dialogRef = this.dialog.open(TurnosActivosVincularComponent, {
      width: '400px',
      data: { turnos, activos },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && result.id_turno) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            //Api : /shifts/{id_turno}/associate/{id_activo}"
            this.shiftsService.createShiftAssociate(
              result.id_turno,
              result.id_activo
            )
          );

          if (response === 200) {
            this._snackBar.open('Vinculación con éxito', 'Cerrar', {
              duration: 3000,
            });
            await this.loadDataTurnosActivos();
          } else {
            this._snackBar.open('No fue posible la vinculación', 'Cerrar', {
              duration: 3000,
            });
          }
        } catch (err) {
          this._snackBar.open('Error al vincular', 'Cerrar', {
            duration: 3000,
          });
        }
        this.cargando = false;
      }
    });
  }

  /* Eliminar vinculo */
  async eliminarVinculo(element: TurnosActivos): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //Api : /shifts/{id_turno}/associate/{id_activo}"
        try {
          const response = await lastValueFrom(
            this.shiftsService.deleteShiftAssociate(
              element.id_shift,
              element.id_asset
            )
          );
          if (response == 200) {
            this._snackBar.open(
              'El vínculo fue deshabilitado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataTurnosActivos();
          } else {
            this._snackBar.open(
              'No fue posible deshabilitar el vínculo',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
        } catch (err) {
          this._snackBar.open('Error al deshabilitar el vínculo', 'Cerrar', {
            duration: 3000,
          });
        }
        this.cargando = false;
      }
    });
  }

  /* Ng On Init */
  ngOnInit(): void {
    this.dataSourceTurnosActivos.filterPredicate = (
      data: TurnosActivos,
      filter: string
    ) => {
      if (filter == '-1') {
        return false;
      }
      if (filter == '0') {
        return data.low_date == null; // Miro si esta definido o no la fecha de baja
      }
      if (filter == '1') {
        return data.low_date != null;
      }
      return true;
    };

    this.loadDataTurnos();
    this.loadDataAssets();
    this.loadDataTurnosActivos();
  }

  /* After view init */
  ngAfterViewInit() {
    this.dataSourceTurnos.paginator = this.paginatorTurnos;
    this.dataSourceTurnosActivos.paginator = this.paginatorTurnosActivos;
  }

  /* Aplicar filtros */
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
      // Nada
    } else if (this.selectedPage.value == 1) {
      this.dataSourceTurnosActivos.filter = filtroEstado.toString();
    }
  }

  /* Seleccion de pagina */
  selectPage(event: any) {
    this.selectedPage.setValue(event);
    this.recargar();
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

  /* Recargar */
  async recargar() {
    this.cargando = true;

    if (this.selectedPage.value == 0) {
      this.checkActivos = true;
      this.checkInactivos = false;
      this.loadDataTurnos();
      this.aplicarfiltro();
    } else if (this.selectedPage.value == 1) {
      this.checkActivos = true;
      this.checkInactivos = false;
      this.loadDataAssets();
      this.loadDataTurnosActivos();
      this.aplicarfiltro();
    }

    this.cargando = false;
  }
}
