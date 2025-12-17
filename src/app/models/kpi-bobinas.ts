import { DetalleKpiHoras } from "./kpi-horas";

export interface KpiBobinas {
  nombre: string;
  bobinas_cargadas: number;
  bobinas_acomodadas: number;
  bobinas_manipuladas: number;
  tiempo_total: number;
  tiempo_acomodo: number;
  tiempo_carga: number;
  distribucion_hora: DetalleKpiHoras[];
  bobinas_observacion: number;
  detalle_observacion: DetalleKpiHoras[];
  steps_ok: number[]
}
