import { CommonModule, DatePipe } from '@angular/common';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuarios } from '../../../models/usuarios';
import { lastValueFrom, Observable } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../../../services/session.service';
import { UsuariosAgregarComponent } from './usuarios-agregar/usuarios-agregar.component';
import { DialogoConfirmarComponent } from '../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { UsuariosClaveComponent } from './usuarios-clave/usuarios-clave.component';
import { ConfirmarCierreComponent } from '../../utilidades/confirmar-cierre/confirmar-cierre.component';
import { OauthService } from '../../../services/oauth.service';
import { RolesService } from '../../../services/roles.service';
import { Roles } from '../../../models/roles';
import { AuthService } from '../../../auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-usuarios',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatListModule,
    MatSortModule,
    MatTooltipModule,
  ],
  providers: [DatePipe],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  cargando = false;
  checkActivos = true;
  checkInactivos = false;

  displayedColumnsUsuarios: string[] = [
    'nombre',
    'apellido',
    'email',
    'rol',
    'sesiones',
    'fecha_alta',
    'fecha_baja',
    'acciones',
  ];
  dataSourceUsuarios = new MatTableDataSource<Usuarios>([]);
  @ViewChild('paginatorUsuarios') paginatorUsuarios!: MatPaginator;

  private _snackBar = inject(MatSnackBar);

  constructor(
    private dialog: MatDialog,
    private usersService: UsersService,
    private sessionService: SessionService,
    private oauthService: OauthService,
    private rolesService: RolesService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Filtro personalizado para la columna 'id' con el rango
    this.dataSourceUsuarios.filterPredicate = (
      data: Usuarios,
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
    this.loadDataUsuarios();
  }

  ngAfterViewInit() {
    this.dataSourceUsuarios.paginator = this.paginatorUsuarios;
  }

  async loadDataUsuarios() {
    try {
      const response = await lastValueFrom(this.usersService.getUsuarios());
      if (response.length !== 0) {
        const usuariosConSesiones: Usuarios[] = await Promise.all(
          response.map(async (usuario) => {
            try {
              const sesiones = await lastValueFrom(
                this.sessionService.getCountSesionsUsers(usuario.id)
              );
              return { ...usuario, sesiones };
            } catch (error) {
              console.error(
                `Error al obtener sesiones para usuario ${usuario.id}`,
                error
              );
              return { ...usuario, sesiones: 0 };
            }
          })
        );
        this.dataSourceUsuarios.data = usuariosConSesiones;
        this.aplicarfiltro();
      } else {
        this.dataSourceUsuarios.data = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
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

    this.dataSourceUsuarios.filter = filtroEstado.toString();
  }

  async loadDataRoles(): Promise<Roles[]> {
    try {
      const response = await lastValueFrom(this.rolesService.getRoles());
      if (response.length !== 0) {
        return response;
      } else {
        return [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
      return [];
    }
  }

  async agregarEditarUsuario(usuario: Usuarios | null = null): Promise<void> {
    const isEditMode = !!usuario;
    const roles = await (
      await this.loadDataRoles()
    ).map((rol) => {
      return { id: rol.idRol, nombre: rol.nombre };
    });

    const dialogRef = this.dialog.open(UsuariosAgregarComponent, {
      width: '400px',
      data: { isEditMode, usuario, roles },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        if (isEditMode) {
          //LLamo a la API de put /assets/type/id
          try {
            const response = await lastValueFrom(
              this.usersService.updateUsuario(result, usuario.id)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Usuario actualizado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataUsuarios();
              this.aplicarfiltro();
            } else {
              this._snackBar.open(
                'No fue posible actualizar el usuario',
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
              this.usersService.createUsuario(result)
            );

            if (response === 200) {
              // Agregando un nuevo activo
              this._snackBar.open('Nuevo usuario creado', 'Cerrar', {
                duration: 3000,
              });
              await this.loadDataUsuarios();
              this.aplicarfiltro();
            } else {
              this._snackBar.open(
                'No fue posible agregar el usuario',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
            }
          } catch (err) {
            this._snackBar.open('Error al agregar el usuario', 'Cerrar', {
              duration: 3000,
            });
          }
        }
        this.cargando = false;
      }
    });
  }

  async renovarContraseneaUsuario(usuario: Usuarios): Promise<void> {
    const dialogRef = this.dialog.open(UsuariosClaveComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.usersService.updateContraseneaTemporalUsuario(
              result,
              usuario.id
            )
          );
          if (response == 200) {
            this._snackBar.open(
              'Contraseña del usuario actualizada',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataUsuarios();
            this.aplicarfiltro();
          } else {
            this._snackBar.open(
              'No fue posible actualizar la contraseña',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
        } catch (err) {
          this._snackBar.open('Error al actualizar la contraseña', 'Cerrar', {
            duration: 3000,
          });
        }
        this.cargando = false;
      }
    });
  }

  async cerrarSesionesUsuario(usuario: Usuarios): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmarCierreComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.oauthService.cerrarTodasSesiones(usuario.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'Se cerraron todas las sesiones para el usuario',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          } else {
            this._snackBar.open(
              'No fue posible cerrar las sesiones',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
        } catch (err) {
          this._snackBar.open('Error al cerrar las sesiones', 'Cerrar', {
            duration: 3000,
          });
        }
        this.cargando = false;
      }
    });
  }

  async eliminarUsuario(usuario: Usuarios): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;
        try {
          const response = await lastValueFrom(
            this.usersService.deleteUsuario(usuario.id)
          );
          if (response == 200) {
            this._snackBar.open(
              'El usuario fue desactivado correctamente',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            await this.loadDataUsuarios();
            this.aplicarfiltro();
          } else {
            this._snackBar.open(
              'No fue posible deshabilitar el usuario',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
        } catch (err) {
          this._snackBar.open('Error al deshabilitar el usuario', 'Cerrar', {
            duration: 3000,
          });
        }
        this.cargando = false;
      }
    });
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
    await this.loadDataUsuarios();
    this.checkActivos = true;
    this.checkInactivos = false;
    this.aplicarfiltro();
    this.cargando = false;
  }
}
