import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-confirmar',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialogo-confirmar.component.html',
  styleUrl: './dialogo-confirmar.component.css',
})
export class DialogoConfirmarComponent {
  isEliminarMode = false;
  isReconocerMode = false;

  constructor(
    private dialogRef: MatDialogRef<DialogoConfirmarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEliminarMode = data.eliminar !== null ? data.eliminar : false;
    this.isReconocerMode = data.reconocer !== null ? data.reconocer : false;
  }

  cerrarDialogo(confirmado: boolean) {
    this.dialogRef.close(confirmado); // Devuelve `true` si confirma, `false` si cancela
  }
}
