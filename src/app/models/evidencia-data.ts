export interface EvidenciaData {
  id: number;
  num_serie: string;
  estado?: string;
  inicio?: Date;
  fin?: Date;
  duracion?: string;
  bobina?: string;
  evidencia?: string;
  operario?: string;
  velocidad?: number;
  inclinacion?: number;
  cinturon?: boolean;
  frenoEmergencia?: boolean;
  frenoPedal?: boolean;
  paradaEmergencia?: boolean;
}
