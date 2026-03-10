import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-evidencia-filtro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatIcon,
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

  // AUTOCOMPLETE
  control = new FormControl<any>(null);
  filteredOptions!: Observable<any[]>;

  selectedValue: number | null = null;

  // Tipos
  dataTypes = new FormGroup({
    potencia: new FormControl(false),
    corriente: new FormControl(false),
    tension: new FormControl(false),
    tareasIA: new FormControl(false),
  });

  limitadoDosDias(): boolean {
    const t = this.dataTypes.value;
    return !!(t.potencia || t.corriente || t.tension);
  }

  constructor(
    public dialogRef: MatDialogRef<EvidenciaFiltroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.options = this.data.opciones;

    this.range.patchValue({
      start: new Date(this.data.start),
      end: new Date(this.data.end),
    });

    // activo seleccionado
    if (this.data.selectedAssets?.length) {
      const found = this.options.find(
        (o) => o.value === this.data.selectedAssets[0],
      );

      if (found) {
        this.control.setValue(found);
        this.selectedValue = found.value;
      }
    }

    // filtro autocomplete
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );

    if (this.data?.dataTypes) {
      this.dataTypes.patchValue({
        potencia: this.data.dataTypes.potencia,
        corriente: this.data.dataTypes.corriente,
        tension: this.data.dataTypes.tension,
        tareasIA: this.data.dataTypes.tareasIA,
      });
    }
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
    const start = this.range.value.start;
    const end = this.range.value.end;

    const tipos = this.dataTypes.value;

    if (!start || !end) {
      this.snackBar.open('Debe seleccionar un rango de fechas', 'Cerrar', {
        duration: 2500,
      });
      return;
    }

    // validar limite de 2 dias
    if (this.limitadoDosDias()) {
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - start.getTime();
      const twoDays = 2 * 24 * 60 * 60 * 1000;

      if (diff > twoDays) {
        this.snackBar.open(
          'Para Potencia, Corriente y Tensión el rango máximo es de 2 días',
          'Cerrar',
          { duration: 2500 },
        );
        return;
      }
    }

    // validar activo
    const activo = this.control.value;

    if (!activo) {
      this.snackBar.open('Debe seleccionar un activo', 'Cerrar', {
        duration: 2500,
      });
      return;
    }

    const assetId =
      typeof activo === 'object'
        ? activo.value
        : this.options.find((o) => o.viewValue === activo)?.value;

    if (!assetId) {
      this.snackBar.open('Debe seleccionar un activo válido', 'Cerrar', {
        duration: 2500,
      });
      return;
    }

    // validar checkbox
    if (
      !tipos.potencia &&
      !tipos.corriente &&
      !tipos.tension &&
      !tipos.tareasIA
    ) {
      this.snackBar.open(
        'Debe seleccionar al menos un tipo de evidencia',
        'Cerrar',
        { duration: 2500 },
      );
      return;
    }

    // todo ok
    this.dialogRef.close({
      dateRange: this.range.value,
      selectedOptions: [assetId],
      dataTypes: this.dataTypes.value,
    });
  }
}
