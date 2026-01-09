export interface Descanso {
  id_break: number;
  idTurno: number;
  break_start: Date;
  break_end: Date;
  break_name: string;
}

export interface DescansoNew {
  idTurno: number;
  break_start: Date;
  break_end: Date;
  break_name: string;
}
