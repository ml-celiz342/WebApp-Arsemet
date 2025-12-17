import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-json-view',
  imports: [CommonModule, MatCardModule],
  templateUrl: './json-view.component.html',
  styleUrl: './json-view.component.css',
})
export class JsonViewComponent {
  datajson: any;

  constructor(
    public dialogRef: MatDialogRef<JsonViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.manifiesto) {
      this.datajson = data.manifiesto;
    }
    if (data.template) {
      this.datajson = data.template;
    }
  }
}
