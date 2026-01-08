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
import { TareasComponent } from '../tareas.component';

@Component({
  selector: 'app-tareas-filtro',
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
  templateUrl: './tareas-filtro.component.html',
  styleUrl: './tareas-filtro.component.css',
})
export class TareasFiltroComponent {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  activos = new FormControl('');
  activosList: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<TareasFiltroComponent>,
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

