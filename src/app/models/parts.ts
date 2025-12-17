export interface Parts {
  id_part: number;
  code: string;
  name: string;
  observation: string;
  plan: string | null; // base64 o null
}

export interface NewPart {
  code: string;
  name: string;
  observation: string;
  plan?: File | null; // archivo seleccionado
}

export interface PartUpdate {
  code?: string;
  name?: string;
  observation?: string;
  plan?: File | null;
}
