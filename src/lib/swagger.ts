import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Blockberry API',
        version: '1.0.0',
        description: 'Sui DCA Platform API Documentation',
      },
      servers: [
        {
          url: process.env.NODE_ENV === 'production' 
            ? 'https://your-domain.com' 
            : 'http://localhost:3000',
          description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
        },
      ],
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: '사용자 ID',
                example: 1,
              },
              wallet_address: {
                type: 'string',
                description: '지갑 주소',
                example: '0x1234567890abcdef1234567890abcdef12345678',
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                description: '생성일시',
                example: '2024-01-01T00:00:00.000Z',
              },
              virtual_account_address: {
                type: 'string',
                description: '가상 계좌 주소',
                example: 'VA1234567890',
              },
            },
          },
          SavingsVault: {
            type: 'object',
            properties: {
              vault_id: {
                type: 'integer',
                description: '저금고 ID',
                example: 1,
              },
              user_id: {
                type: 'integer',
                description: '사용자 ID',
                example: 1,
              },
              vault_name: {
                type: 'string',
                description: '저금고 이름',
                example: 'My Bitcoin Savings',
              },
              target_token: {
                type: 'string',
                description: '대상 토큰',
                example: 'BTC',
              },
              amount_fiat: {
                type: 'number',
                description: '법정화폐 금액',
                example: 1000.00,
              },
              fiat_symbol: {
                type: 'string',
                description: '법정화폐 심볼',
                example: 'USDC',
              },
              active: {
                type: 'boolean',
                description: '활성 상태',
                example: true,
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                description: '생성일시',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
          Trade: {
            type: 'object',
            properties: {
              trade_id: {
                type: 'integer',
                description: '거래 ID',
                example: 1,
              },
              vault_id: {
                type: 'integer',
                description: '저금고 ID',
                example: 1,
              },
              user_id: {
                type: 'integer',
                description: '사용자 ID',
                example: 1,
              },
              fiat_amount: {
                type: 'number',
                description: '법정화폐 금액',
                example: 1000.00,
              },
              fiat_symbol: {
                type: 'string',
                description: '법정화폐 심볼',
                example: 'USDC',
              },
              token_symbol: {
                type: 'string',
                description: '토큰 심볼',
                example: 'BTC',
              },
              token_amount: {
                type: 'number',
                description: '토큰 금액',
                example: 0.001,
              },
              price_executed: {
                type: 'number',
                description: '실행 가격',
                example: 100000.00,
              },
              tx_hash: {
                type: 'string',
                description: '트랜잭션 해시',
                example: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                description: '생성일시',
                example: '2024-01-01T00:00:00.000Z',
              },
              cycle_index: {
                type: 'integer',
                description: '거래 주기 인덱스',
                example: 1,
              },
            },
          },
          ApiResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                description: '성공 여부',
                example: true,
              },
              data: {
                type: 'object',
                description: '응답 데이터',
              },
              message: {
                type: 'string',
                description: '응답 메시지',
                example: 'Success',
              },
            },
          },
          ErrorResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                description: '성공 여부',
                example: false,
              },
              error: {
                type: 'string',
                description: '오류 메시지',
                example: 'Error message',
              },
              details: {
                type: 'object',
                description: '오류 세부 정보',
              },
            },
          },
        },
      },
      tags: [
        {
          name: 'Users',
          description: '사용자 관리 API',
        },
        {
          name: 'SavingsVault',
          description: '저금고 관리 API',
        },
        {
          name: 'Trades',
          description: '거래 관리 API',
        },
      ],
    },
  });

  return spec;
};
