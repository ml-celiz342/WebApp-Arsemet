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

@Component({
  selector: 'app-observaciones-analiticas-filtro',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './observaciones-analiticas-filtro.component.html',
  styleUrl: './observaciones-analiticas-filtro.component.css',
})
export class ObservacionesAnaliticasFiltroComponent {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  options: any[] = [];
  selectedValue: any;

  constructor(
    public dialogRef: MatDialogRef<ObservacionesAnaliticasFiltroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.options = this.data.opciones;
  }

  close(): void {
    this.dialogRef.close();
  }

  applyFilters(): void {
    this.dialogRef.close({
      dateRange: this.range.value,
      selectedOption: this.selectedValue,
    });
  }
}
