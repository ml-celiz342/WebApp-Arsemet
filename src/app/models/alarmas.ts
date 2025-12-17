export interface Alarmas {
  id: number;
  activo: string;
  nivel: string;
  estado: string;
  origen: string;
  nombre: string;
  alias: string;
  causa: string;
  latitud: number;
  longitud: number;
  inicio: Date;
  fin?: Date;
  id_usuario_reconocida?: number;
  nombre_usuario_reconocida?: string;
  apellido_usuario_reconocida?: string;
  reconocida?: Date;
}

export interface AlarmState {
  id: number;
  nombre: string
}

export interface AlarmLevel {
  id: number;
  nombre: string;
  accion: string;
}

export interface UpdateAlarmLevel {
  accion: string;
}


export interface AlarmSource {
  id: number;
  nombre: string;
}

export interface NewAlarmSource {
  nombre?: string;
}


export interface AlarmaList {
  id: number;
  nombre: string;
  alias: string;
  estado: boolean;
  id_origen: number;
  origen: string;
  id_nivel_alarma: number;
  nivel: string;
}


export interface NewAlarmaList {
  nombre: string;
  alias: string;
  estado: boolean;
  id_origen: number;
  id_nivel_alarma: number;
}
