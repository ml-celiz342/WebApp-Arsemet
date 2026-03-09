import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-kpi-filtro',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './kpi-filtro.component.html',
  styleUrl: './kpi-filtro.component.css',
})
export class KpiFiltroComponent {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  options: any[] = [];

  control = new FormControl<any>(null);
  filteredOptions!: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<KpiFiltroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.options = this.data.opciones;

    this.range.patchValue({
      start: new Date(this.data.start),
      end: new Date(this.data.end),
    });

    // set activo seleccionado si existe
    if (this.data.selectedAssets?.length) {
      const found = this.options.find(
        (o) => o.value === this.data.selectedAssets[0],
      );
      if (found) {
        this.control.setValue(found);
      }
    }

    // filtro reactivo
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );
  }

  private _filter(value: any): any[] {
    const text =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.viewValue?.toLowerCase() || '';

    return this.options.filter((o) => o.viewValue.toLowerCase().includes(text));
  }

  displayFn(option: any): string {
    return option?.viewValue || '';
  }

  close(): void {
    this.dialogRef.close();
  }

  applyFilters(): void {
    const val = this.control.value;

    if (!val) {
      this.dialogRef.close({
        dateRange: this.range.value,
        selectedOptions: [],
      });
      return;
    }

    if (typeof val === 'object') {
      this.dialogRef.close({
        dateRange: this.range.value,
        selectedOptions: [val.value],
      });
    } else {
      const match = this.options.find((o) => o.viewValue === val);

      this.dialogRef.close({
        dateRange: this.range.value,
        selectedOptions: match ? [match.value] : [],
      });
    }
  }
}
