export interface TareaOperario {
  id_task: number;
  quantity: number;
  detail: string;
  start: Date; // date
  end?: Date | null;
  load_date: Date;
  update_date?: Date | null;
  id_asset: number;
  id_part: number;
  id_user: number;

  // Datos del activo
  asset_code: string;
  asset_observation: string;

  // Datos de la pieza
  part_code: string;
  part_name: string;

  // Datos del usuario
  user_email: string;
  user_name: string;
  user_lastname: string;
}

export interface NewTareaOperario {
  quantity: number;
  detail?: string;
  start: Date;
  end?: Date | null;
  id_asset: number;
  id_part: number;
  id_user: number;
}

export interface TareaOperarioUpdate {
  quantity?: number;
  detail?: string;
  start?: Date;
  end?: Date | null;
  id_asset?: number;
  id_part?: number;
  id_user?: number;
}


