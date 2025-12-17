export interface Endpoints {
  id: number;
  nombre: string;
  servicio: string;
  id_servicio: number;
  compania: string;
  id_compania: number;
  urllogin: string;
  urldata: string;
  usuario: string;
  contrasenea: string;
}

export interface EmpresaServicio {
  id: number;
  empresa: string;
  servicio: string;
  intervalo: number;
}

export interface Variables {
  id: number;
  codigo: string;
  geolocalizacion: boolean;
  operarios: boolean;
}
