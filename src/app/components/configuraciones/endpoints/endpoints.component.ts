import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmpresaServicio, Endpoints, Variables } from '../../../models/endpoints';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-endpoints',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatBadgeModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './endpoints.component.html',
  styleUrl: './endpoints.component.css',
})
export class EndpointsComponent {
  cargando = false;

  displayedColumnsEndpoints: string[] = [
    'nombre',
    'servicio',
    'compania',
    'urllogin',
    'urldata',
    'usuario',
    'contrasenea',
    'acciones',
  ];
  dataSourceEndpoints = new MatTableDataSource<Endpoints>([]);
  @ViewChild('paginatorEndpoints') paginatorEndpoints!: MatPaginator;

  displayedColumnsCompania: string[] = [
    'empresa',
    'servicio',
    'intervalo',
    'acciones',
  ];
  dataSourceCompania = new MatTableDataSource<EmpresaServicio>([]);
  @ViewChild('paginatorCompania') paginatorCompania!: MatPaginator;

  displayedColumnsVariable: string[] = [
    'nombre',
    'codigo',
    'gps',
    'operarios',
    'acciones',
  ];
  dataSourceVariables = new MatTableDataSource<Variables>([]);
  @ViewChild('paginatorVariable') paginatorVariable!: MatPaginator;

  private _snackBar = inject(MatSnackBar);

  constructor(private dialog: MatDialog, public authService: AuthService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSourceEndpoints.paginator = this.paginatorEndpoints;
    this.dataSourceCompania.paginator = this.paginatorCompania;
    this.dataSourceVariables.paginator = this.paginatorVariable;
  }

  ejecutarEndpoint(element: Endpoints) {}

  verVariables(element: Endpoints) {}

  agregarEditarEndpoint(element: Endpoints | null = null) {}

  eliminarEndpoint(element: Endpoints) {}

  agregarCompania() {}

  eliminarCompania(element: EmpresaServicio) {}

  agregarEditarVariables(element: Variables | null = null) {}

  eliminarVariable(element: Variables) {}

  async recargar() {
    this.cargando = true;
    //await
    this.cargando = false;
  }
}
