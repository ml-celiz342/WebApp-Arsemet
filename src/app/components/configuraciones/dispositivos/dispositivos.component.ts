import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogoConfirmarComponent } from '../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Devices, ModeloDispositivo } from '../../../models/devices';
import { DevicesService } from '../../../services/devices.service';
import { DispositivosAnaliticas } from '../../../models/dispositivos-analiticas';
import { DispositivosAgregarComponent } from './dispositivos-agregar/dispositivos-agregar.component';
import { ModelosDispositivosAgregarComponent } from './modelos-dispositivos-agregar/modelos-dispositivos-agregar.component';
import { JsonViewComponent } from '../../utilidades/json-view/json-view.component';
import { DispositivosAnaliticasVincularComponent } from './dispositivos-analiticas-vincular/dispositivos-analiticas-vincular.component';
import { Analitica } from '../../../models/analitica';
import { AnalyticService } from '../../../services/analytic.service';
import { AuthService } from '../../../auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Servicio } from '../../../models/servicio';
import { ServicecodesService } from '../../../services/servicecodes.service';
import { ServiceCodesAgregarComponent } from './service-codes-agregar/service-codes-agregar.component';

@Component({
  selector: 'app-dispositivos',
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
  templateUrl: './dispositivos.component.html',
  styleUrl: './dispositivos.component.css',
})
export class DispositivosComponent {
  selectedPage = new FormControl(0);
  range = { start: new Date(), end: new Date() };
  selectedName = 'Todos';
  cargando = false;
  checkActivos = true;
  checkInactivos = false;

  displayedColumnsData: string[] = [
    'numeroserie',
    'registro',
    'lowdate',
    'tipo',
    'servicio',
    'manifiesto',
    'acciones',
  ];
  dataSourceDevices = new MatTableDataSource<Devices>([]);
  @ViewChild('paginatorData') paginatorData!: MatPaginator;

  displayedColumnsTipo: string[] = ['tipo', 'template', 'acciones'];
  dataSourceTipo = new MatTableDataSource<ModeloDispositivo>([]);
  @ViewChild('paginatorTipo') paginatorTipo!: MatPaginator;

  displayedColumnsServicio: string[] = ['servicio', 'acciones'];
  dataSourceServicio = new MatTableDataSource<Servicio>([]);
  @ViewChild('paginatorServicio') paginatorServicio!: MatPaginator;

  dataSourceDipositivosAnalitica =
    new MatTableDataSource<DispositivosAnaliticas>([]);
  displayedColumnsDispositivosAnaliticas: string[] = [
    'numero_serie',
    'analitica',
    'fecha_alta',
    'fecha_baja',
    'acciones',
  ];
  @ViewChild('paginatorDispositivoAnalitica')
  paginatorDispositivoAnalitica!: MatPaginator;

  dataAnaliticas: Analitica[] = [];
  private _snackBar = inject(MatSnackBar);

  constructor(
    private dialog: MatDialog,
    private deviceService: DevicesService,
    private analyticService: AnalyticService,
    private codeService: ServicecodesService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Filtro personalizado para la columna 'id' con el rango
    this.dataSourceDevices.filterPredicate = (
      data: Devices,
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

    this.dataSourceDipositivosAnalitica.filterPredicate = (
      data: DispositivosAnaliticas,
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

    this.loadDataDevice();
    this.loadDataModelsDevice();
    this.loadDataServiceCodes();
  }

  ngAfterViewInit() {
    this.dataSourceDevices.paginator = this.paginatorData;
    this.dataSourceTipo.paginator = this.paginatorTipo;
    this.dataSourceServicio.paginator = this.paginatorServicio;
    this.dataSourceDipositivosAnalitica.paginator =
      this.paginatorDispositivoAnalitica;
  }

  async loadDataServiceCodes() {
    try {
      const response = await lastValueFrom(this.codeService.getServiceCodes());
      if (response.length !== 0) {
        this.dataSourceServicio.data = response;
      } else {
        this.dataSourceServicio.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataModelsDevice() {
    try {
      const response = await lastValueFrom(
        this.deviceService.getModelsDevices()
      );
      if (response.length !== 0) {
        this.dataSourceTipo.data = response;
      } else {
        this.dataSourceTipo.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataDevice() {
    try {
      const response = await lastValueFrom(this.deviceService.getDevices());
      if (response.length !== 0) {
        this.dataSourceDevices.data = response;
        this.aplicarfiltro();
      } else {
        this.dataSourceDevices.data = [];
        this.aplicarfiltro();
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataDispositivoAnalitica() {
    try {
      const response = await lastValueFrom(
        this.deviceService.getDeviceAssociate()
      );
      if (response.length !== 0) {
        this.dataSourceDipositivosAnalitica.data = response;
      } else {
        this.dataSourceDipositivosAnalitica.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataAanaliticas() {
    try {
      const response = await lastValueFrom(this.analyticService.getAnalytic());
      if (response.length !== 0) {
        this.dataAnaliticas = response;
      } else {
        this.dataAnaliticas = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async agregarEditarDispositivo(dispositivo: Devices | null = null) {
    const isEditMode = !!dispositivo;
    const opcionesDisposotivos = this.dataSourceTipo.data;
    const opcionesServicios = this.dataSourceServicio.data;
    const dialogRef = this.dialog.open(DispositivosAgregarComponent, {
      width: '400px',
      data: {
        dispositivo,
        isEditMode,
        opcionesDisposotivos,
        opcionesServicios,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        if (isEditMode) {
          //LLamo a la API de put /devices/id
          try {
            const response = await lastValueFrom(
              this.deviceService.updateDevice(result, dispositivo.id)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Dispositivo actualizado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataDevice();
            } else {
              this._snackBar.open(
                'No fue posible actualizar el dispositivo',
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
          //LLamo a la API de post /devices
          try {
            const response = await lastValueFrom(
              this.deviceService.createDevice(result)
            );
            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Dispositivo agregado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataDevice();
            } else {
              this._snackBar.open(
                'No fue posible agregar el dispositivo',
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

  async eliminarDispositivo(element: Devices): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /devices/{id}
        try {
          const response = await lastValueFrom(
            this.deviceService.deleteDevice(element.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue desactivado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataDevice();
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

  async eliminarTipo(element: Devices): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { eliminar: true },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /assets/type/{id}
        try {
          const response = await lastValueFrom(
            this.deviceService.deleteModelDevice(element.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue eliminado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataModelsDevice();
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

  async agregarTipo(tipo: ModeloDispositivo | null = null): Promise<void> {
    const dialogRef = this.dialog.open(ModelosDispositivosAgregarComponent, {
      width: '400px',
      data: { tipo },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.deviceService.createModelDevice(result)
          );
          if (response === 200) {
            this._snackBar.open('Modelo de dispositivo agregado', 'Cerrar', {
              duration: 3000,
            });
            await this.loadDataModelsDevice();
          } else {
            this._snackBar.open(
              'No fue posible agregar el modelo de dispositivo',
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
    });
  }

  async eliminarServicio(element: Servicio): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { eliminar: true },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.codeService.deleteServiceCode(element.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue eliminado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataServiceCodes();
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

  async agregarServicio(): Promise<void> {
    const dialogRef = this.dialog.open(ServiceCodesAgregarComponent, {
      width: '400px',
      data: { },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.codeService.createServiceCode(result)
          );
          if (response === 200) {
            this._snackBar.open('Codigo de servicio agregado', 'Cerrar', {
              duration: 3000,
            });
            await this.loadDataServiceCodes()
          } else {
            this._snackBar.open(
              'No fue posible agregar el codigo de servicio',
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
    });
  }

  async agregarVinculo(): Promise<void> {
    const dispositivos = this.dataSourceDevices.data
      .filter((item) => item.low_date == null) // <-- Filtra solo los dispositivos que están activos
      .map((item) => {
        return { id: item.id, numero_serie: item.numero_serie };
      });
    const analiticas = this.dataAnaliticas
      .filter((item) => item.fecha_baja == null)
      .map((item) => {
        return { id: item.id, nombre: item.nombre };
      });
    const dialogRef = this.dialog.open(
      DispositivosAnaliticasVincularComponent,
      {
        width: '400px',
        data: { dispositivos, analiticas },
      }
    );

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && result.id_dispositivo) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            //Api /devices/{id}/associate"
            this.deviceService.createDeviceAssociate(
              result.id_dispositivo,
              result.id_analitica
            )
          );

          if (response === 200) {
            // Agregando un nuevo activo
            this._snackBar.open(
              'Dispositivo y analítica vinculada con éxito',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataDispositivoAnalitica();
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

  async eliminarVinculo(element: DispositivosAnaliticas): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /devices/{serie}/associate/{id}
        try {
          const response = await lastValueFrom(
            this.deviceService.deleteDeviceAssociate(
              element.numero_serie,
              element.id_analitica
            )
          );
          if (response == 200) {
            this._snackBar.open(
              'El vínculo fue desactivado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataDispositivoAnalitica();
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
          this._snackBar.open('Error al eliminar el vínculo', 'Cerrar', {
            duration: 3000,
          });
        }
        this.cargando = false;
      }
    });
  }

  async manifiesto(element: Devices): Promise<void> {
    const dialogRef = this.dialog.open(JsonViewComponent, {
      width: '400px',
      data: { manifiesto: element.manifiesto_arq },
    });
  }

  async template(element: ModeloDispositivo): Promise<void> {
    const dialogRef = this.dialog.open(JsonViewComponent, {
      width: '400px',
      data: { template: element.template },
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
      this.dataSourceDevices.filter = filtroEstado.toString();
    } else if (this.selectedPage.value == 1) {
      this.dataSourceDipositivosAnalitica.filter = filtroEstado.toString();
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
      await this.loadDataDevice();
      await this.loadDataModelsDevice();
      await this.loadDataServiceCodes();
      this.checkActivos = true;
      this.checkInactivos = false;
      this.aplicarfiltro();
    } else if (this.selectedPage.value == 1) {
      await this.loadDataDispositivoAnalitica();
      this.checkActivos = true;
      this.checkInactivos = false;
      this.aplicarfiltro();
      await this.loadDataAanaliticas();
    }
    this.cargando = false;
  }
}
