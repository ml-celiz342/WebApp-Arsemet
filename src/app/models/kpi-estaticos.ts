/* --- PIE CHART --- */
export interface EstadoTorta {
  state: string;
  value: number;
}

export interface DistribucionTareas {
  states: EstadoTorta[];
  from: Date;
  to: Date;
  id_asset: number;
}

/* --- RADIAL BAR, MANTENIMIENTO Y CONFIABILIDAD */
export interface RadialBarValores {
  non_productive_energy: number;
  utilization_rate: number;
}

export interface KpiStats {
  radialbar: RadialBarValores;
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
