import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-mantenimiento-filtro',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './mantenimiento-filtro.component.html',
  styleUrl: './mantenimiento-filtro.component.css',
})
export class MantenimientoFiltroComponent {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  activos = new FormControl('');
  activosList: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<MantenimientoFiltroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data) {
      this.activosList = this.data.activosList;
      this.activos.setValue(this.data.activos);
      this.range.patchValue({
        start: new Date(this.data.start),
        end: new Date(this.data.end),
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  applyFilters(): void {
    this.dialogRef.close({
      dateRange: this.range.value,
      activos: this.activos.value,
    });
  }
}
