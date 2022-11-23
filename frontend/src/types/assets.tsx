export interface IApp{
  id: number;
  name: string;
}

export interface IChartData{
  label: string;
  data: Array<Number>;
  borderColor: string;
  backgroundColor: string;
}

export interface IAssetData{
  id: number;
  created_at: Date;
  asset_amount: number;
  diff: number;
  diff_rate: number;
  managed_app: number;
  memo: string|null;
}