export interface Evidencia {
  code: string;
  total_consumption: number; // kWh
  total_reactive_consumption: number; // kVArh
  power: GenericoPowerHora[];
  detail_consumption: GenericoConsumoHora[];
}

export interface GenericoPowerHora {
  hour: string | Date;
  r: number;
  s: number;
  t: number;
}

export interface GenericoConsumoHora {
  hour: string | Date;
  value: number;
  reactive_value: number;
}
