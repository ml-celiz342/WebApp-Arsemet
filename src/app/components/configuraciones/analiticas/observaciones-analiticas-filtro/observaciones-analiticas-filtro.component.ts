import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

/* 👇 IMPORTANTE: la interface va AFUERA */
interface AnaliticaOption {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-observaciones-analiticas-filtro',
  standalone: true,
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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './observaciones-analiticas-filtro.component.html',
  styleUrl: './observaciones-analiticas-filtro.component.css',
})
export class ObservacionesAnaliticasFiltroComponent {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  options: AnaliticaOption[] = [];
  selectedValue!: number;

  analiticaControl = new FormControl<string | AnaliticaOption>('');
  analiticasFiltradas!: Observable<AnaliticaOption[]>;

  constructor(
    public dialogRef: MatDialogRef<ObservacionesAnaliticasFiltroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.options = this.data.opciones || [];

    // ✅ SETEAR FECHAS
    if (this.data.start && this.data.end) {
      this.range.patchValue({
        start: new Date(this.data.start),
        end: new Date(this.data.end),
      });
    }

    // ✅ SETEAR ANALÍTICA
    if (this.data.selectedOption) {
      this.selectedValue = this.data.selectedOption;

      const selected = this.options.find((o) => o.value === this.selectedValue);

      if (selected) {
        this.analiticaControl.setValue(selected);
      }
    }

    // ✅ AUTOCOMPLETE
    this.analiticasFiltradas = this.analiticaControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filtro =
          typeof value === 'string'
            ? value.toLowerCase()
            : value?.viewValue?.toLowerCase() || '';

        return this.options.filter((o) =>
          o.viewValue.toLowerCase().includes(filtro),
        );
      }),
    );
  }

  selectAnalitica(option: AnaliticaOption) {
    this.selectedValue = option.value;
  }

  displayAnalitica(analitica: AnaliticaOption | string): string {
    if (!analitica) return '';
    return typeof analitica === 'string' ? analitica : analitica.viewValue;
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
