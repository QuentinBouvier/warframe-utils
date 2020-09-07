import axios, { AxiosAdapter, AxiosPromise, AxiosRequestConfig } from "axios";
// @ts-ignore
import buildURL from 'axios/lib/helpers/buildURL';
import MarketItem from "../model/market/MarketResponse";

export default class Market {
  private marketUri = 'https://api.warframe.market/v1/items/';
  private delay = 350;
  private cachedRequests: {[key: string]: CachedRequest} = { };
  private throttleFactor = 0
  private http = axios.create({
    baseURL: this.marketUri,
    headers: { 'cache-control': 'no-cache' },
    adapter: this.marketAxiosAdapter(axios.defaults.adapter),
  })

  constructor() {
  }

  private marketAxiosAdapter(adapter: AxiosAdapter): AxiosAdapter {
    // const throttler = (config: AxiosRequestConfig): AxiosPromise => {
    //
    // };
    return (config: AxiosRequestConfig) => {
      const { url, params, paramsSerializer } = config;
      const index = Market.buildUrlIndex(url, params, paramsSerializer);

      // caching
      if (!this.isCached(url)) {
        const cachingRequest = (async () => {
          try {
            return await adapter(config);
          } catch (err) {
            if (this.cachedRequests[index]) delete this.cachedRequests[index];
            throw err;
          }
        })();
        Object.assign(this.cachedRequests, { [index]: { request: cachingRequest, dateTime: Date.now() } });
        return cachingRequest;
      }

      return this.cachedRequests[index].request;
    }
  }

  private isCached(url: string): boolean {
    return this.cachedRequests.hasOwnProperty(url);
  }

  /**
   * Query an item prices statistics from warframe.market api
   * @param itemName name in format: "Item Name Component"
   */
  public async queryPrices(itemName: string): Promise<MarketItem> {
    const res = await this.http.get<MarketItem>(`${this.marketUri}${itemName}/statistics`);
    return res.data;
  }

  // -----------------------------------------------
  // region          Static methods
  // -----------------------------------------------

  public static componentMarketName(itemName: string, componentName: string) {
    const name = `${itemName} ${componentName}`;
    return name.toLowerCase().replace(/ /g, '_');
  }

  private static buildUrlIndex(...args: any[]) {
    const builtURL = buildURL(...args);
    const [urlPath, queryString] = builtURL.split('?');
    if (queryString) {
      const paramsPair = queryString.split('&');
      return `${urlPath}?${paramsPair.sort().join('&')}`;
    }
    return builtURL;
  }

  // endregion
}

interface CachedRequest {
  request: AxiosPromise;
  dateTime: Date;
}