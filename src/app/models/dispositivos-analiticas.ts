export interface DispositivosAnaliticas {
  id: number,
  id_dispositivo: number,
  numero_serie: string,
  id_analitica: number,
  nombre_analitca: number,
  registration: Date,
  low_date?: Date;
}

export interface NewDispositivosAnaliticas {
  id_analitica: number;
}
