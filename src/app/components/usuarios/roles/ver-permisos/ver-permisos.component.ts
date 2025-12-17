import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Para usar ngModel
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RoleModule, RolePanels } from '../../../../models/roles';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-ver-permisos',
  imports: [
    CommonModule,
    MatInputModule,
    MatOptionModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckbox,
  ],
  templateUrl: './ver-permisos.component.html',
  styleUrl: './ver-permisos.component.css',
})
export class VerPermisosComponent {
  dataSourcePermisos = new MatTableDataSource<RoleModule>([]);
  displayedColumns: string[] = ['name', 'read', 'write', 'edit'];

  dataSourcePaneles = new MatTableDataSource<RolePanels>([]);
  displayedColumnsPaneles: string[] = ['name', 'view'];

  constructor(
    public dialogRef: MatDialogRef<VerPermisosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSourcePermisos.data = this.data.permisos.module || [];
    this.dataSourcePaneles.data = this.data.permisos.panels || [];
  }

  close(): void {
    this.dialogRef.close();
  }
}
