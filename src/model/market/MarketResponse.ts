export default interface MarketItem {
  payload: MarketPayload;
}

interface MarketPayload {
  statistics_closed: Statistics;
  statistics_live: Statistics;
}

interface Statistics {
  '48hours': StatSlice[];
  '90days': StatSlice[];
}

interface StatSlice {
  avg_price: number;
  date_time: Date;
  id: string;
  max_price: number;
  median: number;
  min_price: number;
  wa_price: number;
  closed_price?: number;
  donch_bot?: number;
  donch_top?: number;
  moving_avg?: number;
  open_price?: number;
  order_type?: OrderType;
  volume?: number;
}

enum OrderType {
  Buy = "buy",
  Sell = "sell",
}
