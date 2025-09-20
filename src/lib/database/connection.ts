import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { SavingsVault } from './entities/savings-vault.entity';
import { Deposit } from './entities/deposit.entity';
import { Trade } from './entities/trade.entity';

let dataSource: DataSource | undefined;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    entities: [User, SavingsVault, Deposit, Trade],
    synchronize: process.env.NODE_ENV === 'development', // 개발 환경에서만 자동 동기화
    logging: process.env.NODE_ENV === 'development',
    cache: {
      duration: 30000, // 30초 캐시
    },
  });

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  return dataSource;
}

export async function closeDataSource(): Promise<void> {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
    dataSource = undefined;
  }
}
