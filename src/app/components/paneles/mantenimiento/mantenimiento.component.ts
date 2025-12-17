import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { FiltroAssets } from '../../../models/filtro-assets';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AssetsService } from '../../../services/assets.service';
import { UtilidadesService } from '../../../services/utilidades.service';
import { Maintenance } from '../../../models/maintenance';
import { MaintenanceService } from '../../../services/maintenance.service';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../../auth.service';
import { MantenimientoFiltroComponent } from './mantenimiento-filtro/mantenimiento-filtro.component';
import { DialogoConfirmarComponent } from '../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { MantenimientoAgregarEditarComponent } from './mantenimiento-agregar-editar/mantenimiento-agregar-editar.component';

@Component({
  selector: 'app-mantenimiento',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltip,
  ],
  providers: [DatePipe],
  templateUrl: './mantenimiento.component.html',
  styleUrl: './mantenimiento.component.css',
})
export class MantenimientoComponent {
  range = { start: new Date(), end: new Date() };
  activos: number[] = [];

  cargando = false;

  assetsFiltro: FiltroAssets[] = [];

  displayedColumnsMantenimiento: string[] = [
    'activo',
    'razon',
    'observacion',
    'inicio',
    'fin',
    'acciones',
  ];
  dataSourceMantenimiento = new MatTableDataSource<Maintenance>([]);
  @ViewChild('paginatorMantenimiento') paginatorMantenimiento!: MatPaginator;
  @ViewChild(MatSort) sortMantenimiento!: MatSort;

  private _snackBar = inject(MatSnackBar);

  constructor(
    private dialog: MatDialog,
    private dialogFiltro: MatDialog,
    private assetsService: AssetsService,
    private maintenanceService: MaintenanceService,
    public utilidades: UtilidadesService,
    public authService: AuthService,
    private datePipe: DatePipe
  ) {}

  async ngAfterViewInit() {
    this.setRangoAHora();
    await Promise.all([this.loadDataAssets(), this.loadDataMaintenance()]);

    this.dataSourceMantenimiento.paginator = this.paginatorMantenimiento;
    this.dataSourceMantenimiento.paginator = this.paginatorMantenimiento;
    this.dataSourceMantenimiento.sort = this.sortMantenimiento;
  }

  async loadDataAssets() {
    try {
      const response = await lastValueFrom(
        this.assetsService.getFiltroAssets(true)
      );
      if (response.length !== 0) {
        this.assetsFiltro = response;
        this.activos = this.assetsFiltro.map((item) => item.id);
      } else {
        this.assetsFiltro = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataMaintenance() {
    const formattedStart =
      this.datePipe.transform(this.range.start, 'yyyy-MM-dd HH:mm:ss') ?? '';
    const formattedEnd =
      this.datePipe.transform(this.range.end, 'yyyy-MM-dd HH:mm:ss') ?? '';

    try {
      const response = await lastValueFrom(
        this.maintenanceService.getMaintenanceByFiltro(
          formattedStart, // desde
          formattedEnd, // hasta
          this.activos
        )
      );
      if (response.length !== 0) {
        this.dataSourceMantenimiento.data = response;
      } else {
        this.dataSourceMantenimiento.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
      this.dataSourceMantenimiento.data = [];
    }
  }

  async openDialog(): Promise<void> {
    const dialogRef = this.dialogFiltro.open(MantenimientoFiltroComponent, {
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
            await this.loadDataMaintenance();
          }
        } else {
          this.dataSourceMantenimiento.data = [];
        }
        this.cargando = false;
      }
    });
  }

  async agregarEditarMantenimiento(element: Maintenance | null = null) {
    const isEditMode = !!element;

    const dialogRef = this.dialog.open(MantenimientoAgregarEditarComponent, {
      width: '450px',
      data: {
        mantenimiento: element,
        isEditMode: isEditMode,
        activos: this.assetsFiltro,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        if (isEditMode) {
          //LLamo a la API
          try {
            const response = await lastValueFrom(
              this.maintenanceService.updateMaintenance(
                result.updateData,
                element.id_maintenance
              )
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Registro actualizado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataMaintenance();
            } else {
              this._snackBar.open(
                'No fue posible actualizar el registro',
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
              this.maintenanceService.createMaintenance(result.newMantenimiento)
            );
            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Registro agregado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataMaintenance();
            } else {
              this._snackBar.open(
                'No fue posible agregar el registro',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
            }
          } catch (err) {
            console.log(err);
            this._snackBar.open('Error al agregar los datos', 'Cerrar', {
              duration: 3000,
            });
          }
        }
        this.cargando = false;
      }
    });
  }

  async eliminarMantenimiento(element: Maintenance): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { eliminar: true },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.maintenanceService.deleteMaintenance(element.id_maintenance)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue eliminado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataMaintenance();
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
          this._snackBar.open('Error al obtener los datos', 'Cerrar', {
            duration: 3000,
          });
        }
        this.cargando = false;
      }
    });
  }

  setRangoAHora() {
    this.range.start = new Date();
    this.range.start.setHours(0, 0, 0, 0);

    this.range.end = new Date();
    this.range.end.setHours(23, 59, 59, 0);
  }

  async recargar() {
    this.cargando = true;
    await this.loadDataMaintenance();
    await this.loadDataAssets();
    this.cargando = false;
  }
}
