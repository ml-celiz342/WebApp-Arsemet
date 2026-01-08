import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Tarea } from '../../../../models/tasks';

@Component({
  selector: 'app-tareas-detalle',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogModule,
    MatButtonModule,
],
  templateUrl: './tareas-detalle.component.html',
  styleUrl: './tareas-detalle.component.css',
})
export class TareasDetalleComponent {
  constructor(
    public dialogRef: MatDialogRef<TareasDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tarea
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
