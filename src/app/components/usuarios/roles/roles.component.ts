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
import { FormControl, NonNullableFormBuilder } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RoleModule, RoleModulePanels, Roles } from '../../../models/roles';
import { Modulos } from '../../../models/modulos';
import { RolesService } from '../../../services/roles.service';
import { ModulosService } from '../../../services/modulos.service';
import { RolesAgregarComponent } from './roles-agregar/roles-agregar.component';
import { ModulosAgregarComponent } from './modulos-agregar/modulos-agregar.component';
import { AuthService } from '../../../auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VerPermisosComponent } from './ver-permisos/ver-permisos.component';
import { Panels } from '../../../models/panels';
import { PanelsService } from '../../../services/panels.service';
import { PanelesAgregarComponent } from './paneles-agregar/paneles-agregar.component';

@Component({
  selector: 'app-roles',
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
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent {
  cargando = false;

  displayedColumnsData: string[] = [
    'nombre',
    'duracion',
    'cantidad',
    'acciones',
  ];
  dataSourceRoles = new MatTableDataSource<Roles>([]);
  @ViewChild('paginatorData') paginatorData!: MatPaginator;

  displayedColumnsModulo: string[] = ['nombre', 'acciones'];
  dataSourceModulo = new MatTableDataSource<Modulos>([]);
  @ViewChild('paginatorTipo') paginatorTipo!: MatPaginator;

  displayedColumnsPanel: string[] = ['nombre', 'acciones'];
  dataSourcePanel = new MatTableDataSource<Panels>([]);
  @ViewChild('paginatorPanel') paginatorPanel!: MatPaginator;

  private _snackBar = inject(MatSnackBar);

  constructor(
    private dialog: MatDialog,
    private rolesService: RolesService,
    private modulosService: ModulosService,
    private panelsService: PanelsService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDataRoles();
    this.loadDataModulos();
    this.loadDataPaneles();
  }

  ngAfterViewInit() {
    this.dataSourceRoles.paginator = this.paginatorData;
    this.dataSourceModulo.paginator = this.paginatorTipo;
    this.dataSourcePanel.paginator = this.paginatorPanel;
  }

  async loadDataRoles() {
    try {
      const response = await lastValueFrom(this.rolesService.getRoles());
      if (response.length !== 0) {
        this.dataSourceRoles.data = response;
      } else {
        this.dataSourceRoles.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataModulos() {
    try {
      const response = await lastValueFrom(this.modulosService.getModulos());
      if (response.length !== 0) {
        this.dataSourceModulo.data = response;
      } else {
        this.dataSourceModulo.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataPaneles() {
    try {
      const response = await lastValueFrom(this.panelsService.getPaneles());
      if (response.length !== 0) {
        this.dataSourcePanel.data = response;
      } else {
        this.dataSourcePanel.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadDataPermisosbyRol(idRol: number): Promise<RoleModulePanels | null> {
    try {
      const response = await lastValueFrom(
        this.rolesService.getPermisosbyRole(idRol)
      );
      if (response.module.length !== 0 || response.panels.length !== 0) {
        return response;
      } else {
        return null;
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
      return null;
    }
  }

  async agregarEditarRol(roles: Roles | null = null) {
    const isEditMode = !!roles;
    var permisos: RoleModulePanels | null = null;
    if (roles) {
      permisos = await this.loadDataPermisosbyRol(roles.idRol); // LES PASO LOS PERMISOS PARA CADA MODULO ASOCIADOS AL ROL
    }
    const modulos = this.dataSourceModulo.data // LE PASO TODOS LOS MODULOS, CON LOS PERMISOS EN FALSO.
      .map((item) => {
        return {
          idModulo: item.idModelo,
          nombre: item.nombre,
          editar: false,
          escribir: false,
          leer: false,
        };
      });

    const paneles = this.dataSourcePanel.data
      .map((item) => {
        return {
          idPanel: item.idPanel,
          nombre: item.nombre,
          ver: false,
        };
      });

    const dialogRef = this.dialog.open(RolesAgregarComponent, {
      width: '400px',
      data: { roles, isEditMode, permisos, modulos, paneles },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        console.log(result)
        this.cargando = true;
        if (isEditMode) {
          try {
            if (result.nuevoRol && result.nuevoRol.length > 0) {
              // Si se editó el rol (pero no los permisos)
              const response = await lastValueFrom(
                this.rolesService.updateRol(result.nuevoRol, roles.idRol)
              );
              if (response === 200) {
                this._snackBar.open('Rol actualizado', 'Cerrar', {
                  duration: 3000,
                });
                await this.loadDataRoles();
              } else {
                this._snackBar.open(
                  'No fue posible actualizar el rol',
                  'Cerrar',
                  {
                    duration: 3000,
                  }
                );
              }
            }

            //Si hay que editar permisos:
            if (result.editarModulo && result.editarModulo.length > 0) {
              const response = await lastValueFrom(
                this.rolesService.updateRolModules(
                  roles.idRol,
                  result.editarModulo
                )
              );
              if (response === 200) {
                this._snackBar.open('Permisos actualizados', 'Cerrar', {
                  duration: 3000,
                });
              }
            }

            //Si hay que agregar permisos:
            if (result.nuevoModulo && result.nuevoModulo.length > 0) {
              const response = await lastValueFrom(
                this.rolesService.createRolModulo(
                  result.nuevoModulo,
                  roles.idRol
                )
              );
              if (response === 200) {
                this._snackBar.open('Permisos agregados', 'Cerrar', {
                  duration: 3000,
                });
              }
            }

            //Si hay que eliminar permisos:
            if (result.eliminarModulo && result.eliminarModulo.length > 0) {
              const response = await lastValueFrom(
                this.rolesService.deleteRolModules(
                  roles.idRol,
                  result.eliminarModulo
                )
              );
              if (response === 200) {
                this._snackBar.open('Permisos eliminados', 'Cerrar', {
                  duration: 3000,
                });
              }
            }

            //Si hay que agregar paneles:
            if (result.nuevoPanel && result.nuevoPanel.length > 0) {
              const response = await lastValueFrom(
                this.rolesService.createRolPanel(result.nuevoPanel, roles.idRol)
              );
              if (response === 200) {
                this._snackBar.open('Paneles agregados', 'Cerrar', {
                  duration: 3000,
                });
              }
            }

            //Si hay que eliminar paneles:
            if (result.eliminarPanel && result.eliminarPanel.length > 0) {
              const response = await lastValueFrom(
                this.rolesService.deleteRolPaneles(
                  roles.idRol,
                  result.eliminarPanel
                )
              );
              if (response === 200) {
                this._snackBar.open('Paneles eliminados', 'Cerrar', {
                  duration: 3000,
                });
              }
            }
            await this.loadDataRoles();
          } catch (err) {
            this._snackBar.open('Error al actualizar los datos', 'Cerrar', {
              duration: 3000,
            });
          }
        } else {
          //LLamo a la API de post roles
          try {
            const response = await lastValueFrom(
              this.rolesService.createRol(result.nuevoRol)
            );
            if (response.status === 200 && result.nuevoModulo.length != 0) {
              var idRol = response.idRol;
              try {
                // llamo a la api de asociacion:/roles/{id}/associate
                const response = await lastValueFrom(
                  this.rolesService.createRolModulo(result.nuevoModulo, idRol)
                );
                if (response === 200 && result.nuevoPanel.length != 0){
                  try {
                    const response = await lastValueFrom(
                      this.rolesService.createRolPanel(result.nuevoPanel, idRol)
                    );
                    if (response === 200) {
                      // Agregando un nuevo rol
                      this._snackBar.open('Rol y permisos agregados', 'Cerrar', {
                        duration: 3000,
                      });
                      await this.loadDataRoles();
                    } else {
                      this._snackBar.open(
                        'No fue posible asignar los permisos al rol',
                        'Cerrar',
                        {
                          duration: 3000,
                        }
                      );
                    }
                  }catch (err) {
                    this._snackBar.open('Error al asignar los paneles', 'Cerrar', {
                      duration: 3000,
                    });
                  }
                }
              } catch (err) {
                this._snackBar.open('Error al asignar los permisos', 'Cerrar', {
                  duration: 3000,
                });
              }
            } else if (response.status === 200) {
              this._snackBar.open('Rol agregado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataRoles();
            } else {
              this._snackBar.open('No fue posible agregar el Rol', 'Cerrar', {
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
      }
    });
  }

  async eliminarRol(element: Roles): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { eliminar: true },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /roles/{id}
        try {
          const response = await lastValueFrom(
            this.rolesService.deleteRol(element.idRol)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue desactivado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataRoles();
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

  async verModulos(roles: Roles): Promise<void> {
    var permisos: RoleModulePanels | null = null;
    if (roles) {
      permisos = await this.loadDataPermisosbyRol(roles.idRol); // LES PASO LOS PERMISOS PARA CADA MODULO ASOCIADOS AL ROL
    }
    const dialogRef = this.dialog.open(VerPermisosComponent, {
      width: '400px',
      data: { roles, permisos },
    });
  }

  async agregarModulo() {
    const dialogRef = this.dialog.open(ModulosAgregarComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.modulosService.createModulo(result)
          );
          if (response === 200) {
            this._snackBar.open('Modulo agregado', 'Cerrar', {
              duration: 3000,
            });
            await this.loadDataModulos();
          } else {
            this._snackBar.open('No fue posible agregar el modulo', 'Cerrar', {
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

  async eliminarModulo(element: Modulos): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { eliminar: true },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /module/{id}
        try {
          const response = await lastValueFrom(
            this.modulosService.deleteModulo(element.idModelo)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue eliminado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataModulos();
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

  async agregarPanel() {
    const dialogRef = this.dialog.open(PanelesAgregarComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.panelsService.createPaneles(result)
          );
          if (response === 200) {
            this._snackBar.open('Panel agregado', 'Cerrar', {
              duration: 3000,
            });
            await this.loadDataPaneles();
          } else {
            this._snackBar.open('No fue posible agregar el panel', 'Cerrar', {
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

  async eliminarPanel(element: Panels): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { eliminar: true },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        //LLamo a la API de delete /module/{id}
        try {
          const response = await lastValueFrom(
            this.panelsService.deletePaneles(element.idPanel)
          );
          if (response == 200) {
            this._snackBar.open(
              'El registro fue eliminado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataPaneles();
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

  async recargar() {
    this.cargando = true;
    await this.loadDataRoles();
    await this.loadDataModulos();
    await this.loadDataPaneles();
    this.cargando = false;
  }
}
