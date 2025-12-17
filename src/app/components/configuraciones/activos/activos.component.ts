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
import { AssetsService } from '../../../services/assets.service';
import { Assets, NewAssets, TipoActivos } from '../../../models/assets';
import { DialogoConfirmarComponent } from '../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { ActivosDispositivos } from '../../../models/activos-dispositivos';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ActivosAgregarComponent } from './activos-agregar/activos-agregar.component';
import { TiposActivoAgregarComponent } from './tipos-activo-agregar/tipos-activo-agregar.component';
import { ActivosDispositivosVincularComponent } from './activos-dispositivos-vincular/activos-dispositivos-vincular.component';
import { Devices } from '../../../models/devices';
import { DevicesService } from '../../../services/devices.service';
import { AuthService } from '../../../auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivosGrupos } from '../../../models/activos-grupos';
import { ActivosGruposVincularComponent } from './activos-grupos-vincular/activos-grupos-vincular.component';

@Component({
  selector: 'app-activos',
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
  providers: [DatePipe],
  templateUrl: './activos.component.html',
  styleUrl: './activos.component.css',
})
export class ActivosComponent {
  selectedPage = new FormControl(0);
  cargando = false;
  checkActivos = true;
  checkInactivos = false;

  displayedColumnsData: string[] = [
    'codigo',
    'registro',
    'lowdate',
    'tipo',
    'acciones',
  ];
  dataSourceAsset = new MatTableDataSource<Assets>([]);
  @ViewChild('paginatorData') paginatorData!: MatPaginator;

  displayedColumnsTipo: string[] = ['tipo', 'acciones'];
  dataSourceTipo = new MatTableDataSource<TipoActivos>();
  @ViewChild('paginatorTipo') paginatorTipo!: MatPaginator;

  dataSourceAssetDevice = new MatTableDataSource<ActivosDispositivos>([]);
  displayedColumnsAssetDevice: string[] = [
    'codigo',
    'numero_serie',
    'fecha_alta',
    'fecha_baja',
    'acciones',
  ];
  @ViewChild('paginatorAssetDevice') paginatorAssetDevice!: MatPaginator;

  dataSourceAssetGroup = new MatTableDataSource<ActivosGrupos>([]);
  displayedColumnsAssetGroup: string[] = [
    'codigo',
    'codigo_sub_activo',
    'fecha_alta',
    'fecha_baja',
    'acciones',
  ];
  @ViewChild('paginatorAssetGroup') paginatorAssetGroup!: MatPaginator;

  dataDispositivos: Devices[] = [];
  private _snackBar = inject(MatSnackBar);

  constructor(
    private dialog: MatDialog,
    private assetsService: AssetsService,
    private deviceService: DevicesService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Filtro personalizado para la columna 'id' con el rango
    this.dataSourceAsset.filterPredicate = (data: Assets, filter: string) => {
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

    this.dataSourceAssetDevice.filterPredicate = (
      data: ActivosDispositivos,
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

    this.dataSourceAssetGroup.filterPredicate = (
      data: ActivosGrupos,
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

    this.loadDataAssets();
    this.loadDataAssetsType();
  }

  ngAfterViewInit() {
    this.dataSourceAsset.paginator = this.paginatorData;
    this.dataSourceTipo.paginator = this.paginatorTipo;
    this.dataSourceAssetDevice.paginator = this.paginatorAssetDevice;
    this.dataSourceAssetGroup.paginator = this.paginatorAssetGroup;
  }

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

  async loadDataAssetsType() {
    try {
      const response = await lastValueFrom(this.assetsService.getAssetsType());
      if (response.length !== 0) {
        this.dataSourceTipo.data = response;
      } else {
        this.dataSourceAsset.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataAssetsAssociate() {
    try {
      const response = await lastValueFrom(
        this.assetsService.getAssetsAssociate()
      );
      if (response.length !== 0) {
        this.dataSourceAssetDevice.data = response;
        this.aplicarfiltro();
      } else {
        this.dataSourceAssetDevice.data = [];
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
        this.dataDispositivos = response;
      } else {
        this.dataDispositivos = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataAssetsGroup() {
    try {
      const response = await lastValueFrom(this.assetsService.getAssetsGroup());
      if (response.length !== 0) {
        this.dataSourceAssetGroup.data = response;
        this.aplicarfiltro();
      } else {
        this.dataSourceAssetGroup.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async agregarEditarActivo(activo: Assets | null = null): Promise<void> {
    const isEditMode = !!activo;
    const opcionesActivos = this.dataSourceTipo.data;
    if (opcionesActivos.length == 0) {
      this._snackBar.open('No hay tipos de activos registrados ', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
    const dialogRef = this.dialog.open(ActivosAgregarComponent, {
      width: '400px',
      data: { activo, isEditMode, opcionesActivos },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log(result);
      if (result) {
        if (isEditMode) {
          //LLamo a la API de put /assets/id
          try {
            const response = await lastValueFrom(
              this.assetsService.updateAsset(result, activo.id)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Activo actualizado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataAssets();
            } else {
              this._snackBar.open(
                'No fue posible actualizar el activo',
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
          //LLamo a la API de post /assets
          try {
            const response = await lastValueFrom(
              this.assetsService.createAsset(result)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Activo agregado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataAssets();
            } else {
              this._snackBar.open(
                'No fue posible agregar el activo',
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

  async eliminarActivo(element: Assets): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /assets/{id}
        try {
          const response = await lastValueFrom(
            this.assetsService.deleteAsset(element.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue desactivado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataAssets();
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

  async eliminarTipo(element: Assets): Promise<void> {
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
            this.assetsService.deleteAssetType(element.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue eliminado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataAssetsType();
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

  async agregarEditarTipo(tipo: TipoActivos | null = null): Promise<void> {
    const isEditMode = !!tipo;
    const nombre = tipo?.nombre;

    const dialogRef = this.dialog.open(TiposActivoAgregarComponent, {
      width: '400px',
      data: { isEditMode, nombre },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        if (isEditMode) {
          //LLamo a la API de put /assets/type/id
          try {
            const response = await lastValueFrom(
              this.assetsService.updateAssetType(result, tipo.id)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Tipo de activo actualizado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataAssetsType();
            } else {
              this._snackBar.open(
                'No fue posible actualizar el tipo de activo',
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
          //LLamo a la API de post /assets
          try {
            const response = await lastValueFrom(
              this.assetsService.createAssetType(result)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Tipo de activo agregado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataAssetsType();
            } else {
              this._snackBar.open(
                'No fue posible agregar el tipo de activo',
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

  async eliminarActivoDispositivo(element: ActivosDispositivos): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /assets/{id}/associate/{num_serie}
        try {
          const response = await lastValueFrom(
            this.assetsService.deleteAssetAssociate(
              element.id_activo,
              element.numero_serie
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
            await this.loadDataAssetsAssociate();
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

  async agregarVinculo(): Promise<void> {
    const activos = this.dataSourceAsset.data
      .filter((item) => item.low_date == null) // <-- Filtra solo los activos que están activos
      .map((item) => {
        return { id: item.id, code: item.code };
      });
    const dispositivos = this.dataDispositivos
      .filter((item) => item.low_date == null)
      .map((item) => {
        return { id: item.id, numero_serie: item.numero_serie };
      });
    const dialogRef = this.dialog.open(ActivosDispositivosVincularComponent, {
      width: '400px',
      data: { activos, dispositivos },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && result.id_activo && result.id_dispositivo) {
        this.cargando = true;
        //LLamo a la API de post /assets
        try {
          const response = await lastValueFrom(
            this.assetsService.createAssetAssociatee(
              result.id_activo,
              result.id_dispositivo
            )
          );

          if (response === 200) {
            // Agregando un nuevo activo
            this._snackBar.open(
              'Activo y dispositivo vinculados con éxito',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataAssetsAssociate();
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

  async agregarVinculoGrupo(): Promise<void> {
    const activos = this.dataSourceAsset.data
      .filter((item) => item.low_date == null && item.final) // <-- Filtra solo los activos que están activos
      .map((item) => {
        return { id: item.id, code: item.code };
      });
    const sub_activos = this.dataSourceAsset.data
      .filter((item) => item.low_date == null) // <-- Filtra solo los activos que están activos
      .map((item) => {
        return { id: item.id, code: item.code };
      });
    const dialogRef = this.dialog.open(ActivosGruposVincularComponent, {
      width: '400px',
      data: { activos, sub_activos },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && result.id_activo && result.id_sub_activo) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.assetsService.createAssetGroup(
              result.id_activo,
              result.id_sub_activo
            )
          );

          if (response === 200) {
            // Agregando un nuevo activo
            this._snackBar.open('Activos vinculados con éxito', 'Cerrar', {
              duration: 3000,
            });
            await this.loadDataAssetsGroup();
            await this.loadDataAssets();
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

  async eliminarActivoGrupo(element: ActivosGrupos): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /assets/{id}/associate/{num_serie}
        try {
          const response = await lastValueFrom(
            this.assetsService.deleteAssetGroup(
              element.id_activo,
              element.id_sub_activo
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
            await this.loadDataAssetsGroup();
            await this.loadDataAssets();
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
      this.dataSourceAsset.filter = filtroEstado.toString();
    } else if (this.selectedPage.value == 1) {
      this.dataSourceAssetDevice.filter = filtroEstado.toString();
    } else if (this.selectedPage.value == 2) {
      this.dataSourceAssetGroup.filter = filtroEstado.toString();
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
      await this.loadDataAssets();
      await this.loadDataAssetsType();
      this.checkActivos = true;
      this.checkInactivos = false;
      this.aplicarfiltro();
    } else if (this.selectedPage.value == 1) {
      await this.loadDataAssetsAssociate();
      this.checkActivos = true;
      this.checkInactivos = false;
      this.aplicarfiltro();
      await this.loadDataDevice();
    } else if (this.selectedPage.value == 2) {
      await this.loadDataAssetsGroup();
      this.checkActivos = true;
      this.checkInactivos = false;
      this.aplicarfiltro();
      await this.loadDataAssets();
    }
    this.cargando = false;
  }
}
