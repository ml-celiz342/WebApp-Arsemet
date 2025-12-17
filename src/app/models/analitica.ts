export interface Analitica {
  id: number;
  nombre: string;
  comentario: string;
  ruta: string;
  pausa: boolean;
  fecha_alta: Date;
  fecha_baja: Date;
}

export interface NewAnalitica {
  nombre?: string;
  comentario?: string;
  ruta?: string;
  pausa?: boolean;
}

export interface AnaliticaObservacion {
  id: number;
  id_analitica: number;
  nombre_analitica: string;
  numero_serie: string;
  desde: Date;
  hasta: Date;
  observacion: string;
  fecha: Date;
}

