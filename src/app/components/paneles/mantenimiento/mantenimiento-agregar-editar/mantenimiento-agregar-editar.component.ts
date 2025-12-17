import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Maintenance, NewMaintenance } from '../../../../models/maintenance';

@Component({
  selector: 'app-mantenimiento-agregar-editar',
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
  templateUrl: './mantenimiento-agregar-editar.component.html',
  styleUrl: './mantenimiento-agregar-editar.component.css',
})
export class MantenimientoAgregarEditarComponent {
  form: FormGroup;
  isEditMode: boolean = false;
  activos: any[] = [];
  mantenimientoAnterior?: Maintenance;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MantenimientoAgregarEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode || false;
    this.activos = data.activos;
    this.mantenimientoAnterior = data.mantenimiento ?? null;

    // AÑADIDO: Reconstruir IDs reales aunque el backend mande 0
    const resolvedAssetId =
      this.mantenimientoAnterior && this.mantenimientoAnterior.asset_code
        ? this.activos.find(
            (a) => a.code === this.mantenimientoAnterior!.asset_code
          )?.id ?? null
        : null;

    this.form = this.fb.group({
      reason: [this.mantenimientoAnterior?.reason ?? ''],
      detail: [this.mantenimientoAnterior?.observation ?? ''],
      start: [
        this.mantenimientoAnterior?.start
          ? this.toDatetimeLocal(this.mantenimientoAnterior.start)
          : null,
        Validators.required,
      ],
      end: [
        this.mantenimientoAnterior?.end
          ? this.toDatetimeLocal(this.mantenimientoAnterior.end)
          : null,
      ],
      id_asset: [resolvedAssetId, Validators.required],
    });

    // Deshabilitar campos si se esta editando
    if (this.isEditMode) {
      this.form.get('id_asset')?.disable();
      this.form.get('reason')?.disable();
    }
  }

  private toDatetimeLocal(date: Date): string {
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, '0');

    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  setNow(campo: 'start' | 'end', checked: boolean) {
    if (checked) {
      const now = new Date();
      this.form.get(campo)?.setValue(this.toDatetimeLocal(now));
    } else {
      this.form.get(campo)?.setValue(null);
    }
  }

  guardarTarea(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;

    // Editar tarea
    if (this.isEditMode && this.mantenimientoAnterior) {
      const updateData: NewMaintenance = {};

      if (values.detail !== this.mantenimientoAnterior.observation)
        updateData.observation = values.detail;

      // Fecha inicio
      const startDate = values.start ? new Date(values.start) : null;
      const oldStart = new Date(this.mantenimientoAnterior.start);

      if (startDate && startDate.toISOString() !== oldStart.toISOString()) {
        updateData.start = startDate;
      }

      // Fecha fin
      const endDate = values.end ? new Date(values.end) : null;
      const oldEnd = this.mantenimientoAnterior.end
        ? new Date(this.mantenimientoAnterior.end)
        : null;

      if (
        (endDate && !oldEnd) ||
        (!endDate && oldEnd) ||
        (endDate && oldEnd && endDate.toISOString() !== oldEnd.toISOString())
      ) {
        updateData.end = endDate;
      }

      this.dialogRef.close({ updateData });
      return;
    }

    // Crear tarea
    const startDate = new Date(values.start);
    const endDate = values.end ? new Date(values.end) : null;

    const newMantenimiento: NewMaintenance = {
      id_asset: Number(values.id_asset),
      reason: values.reason,
      observation: values.detail?.trim() ? values.detail : null,
      start: startDate,
      end: endDate ?? null,
    };

    this.dialogRef.close({ newMantenimiento });
  }
}
