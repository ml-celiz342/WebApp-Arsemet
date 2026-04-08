import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UsuariosVerificados } from '../../../../models/usuarios';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-calarmas-agregar-destion',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './calarmas-agregar-destion.component.html',
  styleUrl: './calarmas-agregar-destion.component.css',
})
export class CalarmasAgregarDestionComponent {
  options: any[] = [];

  control = new FormControl<any>(null);
  filteredOptions!: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<CalarmasAgregarDestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data.opciones) {
      this.options = data.opciones;
    }
  }

  ngOnInit() {
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

  close(): void {
    this.dialogRef.close();
  }

  guardarDestino(): void {
    const val = this.control.value;

    if(!val){
      this.dialogRef.close();
      return;
    }

    if (typeof val === 'object') {
      this.dialogRef.close(val.value);
    } else {
      const match = this.options.find((o) => o.viewValue === val);

      this.dialogRef.close(match ? match.value : null);
    }
  }

  displayFn(option: any): string {
    return option?.viewValue || '';
  }

}
