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
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from "@angular/material/autocomplete";

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
    MatAutocompleteModule,
    MatOptionModule,
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

  activosCtrl = new FormControl(''); // Control del input para autocomplete
  activosList: string[] = []; // Lista completa de activos
  activosSelected: string[] = []; // Activos seleccionados
  filteredActivos!: Observable<string[]>; // Lista filtrada para autocomplete

  constructor(
    public dialogRef: MatDialogRef<TareasFiltroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    if (this.data) {
      this.activosList = this.data.activosList || [];
      this.activosSelected = this.data.activos || [];
      this.range.patchValue({
        start: new Date(this.data.start),
        end: new Date(this.data.end),
      });
    }

    // Filtrado de autocomplete
    this.filteredActivos = this.activosCtrl.valueChanges.pipe(
      startWith(''),
      map((value: string | null) =>
        value ? this._filter(value) : this.activosList.slice(),
      ),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.activosList.filter(
      (activo) =>
        activo.toLowerCase().includes(filterValue) &&
        !this.activosSelected.includes(activo),
    );
  }

  addActivo(activo: string) {
    if (activo && !this.activosSelected.includes(activo)) {
      this.activosSelected.push(activo);
    }
    this.activosCtrl.setValue('');
  }

  removeActivo(activo: string) {
    const index = this.activosSelected.indexOf(activo);
    if (index >= 0) {
      this.activosSelected.splice(index, 1);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  applyFilters(): void {
    this.dialogRef.close({
      dateRange: this.range.value,
      activos: this.activosSelected,
    });
  }
}
