import axios from "axios";
import MarketItem from "../model/market/MarketResponse";
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from "axios-extensions";

export default class Market {
  private marketUri = 'https://api.warframe.market/v1/items/';
  private delay = 350;
  private http = axios.create({
    baseURL: this.marketUri,
    headers: { 'cache-control': 'no-cache' },
    adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter), { threshold: this.delay })
  })

  constructor() {
  }

  public static componentMarketName(itemName: string, componentName: string) {
    const name = `${itemName} ${componentName}`;
    return name.toLowerCase().replace(/ /g, '_');
  }

  /**
   * Query an item prices statistics from warframe.market api
   * @param itemName name in format: "Item Name Component"
   */
  public async queryPrices(itemName: string): Promise<MarketItem> {
    const res = await this.http.get<MarketItem>(`${this.marketUri}${itemName}/statistics`);
    return res.data;
  }
}