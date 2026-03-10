import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SessionsUsers } from '../../../../models/sessions-users';
import { SessionsDevices } from '../../../../models/sessions-devices';

@Component({
  selector: 'app-sesiones-resumen',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './sesiones-resumen.component.html',
  styleUrl: './sesiones-resumen.component.css',
})
export class SesionesResumenComponent implements OnChanges {
  @Input() tipo: 'user' | 'device' = 'user';
  @Input() sesionesUsers: SessionsUsers[] = [];
  @Input() sesionesDevices: SessionsDevices[] = [];
  @Input() titulo: string = '';

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];

  ngOnChanges() {
    if (this.tipo === 'user') {
      this.dataSource.data = this.sesionesUsers;
      this.displayedColumns = ['name', 'status'];
    } else {
      this.dataSource.data = this.sesionesDevices;
      this.displayedColumns = ['code_assets', 'serie_number', 'status'];
    }
  }
}
