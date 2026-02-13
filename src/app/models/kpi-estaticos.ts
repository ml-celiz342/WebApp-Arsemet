/* --- PIE CHART --- */
export interface EstadoTorta {
  estado: string;
  valor: number;
}

export interface DistribucionTareas {
  estados: EstadoTorta[];
  from: Date;
  to: Date;
  id_activo: number;
}

/* --- LINEAL BAR, +, + --- */
export interface LinealBarValores {
  energia_no_productiva: number;
  tasa_de_utilizacion: number;
}

export interface KpiStats {
  linealbar: LinealBarValores;
  from: Date;
  to: Date;
  id_activo: number;
}
