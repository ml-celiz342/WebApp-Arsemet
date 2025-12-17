export interface Assets {
  id: number;
  code: string;
  observation: string;
  final: boolean;
  registration_date: Date;
  low_date: Date;
  type: string;
  id_type: number;
}

export interface NewAssets {
  code?: string;
  observation?: string;
  id_type?: number;
}

export interface TipoActivos {
  id: number;
  nombre: string;
}

// NUEVa ESTRUCTURA ASSET
export interface SubAsset {
  id_asset: number;
  code: string;
  assettype: string;
}

export interface AssetType {
  id_type: number;
  name: string;
}

export interface Asset {
  id_asset: number;
  code: string;
  observation: string;
  registration_date: string;
  update_date: string;
  id_user: number;
  low_date: string | null;
  end: boolean;
  assettype: AssetType;
  sub_asset: SubAsset[];
}
