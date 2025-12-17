import { Component, ChangeDetectorRef, ViewChild, OnInit, EventEmitter, Input, Output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsInfo } from '../../../../models/sessions-info';
import { SessionService } from '../../../../services/session.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sesiones-info',
  standalone: true, // Agregado si el componente es standalone
  imports: [
    CommonModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './sesiones-info.component.html',
  styleUrl: './sesiones-info.component.css',
})
export class SesionesInfoComponent {
  @Input() sesiones: SessionsInfo[] = [];
  @Input() total: number = 0;
  @Input() pageSize: number = 20;
  @Input() titulo: string = "";
  @Output() pageChange = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<string>();

  dataSource: MatTableDataSource<SessionsInfo>;
  displayedColumnsInfo: string[] = ['name', 'login_date', 'logout_date'];

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource<SessionsInfo>([]);
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: SessionsInfo, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };
  }

  ngOnChanges() {
    this.dataSource.data = this.sesiones;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onPageChange(event: any) {
    this.pageChange.emit(event);
  }

  applyTipo(filter: string) {
    this.filterChange.emit(filter);
  }
}
