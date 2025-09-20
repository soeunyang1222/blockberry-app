import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface PriceData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  last_updated: string;
}

export interface HistoricalPrice {
  timestamp: number;
  price: number;
}

@Injectable()
export class PriceService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = 'https://api.coingecko.com/api/v3';
    this.apiKey = this.configService.get<string>('COINGECKO_API_KEY');
  }

  /**
   * 현재 BTC 가격 조회
   */
  async getCurrentBTCPrice(): Promise<PriceData> {
    try {
      const url = `${this.baseUrl}/simple/price`;
      const params = {
        ids: 'bitcoin',
        vs_currencies: 'usd,krw',
        include_24hr_change: true,
        include_market_cap: true,
        include_24hr_vol: true,
        include_last_updated_at: true
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['x-cg-demo-api-key'] = this.apiKey;
      }

      const response = await firstValueFrom(
        this.httpService.get(url, { params, headers })
      );

      const btcData = response.data.bitcoin;
      
      return {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: btcData.usd,
        price_change_percentage_24h: btcData.usd_24h_change,
        market_cap: btcData.usd_market_cap,
        total_volume: btcData.usd_24h_vol,
        last_updated: new Date(btcData.last_updated_at * 1000).toISOString()
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get BTC price: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 특정 토큰 가격 조회
   */
  async getTokenPrice(tokenId: string, vsCurrency: string = 'usd'): Promise<PriceData> {
    try {
      const url = `${this.baseUrl}/simple/price`;
      const params = {
        ids: tokenId,
        vs_currencies: vsCurrency,
        include_24hr_change: true,
        include_market_cap: true,
        include_24hr_vol: true,
        include_last_updated_at: true
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['x-cg-demo-api-key'] = this.apiKey;
      }

      const response = await firstValueFrom(
        this.httpService.get(url, { params, headers })
      );

      const tokenData = response.data[tokenId];
      
      return {
        id: tokenId,
        symbol: tokenId,
        name: tokenId,
        current_price: tokenData[vsCurrency],
        price_change_percentage_24h: tokenData[`${vsCurrency}_24h_change`],
        market_cap: tokenData[`${vsCurrency}_market_cap`],
        total_volume: tokenData[`${vsCurrency}_24h_vol`],
        last_updated: new Date(tokenData.last_updated_at * 1000).toISOString()
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get token price: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * BTC 가격 히스토리 조회 (DCA 비교용)
   */
  async getBTCHistory(days: number = 30): Promise<HistoricalPrice[]> {
    try {
      const url = `${this.baseUrl}/coins/bitcoin/market_chart`;
      const params = {
        vs_currency: 'usd',
        days: days.toString(),
        interval: days <= 1 ? 'hourly' : 'daily'
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['x-cg-demo-api-key'] = this.apiKey;
      }

      const response = await firstValueFrom(
        this.httpService.get(url, { params, headers })
      );

      const prices = response.data.prices;
      
      return prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price
      }));
    } catch (error) {
      throw new HttpException(
        `Failed to get BTC history: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * DCA 시뮬레이션을 위한 가격 데이터
   */
  async getDCASimulationData(
    startDate: string,
    endDate: string,
    interval: 'daily' | 'weekly' = 'daily'
  ): Promise<HistoricalPrice[]> {
    try {
      const url = `${this.baseUrl}/coins/bitcoin/market_chart/range`;
      const params = {
        vs_currency: 'usd',
        from: Math.floor(new Date(startDate).getTime() / 1000),
        to: Math.floor(new Date(endDate).getTime() / 1000)
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['x-cg-demo-api-key'] = this.apiKey;
      }

      const response = await firstValueFrom(
        this.httpService.get(url, { params, headers })
      );

      const prices = response.data.prices;
      
      // 간격에 따라 데이터 필터링
      let filteredPrices = prices;
      if (interval === 'weekly') {
        filteredPrices = prices.filter((_: any, index: number) => index % 7 === 0);
      }
      
      return filteredPrices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price
      }));
    } catch (error) {
      throw new HttpException(
        `Failed to get DCA simulation data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * CEX 가격 비교 (업비트, 빗썸 등)
   */
  async getCEXComparison(): Promise<{
    coingecko: number;
    exchanges: {
      name: string;
      price: number;
      volume: number;
    }[];
  }> {
    try {
      // Coingecko 가격
      const btcPrice = await this.getCurrentBTCPrice();
      
      // 주요 거래소 가격 (실제로는 각 거래소 API 호출 필요)
      const exchanges = [
        {
          name: 'Upbit',
          price: btcPrice.current_price * 1.02, // 임시로 2% 프리미엄
          volume: 1000000
        },
        {
          name: 'Bithumb',
          price: btcPrice.current_price * 1.01, // 임시로 1% 프리미엄
          volume: 800000
        }
      ];

      return {
        coingecko: btcPrice.current_price,
        exchanges
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get CEX comparison: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * KRW/USD 환율 조회
   */
  async getExchangeRate(): Promise<number> {
    try {
      const url = `${this.baseUrl}/exchange_rates`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['x-cg-demo-api-key'] = this.apiKey;
      }

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );

      return response.data.rates.krw.value;
    } catch (error) {
      // 기본 환율 반환 (1 USD = 1300 KRW)
      return 1300;
    }
  }
}
