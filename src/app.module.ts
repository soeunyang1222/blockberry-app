import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { SavingsVaultModule } from './savings-vault/savings-vault.module';
import { DepositsModule } from './deposits/deposits.module';
import { TradesModule } from './trades/trades.module';
import { ApiModule } from './api/api.module';
import { SuiModule } from './sui/sui.module';
import { CetusModule } from './cetus/cetus.module';
import { PriceModule } from './price/price.module';
import { OrderBookModule } from './orderbook/orderbook.module';
import { SuiRPCModule } from './sui-rpc/sui-rpc.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'ep-quiet-breeze-a18y720j-pooler.ap-southeast-1.aws.neon.tech'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'neondb_owner'),
        password: configService.get('DB_PASSWORD', 'npg_fFetlZ8HJLY1'),
        database: configService.get('DB_DATABASE', 'neondb'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // 임시로 비활성화
        logging: configService.get('NODE_ENV') === 'development',
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    SavingsVaultModule,
    DepositsModule,
    TradesModule,
    ApiModule,
    SuiModule,
    CetusModule,
    PriceModule,
    OrderBookModule,
    SuiRPCModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
