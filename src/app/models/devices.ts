export interface Devices {
  id: number;
  numero_serie: string;
  registration_date: Date;
  low_date?: Date;
  type_model: string;
  id_model: number;
  code_service: string;
  id_code_service: number;
  manifiesto_arq: any; //Guardamos objetos json
  manifiesto_conf: any;
}

export interface NewDevice {
  numero_serie?: string;
  id_model?: number;
  id_code_service?: number;
  manifiesto_arq?: any; //Obligatorio
}

export interface ModeloDispositivo {
  id: number;
  nombre: string;
  template: any;
}

export interface NewModeloDispositivo {
  nombre?: string;
  template?: any;
}
