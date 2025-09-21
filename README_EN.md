# 🚀 SuiStack - Sui DCA Platform

**Enterprise-grade Next.js Full-stack Application** for Dollar Cost Averaging (DCA) on the Sui blockchain. Provides automated fixed-amount recurring purchases from USDC to BTC/SUI using DeepBook V3.

*[한국어 README](./README.md)*

## 🎯 Project Overview

SuiStack is a Non-custodial DCA platform leveraging Sui ecosystem's powerful DeepBook V3 protocol:

- **Sui Wallet Connection & User Management**
- **DCA Vault Creation** (purchase amount, frequency, target token settings)
- **Balance Manager-based Fund Management**
- **Automated Trading via TradeCap Delegation**
- **Real-time Transaction Tracking**
- **USDC → BTC/SUI Auto-buying**
- **Transparent Performance Analytics & Reporting**
- **Fully Automated Scheduled Execution**

## 🏗️ Tech Stack

### 🚀 Current Architecture (2024-09-21)

**Enterprise-grade** complete DCA ecosystem built with Next.js full-stack application:

```yaml
Frontend & Backend:
  - Next.js 14+ (App Router)
  - React 18 + TypeScript
  - Tailwind CSS + Radix UI
  - React Query (TanStack Query)

Database & ORM:
  - PostgreSQL (Neon Cloud)
  - TypeORM with Full Entity Relations

Blockchain Integration:
  - Sui Network (Devnet/Mainnet)
  - DeepBook V3 SDK
  - Sui dApp Kit & Wallet Standard

Development & Deployment:
  - TypeScript with Strict Mode
  - ESLint + Prettier
  - pnpm Package Manager
  - Bull Queue for Background Jobs
```

## 📁 Project Structure

```
suistack-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── dca/           # DCA-related APIs
│   │   │   │   ├── balance-manager/
│   │   │   │   ├── deposit/
│   │   │   │   ├── execute/
│   │   │   │   └── trade/
│   │   │   ├── users/         # User management
│   │   │   ├── savings-vault/ # Vault management
│   │   │   └── trades/        # Trading history
│   │   ├── dashboard/         # DCA dashboard
│   │   ├── dca/              # DCA settings page
│   │   ├── investment/       # Investment portfolio
│   │   └── api-docs/         # Swagger documentation
│   ├── components/           # React components
│   │   ├── dca/             # DCA-related UI
│   │   ├── investment/      # Investment-related UI
│   │   ├── dashboard/       # Dashboard UI
│   │   ├── wallet/          # Wallet connection UI
│   │   └── ui/              # Common UI components
│   ├── lib/                 # Libraries & utilities
│   │   ├── database/        # TypeORM setup & entities
│   │   ├── deepbook/        # DeepBook V3 integration
│   │   └── services/        # Business logic
│   ├── hooks/               # React Hooks
│   ├── providers/           # Context Providers
│   └── types/               # TypeScript type definitions
├── docs/                    # Project documentation
├── ref/                     # Reference implementations
└── Configuration files...
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Environment Setup

```bash
# Copy environment file
cp env.local.example .env.local

# Edit .env.local with your actual values
```

**Required Environment Variables:**
```bash
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
SUI_NETWORK="devnet"
NODE_ENV="development"
```

### 3. Run Application

```bash
# Development mode
pnpm dev

# Production build
pnpm build
pnpm start
```

## 🌐 Access URLs

Main interfaces of the SuiStack platform:

- **🏠 Homepage**: http://localhost:3000
- **📊 Dashboard**: http://localhost:3000/dashboard  
- **💰 DCA Settings**: http://localhost:3000/dca
- **📈 Investment Portfolio**: http://localhost:3000/investment
- **📚 API Documentation**: http://localhost:3000/api-docs (Swagger UI)

## 🔌 API Endpoints

### DCA Core API (`/api/dca`)
- `POST /api/dca/balance-manager` - Create Balance Manager
- `POST /api/dca/deposit` - USDC deposit & TradeCap delegation
- `POST /api/dca/trade` - Manual trade execution
- `POST /api/dca/execute` - DCA order execution (automated)

### User Management (`/api/users`)
- `POST /api/users` - Create user (wallet-based)
- `GET /api/users` - Get user list
- `GET /api/users/[id]` - Get user details
- `GET /api/users/wallet/[wallet_address]` - Find user by wallet

### Vault Management (`/api/savings-vault`)
- `POST /api/savings-vault` - Create DCA vault
- `GET /api/savings-vault` - Get user vaults
- `GET /api/savings-vault/[vault_id]` - Get vault details
- `PATCH /api/savings-vault/[vault_id]` - Update vault settings

### Trading History (`/api/trades`)  
- `GET /api/trades` - Get trading history
- `GET /api/trades/[trade_id]` - Get trade details
- `POST /api/trades` - Create trade record

## 📊 API Response Format

All APIs respond with consistent format:

```typescript
// Success response
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Success message"
}

// Error response
{
  "success": false,
  "error": "Error message",
  "details": { /* additional error info */ }
}
```

## 🗄️ Database Schema

### Core Entities
- **`users`** - User information (Sui wallet address-based)
- **`savings_vault`** - DCA settings & vault management
- **`trades`** - Trading history & performance tracking
- **`balance_managers`** - DeepBook Balance Manager management (planned)
- **`dca_orders`** - Automated DCA order management (planned)

### Entity Relationships
```mermaid
erDiagram
    users ||--o{ savings_vault : "owns"
    users ||--o{ trades : "executes"
    savings_vault ||--o{ trades : "generates"
    users ||--o{ balance_managers : "manages"
    balance_managers ||--o{ dca_orders : "executes"
    dca_orders ||--o{ trades : "creates"
```

### Key Fields
- **Users**: `wallet_address` (unique), `virtual_account_address`
- **SavingsVault**: purchase amount, frequency, target token, execution status
- **Trades**: volume, price, fees, blockchain hash

## 🛠️ Development Scripts

```bash
# Run development server
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Production build
pnpm build

# Production run
pnpm start
```

## 🔄 Project Evolution

### v2.0 → v3.0 (2024-09-21) - SuiStack Rebranding
- **Blockberry** → **SuiStack** service rebranding
- **DeepBook V3** protocol integration started
- **Balance Manager** architecture introduction
- Enterprise-grade feature enhancement

### v1.0 → v2.0 (2024-09-20)
- **NestJS** → **Next.js Full-stack** migration
- Integrated frontend/backend architecture
- React-based modern UI/UX

## 🚧 Current Development Status

### ✅ Completed Features (Production Ready)
- [x] **Framework**: Next.js 14 + App Router
- [x] **Database**: PostgreSQL + TypeORM
- [x] **User Management**: Wallet connection & account system
- [x] **DCA Settings**: Vault creation & management API
- [x] **UI Components**: Tailwind + Radix UI system
- [x] **Wallet Integration**: Sui Wallet Standard connection

### 🔄 Features in Development (In Progress)
- [ ] **DeepBook V3**: Balance Manager implementation
- [ ] **Automation**: DCA order execution system  
- [ ] **Trading Engine**: USDC → BTC/SUI swaps
- [ ] **Portfolio**: Performance tracking dashboard

### 📋 Backlog (Planned)
- [ ] **Real-time Data**: Price feed integration
- [ ] **Notification System**: Discord/Telegram bots
- [ ] **Advanced Analytics**: CEX vs DEX performance comparison
- [ ] **Mobile Optimization**: PWA support
- [ ] **Security Enhancement**: Multi-sig support

## 🤝 Contributing

SuiStack continues to evolve as a DCA solution in the Sui ecosystem:

### 💡 How to Contribute
- **Issue Reporting**: Bug reports or feature suggestions
- **Pull Requests**: Code improvements or new features
- **Documentation**: API docs or user guide improvements
- **Testing**: Test results sharing from various environments

### 🎯 Priority Areas
1. **DeepBook V3 Integration** - Balance Manager implementation
2. **Automation System** - Scheduler and execution engine
3. **UI/UX Improvements** - User experience optimization
4. **Performance Optimization** - High-volume processing & responsiveness

---

## 📄 License

MIT License - Open source project available for free use, modification, and distribution.

---

### 🚀 Build the Future of Sui Ecosystem with SuiStack!
