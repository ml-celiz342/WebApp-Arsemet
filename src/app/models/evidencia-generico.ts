export interface EvidenciaGenerico {
  code: string;
  generic: GenericoHora[];
}

export interface GenericoHora {
  hour: string | Date;
  r: number;
  s: number;
  t: number;
}
