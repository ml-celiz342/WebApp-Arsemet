/* --- GANT --- */
export interface ZonasTareasEstado {
  state: string;
  from: Date;
  to: Date;
}

/* --- PIECES PER HOUR --- */
export interface PiecesPerHourPoint {
  fecha: Date;
  valor: number;
}

export interface PiecesPerHourSerie {
  id_activo: number;
  data: PiecesPerHourPoint[];
}
