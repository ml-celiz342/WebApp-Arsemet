import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { UsuariosClaveComponent } from '../usuarios/usuarios/usuarios-clave/usuarios-clave.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { MenuService } from '../../services/menu.service';
import { MenuSection } from '../../models/menu';
import { Usuarios } from '../../models/usuarios';
import { DashboardUsuarioComponent } from './dashboard-usuario/dashboard-usuario.component';
import { Roles } from '../../models/roles';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    MatListModule,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  cargando = false;

  isSidenavOpen = false; // Este valor controla si el sidenav está abierto o cerrado
  userName = ''; // Tu variable de usuario
  emailConfirmado = false;
  currentYear = new Date().getFullYear();
  private _snackBar = inject(MatSnackBar);
  filteredMenuSections: MenuSection[] = [];
  isMobile = false;

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private usersService: UsersService,
    private router: Router,
    private menuService: MenuService,
    private rolesService: RolesService,
  ) {
    this.filteredMenuSections = this.menuService.getFilteredMenuSections();
  }

  ngOnInit() {
    this.userName = this.authService.getUserName() || '';
    this.emailConfirmado = this.authService.getEmailConfirmado() || false;
    this.currentYear = new Date().getFullYear();
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    const sidenavContainer = document.querySelector('.sidenav-container');
    if (sidenavContainer) {
      if (this.isSidenavOpen) {
        sidenavContainer.classList.remove('sidenav-closed');
      } else {
        sidenavContainer.classList.add('sidenav-closed');
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  async cambiarClave(): Promise<void> {
    const userId = this.authService.getUserId();
    const dialogRef = this.dialog.open(UsuariosClaveComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        if (userId) {
          try {
            const response = await lastValueFrom(
              this.usersService.updateContraseneaUsuario(result), // userId
            );
            if (response == 200) {
              this._snackBar.open(
                'Contraseña del usuario actualizada',
                'Cerrar',
                {
                  duration: 3000,
                },
              );
              this.authService.localLogout();
            } else {
              this._snackBar.open(
                'No fue posible actualizar la contraseña',
                'Cerrar',
                {
                  duration: 3000,
                },
              );
            }
          } catch (err) {
            this._snackBar.open('Error al actualizar la contraseña', 'Cerrar', {
              duration: 3000,
            });
          }
        } else {
          this._snackBar.open('Error al obtener el Id del usuario', 'Cerrar', {
            duration: 3000,
          });
        }
      }
    });
  }

  // USUARIO (Para visualizar informacion y editar)
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

  async abrirMiPerfil(): Promise<void> {
    try {
      // 1. Traer info del usuario logueado
      const userInfo = await lastValueFrom(this.authService.getUserInfo());
      const userId = userInfo.id_user;
      const esEditable = userInfo.is_editable;
      const emailConfirmado = userInfo.confirmed_email;

      // 2. Mapear al formato que espera el dialog
      const usuarioAdaptado: Partial<Usuarios> = {
        id: userId,
        nombre: userInfo.name,
        apellido: userInfo.last_name,
        email: userInfo.email,
        rol_id: userInfo.role?.id_role,
      };

      // 3. cargar roles para el select
      const roles = await (
        await this.loadDataRoles()
      ).map((rol) => {
        return { id: rol.idRol, nombre: rol.nombre };
      });

      // 4. Abrir dialog
      const dialogRef = this.dialog.open(DashboardUsuarioComponent, {
        width: '400px',
        data: {
          usuario: usuarioAdaptado,
          es_editable: esEditable,
          email_confirmado: emailConfirmado,
          roles: roles,
        },
      });

      // 5. Guardar cambios
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          this.cargando = true;

          try {
            const response = await lastValueFrom(
              this.usersService.updateIam(result, userId),
            );

            if (response === 200) {
              this._snackBar.open('Perfil actualizado', 'Cerrar', {
                duration: 3000,
              });
            } else {
              this._snackBar.open('No se pudo actualizar el perfil', 'Cerrar', {
                duration: 3000,
              });
            }
          } catch (err) {
            this._snackBar.open('Error al actualizar el perfil', 'Cerrar', {
              duration: 3000,
            });
          }

          this.cargando = false;
        }
      });
    } catch (err) {
      this._snackBar.open('Error al obtener tu información', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  onLogoClick() {
    this.router.navigate(['/home']);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.toggleSidenav();
    }
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 600;
  }
}
