import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dialog-password-generada',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './dialog-password-generada.component.html',
  styleUrl: './dialog-password-generada.component.css',
})
export class DialogPasswordGeneradaComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogPasswordGeneradaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { password: string },
  ) {}

  copiar() {
    navigator.clipboard.writeText(this.data.password);
  }

  cerrar() {
    this.dialogRef.close();
  }
}
