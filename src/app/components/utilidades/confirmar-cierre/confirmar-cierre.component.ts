import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-cierre',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmar-cierre.component.html',
  styleUrl: './confirmar-cierre.component.css',
})
export class ConfirmarCierreComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmarCierreComponent>) {}

  cerrarDialogo(confirmado: boolean) {
    this.dialogRef.close(confirmado); // Devuelve `true` si confirma, `false` si cancela
  }
  
}
