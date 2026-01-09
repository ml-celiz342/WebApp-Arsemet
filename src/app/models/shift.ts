export interface Shift {
  id_shift: number;
  name: string;
  start: Date;
  end: Date;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface ShiftBreak {
  id_break: number;
  break_name: string;
  break_start: Date;
  break_end: Date;
}

export interface ShiftDetail {
  id_shift: number;
  name: string;
  start: Date;
  end: Date;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;

  breaks: ShiftBreak[];
}

// Agregar
export interface ShiftNew {
  name: string;
  start: Date;
  end: Date;

  monday?: boolean | null;
  tuesday?: boolean | null;
  wednesday?: boolean | null;
  thursday?: boolean | null;
  friday?: boolean | null;
  saturday?: boolean | null;
  sunday?: boolean | null;
}

// Editar
export interface ShiftUpdate {
  name?: string | null;
  start?: Date | null;
  end?: Date | null;

  monday?: boolean | null;
  tuesday?: boolean | null;
  wednesday?: boolean | null;
  thursday?: boolean | null;
  friday?: boolean | null;
  saturday?: boolean | null;
  sunday?: boolean | null;
}
