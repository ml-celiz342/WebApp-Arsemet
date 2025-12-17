export interface Usuarios {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  rol_id: number;
  renovar_contrasenea: boolean;
  sesiones?: number;
  fecha_alta: Date;
  fecha_baja: Date;
  fecha_actualizacion: Date;
}

export interface NuevoUsuario {
  nombre?: string;
  apellido?: string;
  email?: string;
  contrasenea?: string;
  rol_id?: number;
}
