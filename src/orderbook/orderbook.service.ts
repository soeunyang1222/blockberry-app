import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

export interface OrderBookEntry {
  price: string;
  size: string;
  side: 'bid' | 'ask';
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: number;
  market: string;
}

export interface OrderBookTrade {
  price: string;
  size: string;
  side: 'buy' | 'sell';
  timestamp: number;
  txHash: string;
}

@Injectable()
export class OrderBookService {
  private readonly client: SuiClient;
  private readonly network: string;

  constructor(private readonly configService: ConfigService) {
    this.network = this.configService.get<string>('SUI_NETWORK', 'testnet');
    this.client = new SuiClient({ 
      url: getFullnodeUrl(this.network as any)
    });
  }

  /**
   * 오더북 조회 (Bid/Ask 주문서)
   */
  async getOrderBook(baseToken: string, quoteToken: string): Promise<OrderBook> {
    try {
      // Sui에서 오더북 데이터를 조회하는 로직
      // 실제로는 DEX 컨트랙트에서 오더북 데이터를 가져와야 함
      
      // 임시 데이터 (실제 구현에서는 DEX 컨트랙트 호출)
      const mockOrderBook: OrderBook = {
        bids: [
          { price: '45000', size: '0.5', side: 'bid' },
          { price: '44950', size: '1.2', side: 'bid' },
          { price: '44900', size: '0.8', side: 'bid' },
          { price: '44850', size: '2.1', side: 'bid' },
          { price: '44800', size: '1.5', side: 'bid' },
        ],
        asks: [
          { price: '45050', size: '0.7', side: 'ask' },
          { price: '45100', size: '1.0', side: 'ask' },
          { price: '45150', size: '0.9', side: 'ask' },
          { price: '45200', size: '1.3', side: 'ask' },
          { price: '45250', size: '0.6', side: 'ask' },
        ],
        timestamp: Date.now(),
        market: `${baseToken}/${quoteToken}`
      };

      return mockOrderBook;
    } catch (error) {
      throw new HttpException(
        `Failed to get order book: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 최적 가격 계산 (오더북 기반)
   */
  async calculateOptimalPrice(
    baseToken: string,
    quoteToken: string,
    amount: string,
    side: 'buy' | 'sell'
  ): Promise<{
    optimalPrice: string;
    totalCost: string;
    priceImpact: string;
    orderBook: OrderBook;
  }> {
    try {
      const orderBook = await this.getOrderBook(baseToken, quoteToken);
      const targetAmount = parseFloat(amount);
      
      let totalCost = 0;
      let remainingAmount = targetAmount;
      const orders = side === 'buy' ? orderBook.asks : orderBook.bids;
      
      // 오더북에서 최적 가격 계산
      for (const order of orders) {
        const orderSize = parseFloat(order.size);
        const orderPrice = parseFloat(order.price);
        
        if (remainingAmount <= 0) break;
        
        const fillAmount = Math.min(remainingAmount, orderSize);
        totalCost += fillAmount * orderPrice;
        remainingAmount -= fillAmount;
      }
      
      const averagePrice = totalCost / targetAmount;
      const bestPrice = side === 'buy' 
        ? parseFloat(orders[0]?.price || '0')
        : parseFloat(orders[0]?.price || '0');
      
      const priceImpact = ((averagePrice - bestPrice) / bestPrice * 100).toFixed(2);
      
      return {
        optimalPrice: averagePrice.toFixed(2),
        totalCost: totalCost.toFixed(2),
        priceImpact: priceImpact,
        orderBook
      };
    } catch (error) {
      throw new HttpException(
        `Failed to calculate optimal price: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 오더북 기반 스왑 실행
   */
  async executeOrderBookSwap(
    baseToken: string,
    quoteToken: string,
    amount: string,
    side: 'buy' | 'sell',
    userAddress: string,
    maxSlippage: number = 0.5
  ): Promise<{
    success: boolean;
    transactionBlock?: any;
    optimalPrice: string;
    totalCost: string;
    priceImpact: string;
    message: string;
  }> {
    try {
      // 최적 가격 계산
      const priceCalculation = await this.calculateOptimalPrice(
        baseToken,
        quoteToken,
        amount,
        side
      );
      
      // 슬리피지 체크
      const priceImpactNum = parseFloat(priceCalculation.priceImpact);
      if (priceImpactNum > maxSlippage) {
        throw new Error(`Price impact ${priceImpactNum}% exceeds maximum slippage ${maxSlippage}%`);
      }
      
      // 실제 스왑 트랜잭션 생성 (DEX 컨트랙트 호출)
      const transactionBlock = await this.createSwapTransaction(
        baseToken,
        quoteToken,
        amount,
        side,
        userAddress,
        priceCalculation.optimalPrice
      );
      
      return {
        success: true,
        transactionBlock,
        optimalPrice: priceCalculation.optimalPrice,
        totalCost: priceCalculation.totalCost,
        priceImpact: priceCalculation.priceImpact,
        message: 'Order book swap transaction created successfully'
      };
    } catch (error) {
      return {
        success: false,
        optimalPrice: '0',
        totalCost: '0',
        priceImpact: '0',
        message: `Order book swap failed: ${error.message}`
      };
    }
  }

  /**
   * 스왑 트랜잭션 생성
   */
  private async createSwapTransaction(
    baseToken: string,
    quoteToken: string,
    amount: string,
    side: 'buy' | 'sell',
    userAddress: string,
    optimalPrice: string
  ): Promise<any> {
    try {
      // 실제 DEX 컨트랙트 호출 로직
      // 여기서는 임시 트랜잭션 블록 반환
      
      const transactionBlock = {
        kind: 'programmableTransaction',
        inputs: [
          {
            type: 'object',
            objectType: 'sharedObject',
            objectId: baseToken,
            initialSharedVersion: '1'
          },
          {
            type: 'object',
            objectType: 'sharedObject',
            objectId: quoteToken,
            initialSharedVersion: '1'
          }
        ],
        transactions: [
          {
            MoveCall: {
              package: '0x2',
              module: 'coin',
              function: 'transfer',
              arguments: [0, 1, amount]
            }
          }
        ]
      };
      
      return transactionBlock;
    } catch (error) {
      throw new Error(`Failed to create swap transaction: ${error.message}`);
    }
  }

  /**
   * 오더북 거래 내역 조회
   */
  async getOrderBookTrades(
    baseToken: string,
    quoteToken: string,
    limit: number = 10
  ): Promise<OrderBookTrade[]> {
    try {
      // 실제로는 DEX 컨트랙트에서 거래 내역을 조회해야 함
      // 임시 데이터 반환
      const mockTrades: OrderBookTrade[] = [
        {
          price: '45000',
          size: '0.1',
          side: 'buy',
          timestamp: Date.now() - 1000,
          txHash: '0x1234567890abcdef...'
        },
        {
          price: '44950',
          size: '0.2',
          side: 'sell',
          timestamp: Date.now() - 2000,
          txHash: '0xabcdef1234567890...'
        },
        // ... 더 많은 거래 내역
      ];
      
      return mockTrades.slice(0, limit);
    } catch (error) {
      throw new HttpException(
        `Failed to get order book trades: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * DCA용 오더북 스왑
   */
  async executeDCASwap(
    userAddress: string,
    usdcAmount: string,
    maxSlippage: number = 0.5
  ): Promise<{
    success: boolean;
    transactionBlock?: any;
    optimalPrice: string;
    totalCost: string;
    priceImpact: string;
    message: string;
  }> {
    const baseToken = '0x5d4b302506645c3ff4b2c70d70cb120acec5fa6742f315893216b743d5e1b596::usdc::USDC';
    const quoteToken = '0x2::sui::SUI'; // 임시로 SUI 사용
    
    return this.executeOrderBookSwap(
      baseToken,
      quoteToken,
      usdcAmount,
      'buy',
      userAddress,
      maxSlippage
    );
  }
}
