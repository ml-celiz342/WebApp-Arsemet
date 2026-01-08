export interface Tarea {
  id: number

  // Relaciones
  id_asset: number;
  id_data_csv: number;

  // Ciclo
  cycle_start_est?: Date | null;
  cycle_end?: Date | null;
  cycle_duration?: number | null;

  // Lote
  batch_weight?: number | null;

  // Piezas
  planned_qty?: number | null;
  good_qty?: number | null;
  bad_qty?: number | null;
  part_length?: number | null;
  part_width?: number | null;
  part_weight?: number | null;
  user_qty?: number | null;

  // Material
  material_thickness?: number | null;
  material_description?: string | null;

  // Artículo
  article_code: string;

  // Usuarios
  system_user?: string | null;

  // Plegado
  people_count?: number | null;
  hits_count?: number | null;
  tool_change_count?: number | null;
}

