import { SubAsset } from "./assets";

export interface FiltroAssets {
  id: number;
  code: string;
  type?: string;

  // sub activos
  subAssets?: {
    id: number;
    type: string;
  }[];
  
}
