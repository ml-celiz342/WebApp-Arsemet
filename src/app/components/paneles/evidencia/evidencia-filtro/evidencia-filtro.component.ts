import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-evidencia-filtro',
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
    MatCheckboxModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './evidencia-filtro.component.html',
  styleUrl: './evidencia-filtro.component.css',
})
export class EvidenciaFiltroComponent {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  options: any[] = [];

  selectedValue: number | null = null; // 1 solo

  constructor(
    public dialogRef: MatDialogRef<EvidenciaFiltroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.options = this.data.opciones;
    this.range.patchValue({
      start: new Date(this.data.start),
      end: new Date(this.data.end),
    });

    this.selectedValue = this.data.selectedAssets?.[0] ?? null;
  }

  close(): void {
    this.dialogRef.close();
  }

  applyFilters(): void {
    this.dialogRef.close({
      dateRange: this.range.value,
      selectedOptions: this.selectedValue !== null ? [this.selectedValue] : [],
    });
  }
}
