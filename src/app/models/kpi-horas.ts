export interface KpiHoras {
  nombre: string;
  total_on: number;
  total_off: number;
  total_contacto: number;
  total_ralenti: number;
  detalle_total_on: DetalleKpiHoras[];
  detalle_total_sin_ralenti: DetalleKpiHoras[];
  detalle_total_contacto: DetalleKpiHoras[];
  detalle_total_ralenti: DetalleKpiHoras[];
}

export interface DetalleKpiHoras{
  hora: Date;
  total: number;
}

export interface GraficoPorHora{
  subtitulo: string;
  ejey: number[];
  ejex: string[]
}
