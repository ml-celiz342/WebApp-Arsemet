import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { KpiComponent } from './components/paneles/kpi/kpi.component';
import { SesionesComponent } from './components/paneles/sesiones/sesiones.component';
import { ActivosComponent } from './components/configuraciones/activos/activos.component';
import { DispositivosComponent } from './components/configuraciones/dispositivos/dispositivos.component';
import { AnaliticasComponent } from './components/configuraciones/analiticas/analiticas.component';
import { RolesComponent } from './components/usuarios/roles/roles.component';
import { UsuariosComponent } from './components/usuarios/usuarios/usuarios.component';
import { HomeComponent } from './components/home/home.component';
import { ProduccionComponent } from './components/paneles/produccion/produccion.component';
import { CalarmasComponent } from './components/configuraciones/calarmas/calarmas.component';
import { OperariosComponent } from './components/configuraciones/operarios/operarios.component';
import { EndpointsComponent } from './components/configuraciones/endpoints/endpoints.component';
import { EvidenciaComponent } from './components/paneles/evidencia/evidencia.component';
import { MantenimientoComponent } from './components/paneles/mantenimiento/mantenimiento.component';
import { AlarmasComponent } from './components/paneles/alarmas/alarmas.component';
import { TareasComponent } from './components/paneles/tareas/tareas.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard],
      },
      {
        path: 'alarmas',
        component: AlarmasComponent,
        canActivate: [authGuard],
      },
      {
        path: 'produccion',
        component: ProduccionComponent,
        canActivate: [authGuard],
      },
      {
        path: 'kpi',
        component: KpiComponent,
        canActivate: [authGuard],
      },
      {
        path: 'sesiones',
        component: SesionesComponent,
        canActivate: [authGuard],
      },
      {
        path: 'activos',
        component: ActivosComponent,
        canActivate: [authGuard],
      },
      {
        path: 'dispositivos',
        component: DispositivosComponent,
        canActivate: [authGuard],
      },
      {
        path: 'analiticas',
        component: AnaliticasComponent,
        canActivate: [authGuard],
      },
      {
        path: 'operarios',
        component: OperariosComponent,
        canActivate: [authGuard],
      },
      {
        path: 'endpoints',
        component: EndpointsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'calarmas',
        component: CalarmasComponent,
        canActivate: [authGuard],
      },
      {
        path: 'roles',
        component: RolesComponent,
        canActivate: [authGuard],
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [authGuard],
      },
      {
        path: 'tareas',
        component: TareasComponent,
        canActivate: [authGuard],
      },
      {
        path: 'mantenimiento',
        component: MantenimientoComponent,
        canActivate: [authGuard],
      },
      {
        path: 'evidencias',
        component: EvidenciaComponent,
        canActivate: [authGuard],
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: './login' }, // Ruta comodín al final
];
