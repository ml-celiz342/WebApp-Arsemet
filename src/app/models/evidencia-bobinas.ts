export interface EvidenciaBobinas {
  nombre: string;
  data: EvidenciaBobinasData[];
}

export interface EvidenciaBobinasData {
  numero_serie?: string;
  tipo?: string;
  pasos?: number[];
  inicio?: Date;
  fin?: Date;
  duracion: string;
  operario: string;
  porcentaje?: number;
  inicio_id?: number;
  fin_id?: number;
  evidencias?: string[];
  resumen?: string;
}
