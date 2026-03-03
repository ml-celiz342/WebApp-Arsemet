/* --- RADIAL BAR, MANTENIMIENTO Y CONFIABILIDAD, TORTA */
/* --- RADIAL BAR --- */
export interface RadialBarValores {
  non_productive_energy: number;
  utilization_rate: number;
}

/* --- MANTENIMIENTO Y CONFIABILIDAD --- */
export interface MaintenanceValores {
  average_cycle_time: number;
  last_maintenance_time: number;
  specific_energy_use: number;
}

/* --- PIE CHART --- */
export interface EstadoTorta {
  state: string;
  value: number;
}

export interface DistribucionTareas {
  states: EstadoTorta[];
}

export interface KpiStats {
  radialbar: RadialBarValores;
  maintenance: MaintenanceValores;
  piechart: DistribucionTareas;
  from: Date;
  to: Date;
  id_asset: number;
}

/* --- BARRA APILADO --- */
export interface EnergyByShiftItem {
  start: Date;
  kwh: number;
  kvarh: number;
}

export interface TotalEnergyPerShift {
  id_asset: number;
  from: Date;
  to: Date;
  energy_by_shift: EnergyByShiftItem[];
}
