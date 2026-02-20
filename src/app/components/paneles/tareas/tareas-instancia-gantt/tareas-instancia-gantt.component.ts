import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KpiGraficoGanttComponent } from '../../kpi/kpi-grafico-gantt/kpi-grafico-gantt.component';
import { ZonasTareasEstado } from '../../../../models/kpi-temporales';
import { KpiTemporalesService } from '../../../../services/kpi-temporales.service';
import { TareasGraficoGanttComponent } from "../tareas-grafico-gantt/tareas-grafico-gantt.component";

@Component({
  selector: 'app-tareas-instancia-gantt',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    KpiGraficoGanttComponent,
    TareasGraficoGanttComponent
],
  providers: [DatePipe],
  templateUrl: './tareas-instancia-gantt.component.html',
})
export class TareasInstanciaGanttComponent implements OnInit {
  estadosGantt: ZonasTareasEstado[] = [];
  cargando = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private kpiTemporalesService: KpiTemporalesService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
  ) {}

  async ngOnInit() {
    await this.loadDataGantt();
  }

  private async loadDataGantt(): Promise<void> {
    const formattedStart =
      this.datePipe.transform(this.data.cicleStart, 'yyyy-MM-dd HH:mm:ss') ??
      '';

    const formattedEnd =
      this.datePipe.transform(this.data.cicleEnd, 'yyyy-MM-dd HH:mm:ss') ?? '';

    try {
      this.estadosGantt = await firstValueFrom(
        this.kpiTemporalesService.getKpiTasksStates(
          this.data.idAsset,
          formattedStart,
          formattedEnd,
        ),
      );
    } catch (err) {
      console.error(err);
      this.snackBar.open('Error cargando gantt', 'Cerrar', {
        duration: 3000,
      });
    } finally {
      this.cargando = false;
    }
  }
}
