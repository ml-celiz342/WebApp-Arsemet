export interface Maintenance {
  id_maintenance: number;
  reason: string;
  observation: string;
  start: Date; // date
  end?: Date | null;
  update_date?: Date | null;
  id_asset: number;
  id_user: number;

  // Datos del activo
  asset_code: string;
}

export interface NewMaintenance {
  id_asset?: number;
  reason?: string;
  observation?: string;
  start?: Date | null;
  end?: Date | null;
}
