import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Alarmas, AlarmLevel, AlarmSource, AlarmState } from '../../../models/alarmas';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AlarmasFiltroComponent } from './alarmas-filtro/alarmas-filtro.component';
import { lastValueFrom, range } from 'rxjs';
import { FiltroAssets } from '../../../models/filtro-assets';
import { DialogoConfirmarComponent } from '../../utilidades/dialogo-confirmar/dialogo-confirmar.component';
import { AssetsService } from '../../../services/assets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlarmasService } from '../../../services/alarmas.service';
import { UtilidadesService } from '../../../services/utilidades.service';
import { AuthService } from '../../../auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-alarmas',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTooltip,
  ],
  providers: [DatePipe],
  templateUrl: './alarmas.component.html',
  styleUrl: './alarmas.component.css',
})
export class AlarmasComponent implements OnDestroy {
  private _snackBar = inject(MatSnackBar);
  cargando = false;
  range = { start: new Date(), end: new Date() };

  niveles: string[] = [];
  estados: string[] = [];
  activos: number[] = [];
  origenes: string[] = [];

  nivelesList: AlarmLevel[] = [];
  estadosList: AlarmState[] = [];
  origenesList: AlarmSource[] = [];

  assetsFiltro: FiltroAssets[] = [];

  displayedColumnsAlarmas: string[] = [
    'id',
    'activo',
    'nivel',
    'nombre',
    'origen',
    'causa',
    'estado',
    'inicio',
    'fin',
    'acciones',
  ];
  dataSourceAlarmas = new MatTableDataSource<Alarmas>([]);
  @ViewChild('paginatorAlarmas') paginatorAlarmas!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  contadorInformacion: number = 0;
  contadorAdvertencia: number = 0;
  contadorCritico: number = 0;

  actualizar = true;

  private intervaloActualizar?: any;

  constructor(
    private dialogFiltro: MatDialog,
    private dialog: MatDialog,
    private assetsService: AssetsService,
    private alarmasService: AlarmasService,
    public utilidades: UtilidadesService,
    public authService: AuthService,
    private datePipe: DatePipe
  ) {}

  async ngAfterViewInit() {
    await Promise.all([
      this.loadDataAssets(),
      this.loadAlarmEstado(),
      this.loadAlarmNiveles(),
      this.loadAlarmOrigen(),
    ]);

    this.dataSourceAlarmas.paginator = this.paginatorAlarmas;
    this.dataSourceAlarmas.sort = this.sort;

    if(this.niveles.length !=0 && this.estadosList.length !=0 && this.origenesList.length !=0 && this.activos.length !=0 ){
      await this.iniciarActualizacionAutomatica();
    }
  }

  async loadDataAssets() {
    try {
      const response = await lastValueFrom(
        this.assetsService.getFiltroAssets(true)
      );
      if (response.length !== 0) {
        this.assetsFiltro = response;
        this.activos = this.assetsFiltro.map((item) => item.id);
      } else {
        this.assetsFiltro = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadAlarmNiveles() {
    try {
      const response = await lastValueFrom(
        this.alarmasService.getFiltroAlarmLevel()
      );
      if (response.length !== 0) {
        this.nivelesList = response;
        this.niveles = this.nivelesList.map((item) =>
          this.utilidades.capitalize(item.nombre)
        );
      } else {
        this.nivelesList = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadAlarmEstado() {
    try {
      const response = await lastValueFrom(
        this.alarmasService.getFiltroAlarmState()
      );
      if (response.length !== 0) {
        this.estadosList = response;
        this.estados = this.estadosList.map((item) =>
          this.utilidades.capitalize(item.nombre)
        );
      } else {
        this.estadosList = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadAlarmOrigen() {
    try {
      const response = await lastValueFrom(
        this.alarmasService.getFiltroAlarmSource()
      );
      if (response.length !== 0) {
        this.origenesList = response;
        this.origenes = this.origenesList.map((item) =>
          this.utilidades.capitalize(item.nombre)
        );
      } else {
        this.origenesList = [];
      }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  async loadAlarma() {
    const formattedStart =
      this.datePipe.transform(this.range.start, 'yyyy-MM-dd HH:mm:ss') ?? '';
    const formattedEnd =
      this.datePipe.transform(this.range.end, 'yyyy-MM-dd HH:mm:ss') ?? '';
    try {
      const response = await lastValueFrom( this.alarmasService
        .getAlarmByFiltro(
          formattedStart, // desde
          formattedEnd, // hasta
          this.activos,
          (this.estados || []).map((e) => e.toLowerCase()),
          (this.niveles || []).map((n) => n.toLowerCase()),
          (this.origenes || []).map((n) => n.toLowerCase())
        ))
        if (response.length !== 0) {
          this.recibirAlarmas(response);
        }else{
          this.dataSourceAlarmas.data = [];
          this.contadorCritico = 0;
          this.contadorAdvertencia = 0;
          this.contadorInformacion = 0;
        }
    } catch (err) {
      this._snackBar.open('Error al obtener los datos', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  recibirAlarmas(response: Alarmas[]) {
    this.dataSourceAlarmas.data = response;

    this.contadorCritico = 0;
    this.contadorAdvertencia = 0;
    this.contadorInformacion = 0;

    for (const alarma of response) {
      const nivel = alarma.nivel?.toLowerCase();
      if (nivel === 'crítica') {
        this.contadorCritico++;
      } else if (nivel === 'advertencia') {
        this.contadorAdvertencia++;
      } else if (nivel === 'información') {
        this.contadorInformacion++;
      }
    }
  }

  reconocerAlarma(item: Alarmas) {
    const dialogRef = this.dialog.open(DialogoConfirmarComponent, {
      width: '400px',
      data: { reconocer: true },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const response = await lastValueFrom(
            this.alarmasService.updateAlarmaReconocer(item.id)
          );
          if (response == 200) {
            this._snackBar.open('Alarma actualizada', 'Cerrar', {
              duration: 3000,
            });
            await this.recargar();
          } else {
            this._snackBar.open(
              'No fue posible reconocer la alarma',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
        } catch (err) {
          this._snackBar.open('Error al reconocer la alarma', 'Cerrar', {
            duration: 3000,
          });
        }
      }
    });
  }

  async recargar() {
    this.cargando = true;
    await this.loadAlarma();
    this.cargando = false;
  }

  async openDialog(): Promise<void> {
    const dialogRef = this.dialogFiltro.open(AlarmasFiltroComponent, {
      width: '400px',
      data: {
        start: this.range.start,
        end: this.range.end,
        activos: this.assetsFiltro
          .filter((item) => this.activos.includes(item.id))
          .map((item) => item.code),
        activosList: this.assetsFiltro.map((item) => item.code),
        nivelesList: this.nivelesList.map((item) =>
          this.utilidades.capitalize(item.nombre)
        ),
        estadosList: this.estadosList.map((item) =>
          this.utilidades.capitalize(item.nombre)
        ),
        origenesList: this.origenesList.map((item) =>
          this.utilidades.capitalize(item.nombre)
        ),
        niveles: this.niveles,
        estados: this.estados,
        origenes: this.origenes,
        automatico: this.actualizar,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        if (
          result.niveles.length == 0 ||
          result.estados.length == 0 ||
          result.activos.length == 0 ||
          result.origenes.length == 0
        ) {
          this._snackBar.open(
            'Debe seleccionar al menos un activo, estado, nivel y origen para aplicar los filtros.',
            'Cerrar',
            {
              duration: 3000,
            }
          );
          return;
        }

        this.actualizar = result.automatico;
        this.range = result.dateRange;
        this.activos = this.assetsFiltro
          .filter((item) => result.activos.includes(item.code))
          .map((item) => item.id);
        this.niveles = result.niveles;
        this.estados = result.estados;
        this.origenes = result.origenes;

        if (this.actualizar) {
          await this.iniciarActualizacionAutomatica();
        } else if (this.range.start && this.range.end) {
          // Limpiar intervalo previo si existía
          if (this.intervaloActualizar) {
            clearInterval(this.intervaloActualizar);
          }
          const endDate = new Date(this.range.end);
          endDate.setHours(23, 59, 59, 999);
          this.range.end = endDate;
          this.cargando = true;
          await this.loadAlarma();
          this.cargando = false;
        } else {
          this.dataSourceAlarmas.data = [];
          this.contadorCritico = 0;
          this.contadorAdvertencia = 0;
          this.contadorInformacion = 0;
          // Limpiar intervalo previo si existía
          if (this.intervaloActualizar) {
            clearInterval(this.intervaloActualizar);
          }
        }
      }
    });
  }

  async iniciarActualizacionAutomatica() {
    this.setRangoAHora();
    this.cargando = true;
    await this.loadAlarma();
    this.cargando = false;

    if (this.intervaloActualizar) {
      clearInterval(this.intervaloActualizar);
    }

    this.intervaloActualizar = setInterval(async () => {
      this.setRangoAHora();
      this.cargando = true;
      await this.loadAlarma();
      this.cargando = false;
    }, 60000);
  }

  setRangoAHora() {
    const ahora = new Date();
    const hace24h = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

    this.range.start = hace24h;
    this.range.end = ahora;
  }

  getIcono(nivel: string): string {
    switch (nivel) {
      case 'info':
        return 'información';
      case 'advertencia':
        return 'warning';
      case 'crítica':
        return 'error';
      default:
        return 'info';
    }
  }

  ngOnDestroy(): void {
    if (this.intervaloActualizar) {
      clearInterval(this.intervaloActualizar);
    }
  }
}
