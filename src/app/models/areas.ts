export interface Areas {
  id: number;
  nombre: string;
  lat: number;
  lon: number;
  zoom: number;
  descripcion: string;
}

export interface AreasFiltro extends Areas {
  checked: boolean;
}
