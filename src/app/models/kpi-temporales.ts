/* --- GANT --- */
export interface ZonasTareasEstado {
  state: string;
  alias: string,
  from: Date;
  to: Date;
}

/* --- PIECES PER HOUR --- */
export interface PiecesPerHourPoint {
  hour: Date;
  value: number;
}

export interface PiecesPerHourSerie {
  id_asset: number;
  data: PiecesPerHourPoint[];
}
