import { Injectable } from '@angular/core';
import { MenuSection } from '../models/menu';
import { AuthService } from '../auth.service';
import { CHART_COLORS } from '../constants/chart-colors.constants';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menuSections: MenuSection[] = [
    {
      title: 'Paneles',
      icon: 'monitor_heart',
      items: [
        {
          label: 'Producción',
          route: '/produccion',
          description: 'Mapa y estado de los activos.',
          icon: 'explore',
          iconColor: CHART_COLORS.TEXT_DARK,
          permissions: [{ module: 'data', action: 'read' }], // 'read' es válido
          panelPermission: 'paneles-produccion',
        },
        {
          label: 'Tareas',
          route: '/tareas',
          description: 'Registro de tareas de operarios.',
          icon: 'assignment',
          iconColor: CHART_COLORS.BASE,
          permissions: [{ module: 'data', action: 'read' }],
          panelPermission: 'paneles-tareas',
        },
        {
          label: 'Mantenimiento',
          route: '/mantenimiento',
          description: 'Registro de mantenimientos realizados.',
          icon: 'build',
          iconColor: CHART_COLORS.WARNING,
          permissions: [{ module: 'maintenance', action: 'read' }],
          panelPermission: 'paneles-mantenimiento',
        },
        {
          label: 'KPI',
          route: '/kpi',
          description:
            'Resumen visual de los indicadores claves de rendimiento (KPI).',
          icon: 'analytics',
          iconColor: CHART_COLORS.DARK_2,
          permissions: [{ module: 'data', action: 'read' }], // 'read' es válido
          panelPermission: 'paneles-kpi',
        },
        {
          label: 'Evidencias',
          route: '/evidencias',
          description: 'Informacion capturada que sustenta los KPI.',
          icon: 'folder_open',
          iconColor: CHART_COLORS.SUCCESS,
          permissions: [{ module: 'data', action: 'read' }], // 'read' es válido
          panelPermission: 'paneles-evidencias',
        },
        {
          label: 'Alarmas',
          route: '/alarmas',
          description: 'Central de alarmas.',
          icon: 'notifications',
          iconColor: CHART_COLORS.ERROR,
          permissions: [{ module: 'alarms', action: 'read' }],
          panelPermission: 'paneles-alarmas',
        },
        {
          label: 'Sesiones',
          route: '/sesiones',
          description: 'Datos de conexión de usuarios y dispositivos.',
          icon: 'share',
          iconColor: CHART_COLORS.COMPLEMENTARY,
          permissions: [
            { module: 'devices', action: 'read' }, // 'read' es válido
            { module: 'sessions', action: 'read' }, // 'read' es válido
          ],
          panelPermission: 'paneles-sesiones',
        },
      ],
    },
    {
      title: 'Configuraciones',
      icon: 'settings',
      items: [
        {
          label: 'Activos',
          route: '/activos',
          description: 'Gestión de activos y asociación con dispositivos.',
          icon: 'local_shipping',
          iconColor: '#2196f3',
          permissions: [{ module: 'assets', action: 'read' }], // 'read' es válido
          panelPermission: 'configuraciones-activos',
        },
        {
          label: 'Dispositivos',
          route: '/dispositivos',
          description: 'Administración de dispositivos y sus analíticas.',
          icon: 'sim_card',
          iconColor: '#9c27b0',
          permissions: [
            { module: 'devices', action: 'read' }, // 'read' es válido
            { module: 'models', action: 'read' },
            { module: 'servicecodes', action: 'read' },
          ],
          panelPermission: 'configuraciones-dispositivos',
        },
        {
          label: 'Analíticas',
          route: '/analiticas',
          description: 'Gestión de analíticas activas y logs.',
          icon: 'analytics',
          iconColor: '#f44336',
          permissions: [{ module: 'analytics', action: 'read' }], // 'read' es válido
          panelPermission: 'configuraciones-analiticas',
        },
        {
          label: 'Operarios',
          route: '/operarios',
          description: 'Gestión de operarios.',
          icon: 'engineering',
          iconColor: '#4caf50',
          permissions: [
            { module: 'workers', action: 'read' },
            { module: 'sectors', action: 'read' },
          ], // 'read' es válido
          panelPermission: 'configuraciones-operarios',
        },
        {
          label: 'Endpoints',
          route: '/endpoints',
          description: 'Gestión de APIs externas.',
          icon: 'api',
          iconColor: '#b36f2cff',
          permissions: [
            { module: 'endpoints', action: 'read' },
            { module: 'variables', action: 'read' },
            { module: 'servicecodes', action: 'read' },
          ], // 'read' es válido
          panelPermission: 'configuraciones-endpoints',
        },
        {
          label: 'Alarmas',
          route: '/calarmas',
          description: 'Gestión de alarmas.',
          icon: 'notifications',
          iconColor: '#f44336',
          permissions: [{ module: 'alarms', action: 'read' }], // 'read' es válido
          panelPermission: 'configuraciones-alarmas',
        },
        {
          label: 'Turnos',
          route: '/turnos',
          description: 'Administración de turnos y sus activos.',
          icon: 'schedule',
          iconColor: '#1976d2',
          permissions: [
            { module: 'assets', action: 'read' }, // permisos a dar: asset shift
            { module: 'shifts', action: 'read' },
          ],
          panelPermission: 'configuraciones-turnos', // configuraciones-turnos
        },
      ],
    },
    {
      title: 'Utilidades',
      icon: 'build',
      items: [
        {
          label: 'Terminal',
          route: '/',
          description: 'Comunicación directa con dispositivos.',
          icon: 'terminal',
          iconColor: '#ff5722',
          permissions: [{ module: 'utilities', action: 'read' }], // 'read' es válido
          panelPermission: 'utilidades-terminal',
        },
        {
          label: 'Actualización',
          route: '/',
          description: 'Gestión de actualizaciones de firmware.',
          icon: 'upgrade',
          iconColor: '#673ab7',
          permissions: [{ module: 'utilities', action: 'write' }], // 'write' es válido
          panelPermission: 'utilidades-actualizacion',
        },
        {
          label: 'Registros',
          route: '/',
          description: 'Historial de configuraciones de dispositivos.',
          icon: 'table',
          iconColor: '#795548',
          permissions: [{ module: 'utilities', action: 'read' }], // 'read' es válido
          panelPermission: 'utilidades-registros',
        },
      ],
    },
    {
      title: 'Usuarios',
      icon: 'person',
      items: [
        {
          label: 'Roles',
          route: '/roles',
          description: 'Gestión de roles y permisos de usuarios.',
          icon: 'groups',
          iconColor: '#3f51b5',
          permissions: [
            { module: 'roles', action: 'read' }, // 'read' es válido
            { module: 'modules', action: 'read' },
            { module: 'panels', action: 'read' },
          ],
          panelPermission: 'usuarios-roles',
        },
        {
          label: 'Usuarios',
          route: '/usuarios',
          description: 'Administración de cuentas de usuarios.',
          icon: 'manage_accounts',
          iconColor: '#4caf50',
          permissions: [
            { module: 'users', action: 'read' }, // 'read' es válido
            { module: 'sessions', action: 'read' },
          ],
          panelPermission: 'usuarios-usuarios',
        },
      ],
    },
  ];

  constructor(private authService: AuthService) {}

  getFilteredMenuSections(): MenuSection[] {
    return this.menuSections
      .map((section) => ({
        title: section.title,
        icon: section.icon,
        items: section.items.filter((item) => {
          // Verificar permiso de panel
          if (item.panelPermission && item.panelPermission !== '') {
            if (!this.authService.hasPanels(item.panelPermission)) {
              return false;
            }
          }

          // Verificar permisos de módulos
          if (
            item.permissions &&
            !item.permissions.every((permission) =>
              this.authService.hasPermission(
                permission.module,
                permission.action
              )
            )
          ) {
            return false;
          }

          // Si pasó todos los filtros, se mantiene
          return true;
        }),
      }))
      .filter((section) => section.items.length > 0);
  }

  canActivate(routePath: string): boolean {
    // Busca en el menú las secciones y permisos correspondientes
    for (const section of this.menuSections) {
      for (const item of section.items) {
        if (item.route.replace('/', '') === routePath) {
          // Verificar permiso de panel (si aplica)
          if (item.panelPermission && item.panelPermission !== '') {
            if (!this.authService.hasPanels(item.panelPermission)) {
              return false;
            }
          }

          // Verificar permisos de módulo
          if (
            item.permissions &&
            !item.permissions.every((permission) =>
              this.authService.hasPermission(
                permission.module,
                permission.action
              )
            )
          ) {
            return false;
          }

          //Si pasa todos los controles → permitir acceso
          return true;
        }
      }
    }

    // Si no encontró coincidencia o no cumple permisos
    return false;
  }
}
