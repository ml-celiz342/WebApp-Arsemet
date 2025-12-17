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
  selector: 'app-alarmas-filtro',
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
  templateUrl: './alarmas-filtro.component.html',
  styleUrl: './alarmas-filtro.component.css',
})
export class AlarmasFiltroComponent {
  isActualizar: boolean = false;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  activos = new FormControl('');
  activosList: string[] = [];

  niveles = new FormControl('');
  nivelesList: string[] = [];

  estados = new FormControl('');
  estadosList: string[] = [];

  origenes = new FormControl('');
  origenesList: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AlarmasFiltroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data) {
      this.activosList = this.data.activosList;
      this.activos.setValue(this.data.activos);
      this.niveles.setValue(this.data.niveles);
      this.estados.setValue(this.data.estados);
      this.origenes.setValue(this.data.origenes);
      this.range.patchValue({
        start: new Date(this.data.start),
        end: new Date(this.data.end),
      });
      this.nivelesList = this.data.nivelesList;
      this.estadosList = this.data.estadosList;
      this.origenesList = this.data.origenesList;
      this.isActualizar = this.data.automatico;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  applyFilters(): void {
    this.dialogRef.close({
      dateRange: this.range.value,
      activos: this.activos.value,
      niveles: this.niveles.value,
      estados: this.estados.value,
      origenes: this.origenes.value,
      automatico: this.isActualizar,
    });
  }

  checkedEvento(event: any) {
    this.isActualizar = event.checked;
  }
}
