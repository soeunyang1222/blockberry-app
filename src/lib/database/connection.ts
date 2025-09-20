import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { SavingsVault } from './entities/savings-vault.entity';
import { Trade } from './entities/trade.entity';

let dataSource: DataSource | undefined;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_USERNAME:', process.env.DB_USERNAME);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
  console.log('DB_DATABASE:', process.env.DB_DATABASE);
  console.log('NODE_ENV:', process.env.NODE_ENV);

  // DATABASE_URL이 없으면 개별 환경변수로 구성
  const databaseUrl = process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?sslmode=require&channel_binding=require`;

  console.log('Final database URL:', databaseUrl);

  dataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    entities: [User, SavingsVault, Trade],
    synchronize: false, // 자동 동기화 비활성화 (스키마 충돌 방지)
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
