# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blockberry is a Sui blockchain-based Dollar Cost Averaging (DCA) platform built as a Next.js full-stack application. It enables users to automatically convert USDC to Wrapped BTC using the Cetus Aggregator to find the best swap prices across Sui DEXs.

## Essential Commands

```bash
# Development
pnpm dev                  # Run development server on http://localhost:3000

# Building & Production
pnpm build               # Build for production
pnpm start               # Start production server

# Code Quality
pnpm lint                # Run ESLint
pnpm type-check          # TypeScript type checking (tsc --noEmit)

# Database Operations
pnpm db:generate         # Create new TypeORM entity
pnpm db:migrate          # Run database migrations
pnpm db:revert           # Revert database migrations
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon Cloud) with TypeORM
- **Blockchain**: Sui Network integration via @mysten/sui
- **Styling**: Tailwind CSS with custom theme configuration
- **Validation**: Zod for schema validation, class-validator for DTOs

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (RESTful endpoints)
│   │   ├── users/         # User management
│   │   ├── savings-vault/ # Vault operations
│   │   ├── deposits/      # Deposit tracking
│   │   ├── trades/        # Trade history
│   │   ├── btc-price/     # Price fetching
│   │   ├── dca-simulation/# DCA simulation
│   │   └── execute-buy/   # Trade execution
│   ├── dashboard/         # Dashboard UI pages
│   └── api-docs/          # Swagger documentation
├── components/             # Reusable React components
│   ├── ui/                # Base UI components (Button, Card, etc.)
│   ├── layout/            # Layout components (Header, Footer)
│   ├── dashboard/         # Dashboard-specific components
│   ├── savings/           # Savings vault components
│   ├── trades/            # Trading components
│   └── wallet/            # Wallet-related components
├── lib/
│   ├── database/
│   │   ├── connection.ts  # Database connection singleton
│   │   └── entities/      # TypeORM entities
│   ├── services/          # Business logic services
│   ├── utils.ts           # Utility functions (cn helper, etc.)
│   └── swagger.ts         # API documentation config
```

### Key Architectural Patterns

1. **Database Connection Management**: Uses a singleton pattern in `src/lib/database/connection.ts` to manage TypeORM DataSource instances. Connection pooling is handled automatically with SSL for production.

2. **API Route Structure**: Each API route follows Next.js 13+ conventions:
   - `route.ts` files handle HTTP methods (GET, POST, PATCH, DELETE)
   - Routes return NextResponse with consistent error handling
   - All responses follow a standardized format with status codes and messages

3. **Entity Relationships**:
   - User → SavingsVault (one-to-many)
   - SavingsVault → Deposit (one-to-many)
   - SavingsVault → Trade (one-to-many)

4. **Service Layer**: Business logic is separated into services (`src/lib/services/`) that handle:
   - User management
   - Vault operations
   - Trade execution
   - DCA calculations

5. **Environment Configuration**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SUI_NETWORK`: Network selection (devnet/testnet/mainnet)
   - `NODE_ENV`: Environment mode (development/production)

### Tailwind Theme Configuration

The application uses a custom green and navy color scheme:
- **Primary**: Green (#4CAF50) for main actions
- **Secondary**: Navy (#2C3E50) for secondary elements
- **Background**: White with light green accents
- **Text**: Dark gray hierarchy

### API Response Format

All APIs follow this consistent structure:
```typescript
// Success
{
  success: true,
  data: any,
  message?: string
}

// Error
{
  success: false,
  error: string
}
```

### Development Workflow

1. **TypeORM Entities**: Define database schema in `src/lib/database/entities/`
2. **API Routes**: Implement endpoints in `src/app/api/[resource]/route.ts`
3. **Services**: Add business logic to `src/lib/services/`
4. **Type Safety**: Use TypeScript interfaces and Zod schemas for validation
5. **Database Sync**: In development, TypeORM auto-syncs schema changes

### Component Usage Guidelines

**🎯 MANDATORY: Always use components from `src/components/` when building UI pages**

#### Component Categories

1. **UI Components** (`src/components/ui/`):
   ```tsx
   // ✅ DO: Use existing UI components
   import { Button, Card, CardContent } from '@/components/ui';
   
   <Button variant="default" size="lg">Click me</Button>
   <Card>
     <CardContent>Content here</CardContent>
   </Card>
   
   // ❌ DON'T: Write inline HTML for common UI patterns
   <button className="px-4 py-2 bg-blue-600 text-white rounded">Click me</button>
   ```

2. **Feature Components** (`src/components/[feature]/`):
   ```tsx
   // ✅ DO: Use feature-specific components
   import { StatsCard } from '@/components/dashboard/StatsCard';
   import { VaultCard } from '@/components/savings/VaultCard';
   
   // ❌ DON'T: Repeat complex UI patterns
   ```

3. **Layout Components** (`src/components/layout/`):
   ```tsx
   // ✅ DO: Use layout components
   import { Header } from '@/components/layout/Header';
   ```

#### Import Pattern
```tsx
// ✅ Preferred: Import from index for UI components
import { Button, Card } from '@/components/ui';

// ✅ Acceptable: Direct import for feature components
import { StatsCard } from '@/components/dashboard/StatsCard';
```

#### Creating New Components
When building new UI, follow this hierarchy:
1. **Check if component exists** in `src/components/`
2. **Extend existing component** if similar functionality exists
3. **Create new component** in appropriate category:
   - `ui/` - Reusable design system components
   - `[feature]/` - Domain-specific components
   - `layout/` - Page structure components

#### Component Design Principles
- **Props over hardcoding**: Make components flexible with props
- **TypeScript interfaces**: Always define prop types
- **Tailwind classes**: Use utility classes with `cn()` helper
- **Accessibility**: Include proper ARIA attributes
- **Custom Theme**: Always use `tailwind.config.js` theme colors

#### Theme Usage Guidelines

**🎨 MANDATORY: Use only custom theme colors defined in `tailwind.config.js`**

```tsx
// ✅ DO: Use custom theme colors
className="bg-primary text-white hover:bg-primary/90"
className="border-border bg-background text-foreground"
className="text-foreground-muted"

// ❌ DON'T: Use arbitrary Tailwind colors
className="bg-blue-600 text-white hover:bg-blue-700"
className="border-gray-300 bg-white text-gray-700"
className="text-gray-500"
```

#### Available Theme Colors

**Primary Colors (Green Theme)**:
- `primary` - Main green (#4CAF50)
- `primary-hover` - Hover state (#45a049)
- `primary-light` - Light variant (#81C784)
- `primary-dark` - Dark variant (#388E3C)

**Secondary Colors (Navy Theme)**:
- `secondary` - Main navy (#2C3E50)
- `secondary-light` - Light variant (#34495E)
- `secondary-dark` - Dark variant (#1A252F)

**Background Colors**:
- `background` - Primary background (#FFFFFF)
- `background-secondary` - Secondary background (#F8F9FA)
- `background-muted` - Muted background (#E8F5E8)

**Text Colors**:
- `foreground` - Primary text (#2E3440)
- `foreground-secondary` - Secondary text (#5E6B73)
- `foreground-muted` - Muted text (#8B9196)

**Border Colors**:
- `border` - Default border (#E1E8ED)
- `border-light` - Light border (#F1F3F4)
- `border-dark` - Dark border (#D1D9E0)

#### Color Usage Examples

```tsx
// Button variants using theme colors
<Button variant="default">Primary Action</Button>     // bg-primary
<Button variant="secondary">Secondary Action</Button> // bg-secondary
<Button variant="outline">Outlined</Button>          // border-border

// Card with theme colors
<Card className="bg-background border-border text-foreground">
  <CardTitle className="text-foreground">Title</CardTitle>
  <CardContent className="text-foreground-secondary">Content</CardContent>
</Card>

// Feature cards with theme variants
<FeatureCard variant="primary" />   // Green accent
<FeatureCard variant="secondary" /> // Navy accent
<FeatureCard variant="default" />   // Neutral
<FeatureCard variant="muted" />     // Subtle
```

### Important Notes

- Database synchronization is automatic in development but disabled in production
- SSL is required for production database connections
- API routes use Next.js App Router conventions (no pages/api directory)
- All timestamps use ISO 8601 format
- The project recently migrated from NestJS to Next.js (2024-09-20)