import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ZonasIA } from '../../../../models/evidencia-potencia';

@Component({
  selector: 'app-evidencia-tabla',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './evidencia-tabla.component.html',
  styleUrl: './evidencia-tabla.component.css',
})
export class EvidenciaTablaComponent implements AfterViewInit {
  @Input() set data(value: ZonasIA[]) {
    if (value) {
      this.dataSource.data = value.map((e) => ({
        ...e,
        from: new Date(e.start),
        to: new Date(e.end),
      }));
    }
  }

  displayedColumns: string[] = ['alias', 'from', 'to', 'workers'];

  dataSource = new MatTableDataSource<ZonasIA>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'from':
          return new Date(item.start).getTime();
        case 'to':
          return new Date(item.end).getTime();
        default:
          return (item as any)[property];
      }
    };
  }
}
