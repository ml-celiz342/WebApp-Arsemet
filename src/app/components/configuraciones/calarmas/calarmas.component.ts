import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlarmaList, AlarmLevel, AlarmSource } from '../../../models/alarmas';
import { AlarmasService } from '../../../services/alarmas.service';
import { lastValueFrom } from 'rxjs';
import { UtilidadesService } from '../../../services/utilidades.service';
import { CalarmasAgregarListaComponent } from './calarmas-agregar-lista/calarmas-agregar-lista.component';
import { DialogoConfirmarComponent } from '../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { CalarmasEditarNivelComponent } from './calarmas-editar-nivel/calarmas-editar-nivel.component';
import { CalarmasCrearOrigenComponent } from './calarmas-crear-origen/calarmas-crear-origen.component';

@Component({
  selector: 'app-calarmas',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatListModule,
    MatSortModule,
    MatTooltipModule,
  ],
  templateUrl: './calarmas.component.html',
  styleUrl: './calarmas.component.css',
})
export class CalarmasComponent {
  cargando = false;
  checkActivos = true;
  checkInactivos = false;

  dataSourceListAlarmas = new MatTableDataSource<AlarmaList>([]);
  displayedListAlarmas: string[] = [
    'alias',
    'nombre',
    'origen',
    'nivel',
    'estado',
    'acciones',
  ];
  @ViewChild('paginatorDefinicion') paginatorDefinicion!: MatPaginator;

  dataSourceOrigen = new MatTableDataSource<AlarmSource>([]);
  displayedOrigen: string[] = ['origen', 'acciones'];
  @ViewChild('paginatorOrigen') paginatorOrigen!: MatPaginator;

  dataSourceNiveles = new MatTableDataSource<AlarmLevel>([]);
  displayedNiveles: string[] = ['nivel', 'notificacion', 'acciones'];
  @ViewChild('paginatorNiveles') paginatorNiveles!: MatPaginator;

  private _snackBar = inject(MatSnackBar);

  constructor(
    private dialog: MatDialog,
    public authService: AuthService,
    public utilidades: UtilidadesService,
    public alarmService: AlarmasService
  ) {}

  ngOnInit(): void {
    this.dataSourceListAlarmas.filterPredicate = (
      data: AlarmaList,
      filter: string
    ) => {
      if (filter == '-1') {
        return false;
      }
      if (filter == '0') {
        return data.estado == true;
      }
      if (filter == '1') {
        return data.estado != true;
      }
      return true;
    };
    this.loadDataAlarmList();
    this.loadDataAlarmLevel();
    this.loadDataAlarmSource();
  }

  ngAfterViewInit() {
    this.dataSourceListAlarmas.paginator = this.paginatorDefinicion;
    this.dataSourceOrigen.paginator = this.paginatorOrigen;
    this.dataSourceNiveles.paginator = this.paginatorNiveles;
  }

  async loadDataAlarmList() {
    try {
      const response = await lastValueFrom(this.alarmService.getAlarmList());
      if (response.length !== 0) {
        this.dataSourceListAlarmas.data = response;
        this.aplicarfiltro();
      } else {
        this.dataSourceListAlarmas.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataAlarmLevel() {
    try {
      const response = await lastValueFrom(this.alarmService.getAlarmLevel());
      if (response.length !== 0) {
        this.dataSourceNiveles.data = response;
        this.aplicarfiltro();
      } else {
        this.dataSourceNiveles.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataAlarmSource() {
    try {
      const response = await lastValueFrom(this.alarmService.getAlarmSource());
      if (response.length !== 0) {
        this.dataSourceOrigen.data = response;
        this.aplicarfiltro();
      } else {
        this.dataSourceOrigen.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async agregarEditarDefiniciones(
    alarmList: AlarmaList | null = null
  ): Promise<void> {
    const isEditMode = !!alarmList;
    const opcionesNivel = this.dataSourceNiveles.data;
    const opcionesOrigen = this.dataSourceOrigen.data;
    if (opcionesNivel.length == 0 || opcionesOrigen.length == 0) {
      this._snackBar.open(
        'No hay niveles o origenes de alarmas registrados ',
        'Cerrar',
        {
          duration: 3000,
        }
      );
      return;
    }
    const dialogRef = this.dialog.open(CalarmasAgregarListaComponent, {
      width: '400px',
      data: {
        alarmList,
        isEditMode,
        opcionesNivel,
        opcionesOrigen,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        if (isEditMode) {
          //LLamo a la API de put /alarms/list/{id}
          try {
            const response = await lastValueFrom(
              this.alarmService.updateAlarmList(result, alarmList.id)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Lista alarma actualizada', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataAlarmList();
            } else {
              this._snackBar.open(
                'No fue posible actualizar la lista de alarmas',
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
          //LLamo a la API de post "/alarms/list"
          try {
            const response = await lastValueFrom(
              this.alarmService.createAlarmList(result)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Lista agregada', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataAlarmList();
            } else {
              this._snackBar.open(
                'No fue posible agregar la alarma',
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

  async editarNivel(level: AlarmLevel): Promise<void> {
    const dialogRef = this.dialog.open(CalarmasEditarNivelComponent, {
      width: '400px',
      data: { level },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de put/alarms/levels/{id}
        try {
          const response = await lastValueFrom(
            this.alarmService.updateAlarmLevel(result, level.id)
          );

          if (response === 200) {
            // Agregando un nuevo activo
            this._snackBar.open('Nivel de alarma actualizada', 'Cerrar', {
              duration: 3000,
            });
            await this.loadDataAlarmLevel();
          } else {
            this._snackBar.open(
              'No fue posible actualizar el nivel de alarma',
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
        this.cargando = false;
      }
    });
  }

  async eliminarDefinicion(element: AlarmaList): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /alarms/list/{id}
        try {
          const response = await lastValueFrom(
            this.alarmService.deleteAlarmList(element.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue desactivado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataAlarmList();
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

  async agregarOrigen(): Promise<void> {
    const dialogRef = this.dialog.open(CalarmasCrearOrigenComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.alarmService.createOrigen(result)
          );
          if (response === 200) {
            this._snackBar.open('Orien agregado', 'Cerrar', {
              duration: 3000,
            });
            await this.loadDataAlarmSource();
          } else {
            this._snackBar.open('No fue posible agregar el origen', 'Cerrar', {
              duration: 3000,
            });
          }
        } catch (err) {
          this._snackBar.open('Error al agregar los datos', 'Cerrar', {
            duration: 3000,
          });
        }
      }
      this.cargando = false;
    });
  }

  async eliminarOrigen(element: AlarmSource): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { eliminar: true },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /alarms/states/{id}
        try {
          const response = await lastValueFrom(
            this.alarmService.deleteAlarmSource(element.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue eliminado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataAlarmSource();
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

  aplicarfiltro() {
    var filtroEstado = -1;
    if (this.checkActivos && this.checkInactivos) {
      filtroEstado = 2;
    } else if (this.checkActivos && !this.checkInactivos) {
      filtroEstado = 0;
    } else if (!this.checkActivos && this.checkInactivos) {
      filtroEstado = 1;
    }

    this.dataSourceListAlarmas.filter = filtroEstado.toString();
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
    await this.loadDataAlarmList();
    await this.loadDataAlarmLevel();
    await this.loadDataAlarmSource();
    this.cargando = false;
  }
}
