export interface Operarios {
  id: number;
  identificador: string;
  nombre: string;
  apellido: string;
  rfid: number;
  sector: string;
  id_sector: number;
  registration_date: Date;
  low_date: Date;
}

export interface NuevoOperario {
  identificador?: string;
  nombre?: string;
  apellido?: string;
  rfid?: number;
  idSector?: number;
}

export interface OperariosServicios{
  id: number;
  contrasenea: string;
  usuario: string;
  url_data: string;
  url_login: string;
  intervalo: number;
  fecha_actualizacion?: Date;
}

export interface NewOperariosServicios {
  contrasenea?: string;
  usuario?: string;
  url_data?: string;
  url_login?: string;
  intervalo?: number;
}

export interface OperarioEjecucion {
  id: number;
  temporal: Date;
  ejecucion: boolean;
  cambios: number;
}
