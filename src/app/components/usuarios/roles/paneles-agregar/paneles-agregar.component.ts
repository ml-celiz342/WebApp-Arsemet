import { Component, Inject } from '@angular/core';
import { NewPanel, Panels } from '../../../../models/panels';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-paneles-agregar',
  imports: [CommonModule,
      MatDialogModule,
      MatFormFieldModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatInputModule,],
  templateUrl: './paneles-agregar.component.html',
  styleUrl: './paneles-agregar.component.css',
})
export class PanelesAgregarComponent {
  nombre: string = '';
  panelAnterior?: Panels;

  constructor(
    public dialogRef: MatDialogRef<PanelesAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  guardarPanel(): void {
    if (this.nombre) {
      var nuevoPanel: NewPanel = {};
      nuevoPanel.nombre = this.nombre;

      this.dialogRef.close(nuevoPanel);
      return;
    }
    this.dialogRef.close();
  }
}
