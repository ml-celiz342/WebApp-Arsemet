/* Detalle POWER*/
export interface Detalle {
  state: string;
  turned_on: number;
  current_power: number;
  total_consumption: number;
}

/* Detalle BALANZA */
export interface DetalleBalanza {
  state: string;
  current_weight: number;
  total_weigh: number;
}

