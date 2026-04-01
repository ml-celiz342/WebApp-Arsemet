import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Usuarios, NuevoUsuario } from '../../../models/usuarios';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsuariosUpdateClaveComponent } from '../../usuarios/usuarios/usuarios-update-clave/usuarios-update-clave.component';
import { lastValueFrom } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatOptionModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard-usuario.component.html',
  styleUrl: './dashboard-usuario.component.css',
})
export class DashboardUsuarioComponent {
  userId: number = 0;
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  rolNombre: string = '';

  esEditable: boolean = false;
  emailConfirmado: boolean = false;

  usuarioAnterior?: Usuarios;

  private _snackBar = inject(MatSnackBar);
  cargando = false;

  constructor(
    private dialog: MatDialog,
    private usersService: UsersService,
    public dialogRef: MatDialogRef<DashboardUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data.usuario) {
      this.usuarioAnterior = data.usuario;

      this.userId = data.usuario.id;
      this.nombre = data.usuario.nombre;
      this.apellido = data.usuario.apellido;
      this.email = data.usuario.email;

      // mostramos nombre del rol (no editable)
      this.rolNombre =
        data.roles?.find((r: any) => r.id === data.usuario.rol_id)?.nombre ||
        'Sin rol';
    }

    this.esEditable = data.es_editable ?? false;
    this.emailConfirmado = data.email_confirmado ?? false;
  }

  close(): void {
    this.dialogRef.close();
  }

  guardarUsuario(): void {
    if (!this.nombre || !this.apellido) {
      return;
    }

    const nuevoUsuario: NuevoUsuario = {};

    if (this.nombre !== this.usuarioAnterior?.nombre) {
      nuevoUsuario.nombre = this.nombre;
    }

    if (this.apellido !== this.usuarioAnterior?.apellido) {
      nuevoUsuario.apellido = this.apellido;
    }

    // EMAIL solo si se puede editar Y cambió
    if (this.esEditable && this.email !== this.usuarioAnterior?.email) {
      nuevoUsuario.email = this.email;
    }

    this.dialogRef.close(nuevoUsuario);
  }

  // verificar email
  async verificarEmailUsuario(usuario: number): Promise<void> {
    const dialogRef = this.dialog.open(UsuariosUpdateClaveComponent, {
      width: '400px',
      data: {
        titulo: 'Verificar Email de Usuario',
        mensaje:
          '¿Está seguro de que desea generar un código de verificación para confirmar el email del usuario?',
        detalle:
          'Este código será válido durante 2 horas y solo podrá utilizarse una vez.',
        icono: 'warning',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;

        try {
          const response = await lastValueFrom(
            this.usersService.verifiedIamEmail(),
          );

          if (response?.result === 'token generado') {
            this._snackBar.open(
              'Token de verificacion generado correctamente',
              'Cerrar',
              {
                duration: 3000,
              },
            );
          } else {
            this._snackBar.open(
              'No fue posible generar el token de verificacion',
              'Cerrar',
              { duration: 3000 },
            );
          }
        } catch (err) {
          this._snackBar.open(
            'Error al actualizar el token de verificacion',
            'Cerrar',
            {
              duration: 3000,
            },
          );
        }

        this.cargando = false;
      }
    });
  }
}
