import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ShiftDetail } from '../../../../models/shift';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DescansosAgregarComponent } from '../descansos-agregar/descansos-agregar.component';
import { lastValueFrom } from 'rxjs';
import { DialogoConfirmarComponent } from '../../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShiftsService } from '../../../../services/shifts.service';

@Component({
  selector: 'app-turnos-historico',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatIcon,
    MatTooltipModule,
  ],
  templateUrl: './turnos-historico.component.html',
  styleUrl: './turnos-historico.component.css',
})
export class TurnosHistoricoComponent {
  shift!: ShiftDetail;

  cargando = false;

  private _snackBar = inject(MatSnackBar);

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private shiftsService: ShiftsService,
    public dialogRef: MatDialogRef<TurnosHistoricoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { campos: ShiftDetail }
  ) {
    if (!data?.campos) {
      this.dialogRef.close();
      return;
    }

    this.shift = data.campos;

    // Si breaks es null, inicializa como array vacio
    if (!this.shift.breaks) {
      this.shift.breaks = [];
    }
  }

  /* Agregar descanso */
  async agregarDescanso(): Promise<void> {
    if (!this.shift) return;

    const dialogRef = this.dialog.open(DescansosAgregarComponent, {
      width: '400px',
      data: { idTurno: this.shift.id_shift },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }

      this.cargando = true;

      try {
        const response = await lastValueFrom(
          this.shiftsService.createBreak(this.shift.id_shift, result)
        );

        if (response.status === 200) {
          this._snackBar.open('Descanso agregado', 'Cerrar', {
            duration: 3000,
          });

          // Actualizar la lista de descansos
          const updatedShift = await lastValueFrom(
            this.shiftsService.getShift(this.shift.id_shift)
          );

          this.shift = updatedShift;
        } else {
          this._snackBar.open('No fue posible agregar el descanso', 'Cerrar', {
            duration: 3000,
          });
        }
      } catch (err) {
        this._snackBar.open('Error al agregar el descanso', 'Cerrar', {
          duration: 3000,
        });
      }

      this.cargando = false;
    });
  }

  /* Eliminar descanso */
  async eliminarDescanso(id_break: number): Promise<void> {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { opciones: '' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.cargando = true;

        try {
          const response = await lastValueFrom(
            this.shiftsService.deleteBreak(this.shift.id_shift, id_break)
          );

          if (response === 200) {
            this._snackBar.open('Descanso eliminado', 'Cerrar', {
              duration: 3000,
            });

            // Actualizar la lista de descansos
            this.shift.breaks = this.shift.breaks?.filter(
              (b) => b.id_break !== id_break
            );
          } else {
            this._snackBar.open(
              'No fue posible eliminar el descanso',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
        } catch (err) {
          this._snackBar.open('Error al eliminar el descanso', 'Cerrar', {
            duration: 3000,
          });
        }

        this.cargando = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  /* Mostrar hora correctamente en el timepicker */
  parseISOWithMinus3(value: string | Date): Date {
    // Si ya es Date, devuelve directo
    if (value instanceof Date) {
      return value;
    }
    // Si es string ISO con -03:00
    const match = value.match(/T(\d{2}):(\d{2}):(\d{2})/);
    if (!match) return new Date();
    const [, h, m, s] = match.map(Number);
    const d = new Date();
    d.setHours(h, m, s, 0); // fuerza hora local sin corrimiento
    return d;
  }

  // Mostrar hora
  getBreakHour(value: string | Date): string {
    const date = this.parseISOWithMinus3(value);
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }
}
