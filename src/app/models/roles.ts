export interface Roles {
  idRol: number;
	nombre: string;
	token_duracion: number;
	token_cantidad: number;
}

export interface NewRol {
  nombre?: string;
  token_duracion?: number;
  token_cantidad?: number;
}

export interface RoleModule {
  idModulo: number;
  nombre: string; //Del modulo
  editar: boolean;
  escribir: boolean;
  leer: boolean;
}

export interface RolePanels {
  idPanel: number;
  nombre: string;
  ver: boolean;
}

export interface RoleModulePanels {
  module: RoleModule[];
  panels: RolePanels[];
}
