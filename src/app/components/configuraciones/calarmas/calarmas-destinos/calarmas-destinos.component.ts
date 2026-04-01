import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlarmaOrigenDestino, AlarmSource } from '../../../../models/alarmas';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../auth.service';
import { AlarmasService } from '../../../../services/alarmas.service';
import { UsersService } from '../../../../services/users.service';
import { lastValueFrom } from 'rxjs';
import { DialogoConfirmarComponent } from '../../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { CalarmasAgregarDestionComponent } from '../calarmas-agregar-destion/calarmas-agregar-destion.component';
import { UsuariosVerificados } from '../../../../models/usuarios';

@Component({
  selector: 'app-calarmas-destinos',
  imports: [
    CommonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatIcon,
    MatTooltipModule,
  ],
  templateUrl: './calarmas-destinos.component.html',
  styleUrl: './calarmas-destinos.component.css',
})
export class CalarmasDestinosComponent {
  origen!: AlarmSource;

  destinos: AlarmaOrigenDestino[] = [];
  usuariosVerificados: UsuariosVerificados[] = [];

  private _snackBar = inject(MatSnackBar);

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private alarmService: AlarmasService,
    private usersService: UsersService,
    public dialogRef: MatDialogRef<CalarmasDestinosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { campos: AlarmSource },
  ) {
    if (!data?.campos) {
      this.dialogRef.close();
      return;
    }
    this.origen = data.campos;
  }

  ngOnInit(): void {
    this.loadDataAlarmDestiny();
    this.loadUsuariosVerificados();
  }

  async loadDataAlarmDestiny() {
    try {
      const response = await lastValueFrom(
        this.alarmService.getAlarmSourceDestiny(this.origen.id),
      );
      if (response.length !== 0) {
        this.destinos = response;
      } else {
        this.destinos = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  /* Eliminar destino */
  async eliminarDestino(id_destin: number): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { eliminar: true },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {

        try {
          const response = await lastValueFrom(
            this.alarmService.deleteAlarmSourceDestiny(
              this.origen.id,
              id_destin,
            ),
          );

          if (response === 200) {
            this._snackBar.open('Destino eliminado', 'Cerrar', {
              duration: 3000,
            });

            // Actualizar la lista de descansos
            await this.loadDataAlarmDestiny();
          } else {
            this._snackBar.open(
              'No fue posible eliminar el destino',
              'Cerrar',
              {
                duration: 3000,
              },
            );
          }
        } catch (err) {
          this._snackBar.open('Error al eliminar el destino', 'Cerrar', {
            duration: 3000,
          });
        }

      }
    });
  }

  /* Agregar destino */
  async agregarDestino(): Promise<void> {
    const dialogRef = this.dialog.open(CalarmasAgregarDestionComponent, {
      width: '400px',
      data: {
        opciones: this.usuariosVerificados.map((item) => ({
          value: item.id,
          viewValue: item.nombre  + '-' + item.apellido,
        })),
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }

      try {
        const response = await lastValueFrom(
          this.alarmService.createAlarmSourceDestiny(this.origen.id, result),
        );

        if (response === 200) {
          this._snackBar.open('Destino agregado', 'Cerrar', {
            duration: 3000,
          });

          this.loadDataAlarmDestiny();
        } else {
          this._snackBar.open('No fue posible agregar el destino', 'Cerrar', {
            duration: 3000,
          });
        }
      } catch (err) {
        this._snackBar.open('Error al agregar el destino', 'Cerrar', {
          duration: 3000,
        });
      }

    });
  }

  async loadUsuariosVerificados() {
    try {
      const response = await lastValueFrom(
        this.usersService.getUsuariosVerificados(),
      );
      if (response.length !== 0) {
        this.usuariosVerificados = response;
      } else {
        this.usuariosVerificados = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los usuarios verificados', 'Cerrar', {
        duration: 3000,
      });
    }
  }

}
