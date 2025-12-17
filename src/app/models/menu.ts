export type ActionType = 'read' | 'write' | 'edit';

export interface Permission {
  module: string;
  action: ActionType;
}

export interface MenuItem {
  label: string;
  route: string;
  description: string;
  icon: string;
  iconColor: string;
  permissions: Permission[];
  panelPermission: string;
}

export interface MenuSection {
  title: string;
  icon: string;
  items: MenuItem[];
}
