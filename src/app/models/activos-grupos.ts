export interface ActivosGrupos {
  id_grupo_funcional: number;
  id_activo: number;
  codigo: string;
  id_sub_activo: number;
  sub_codigo: string;
  fecha_alta: Date;
  fecha_baja?: Date;
  id_usuario: number;
}
