import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AccountResponseDto } from './dto/account-response.dto';

@Injectable()
export class BlockberryService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get<string>('BLOCKBERRY_API_BASE_URL');
    this.apiKey = this.configService.get<string>('BLOCKBERRY_API_KEY');
  }

  async getAccountByHash(address: string): Promise<AccountResponseDto> {
    try {
      const url = `${this.baseUrl}/accounts/${address}`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // API 키가 설정되어 있다면 헤더에 추가
      if (this.apiKey && this.apiKey !== 'your_api_key_here') {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await firstValueFrom(
        this.httpService.get(url, { headers })
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `Blockberry API Error: ${error.response.data?.message || error.response.statusText}`,
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      
      throw new HttpException(
        'Failed to fetch account data from Blockberry API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
