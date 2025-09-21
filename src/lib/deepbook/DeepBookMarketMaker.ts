import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

export interface BalanceManagerConfig {
  address: string;
  tradeCap?: string;
}

export interface PoolConfig {
  [key: string]: string;
}

export class DeepBookMarketMaker {
  private keypair: Ed25519Keypair;
  private client: SuiClient;
  private balanceManagers: Record<string, BalanceManagerConfig>;
  private env: "testnet" | "mainnet";
  private deepbookPackageId: string;

  // Pool configurations
  private readonly pools: Record<"testnet" | "mainnet", PoolConfig> = {
    testnet: {
      DEEP_SUI: "0x...", // Replace with actual testnet pool addresses
      SUI_USDC: "0x...",
    },
    mainnet: {
      SUI_USDC: "0x...", // Replace with actual mainnet pool addresses
      WBTC_USDC: "0x...",
    },
  };

  // Asset type configurations
  private readonly assetTypes: Record<string, string> = {
    SUI: "0x2::sui::SUI",
    DBUSDC: "0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDC::DBUSDC", // Testnet
    USDC: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC", // Mainnet
    DEEP: "0xdeadbeef::deep::DEEP", // Replace with actual DEEP token address
    WBTC: "0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN", // Mainnet WBTC
  };

  constructor(
    privateKey: string,
    env: "testnet" | "mainnet",
    balanceManagers: Record<string, BalanceManagerConfig> = {}
  ) {
    this.keypair = Ed25519Keypair.fromSecretKey(privateKey);
    this.env = env;
    this.client = new SuiClient({ url: getFullnodeUrl(env) });

    // Initialize DeepBook package ID
    this.deepbookPackageId = process.env.DEEPBOOK_PACKAGE_ID ||
      (env === "testnet"
        ? "0x0a52124e19d24ac4b0d43f86f8ae7d58147e9a7e47f2a56a7f899b093e428bb3" // Testnet package
        : "0x000000000000000000000000000000000000000000000000000000000000002"); // Replace with mainnet package

    this.balanceManagers = balanceManagers;
  }

  /**
   * Get the active address of the wallet
   */
  getActiveAddress(): string {
    return this.keypair.getPublicKey().toSuiAddress();
  }

  /**
   * Create a new Balance Manager
   * Note: This is a simplified implementation. The actual DeepBook V3 SDK may have different methods.
   */
  async createBalanceManager(): Promise<string> {
    const tx = new Transaction();

    // Create balance manager using Move call
    // This is a placeholder implementation
    tx.moveCall({
      target: `${this.deepbookPackageId}::balance_manager::create_and_share`,
      arguments: [],
    });

    const result = await this.signAndExecute(tx);
    const createdObjectId = result.effects?.created?.[0]?.reference?.objectId;

    if (!createdObjectId) {
      throw new Error("Failed to create balance manager");
    }

    return createdObjectId;
  }

  /**
   * Create and share Balance Manager with specific owner
   * Note: Simplified implementation
   */
  createAndShareBalanceManagerWithOwner(owner: string) {
    return (tx: Transaction) => {
      tx.moveCall({
        target: `${this.deepbookPackageId}::balance_manager::create_and_share`,
        arguments: [tx.pure.address(owner)],
      });
    };
  }

  /**
   * Deposit funds into Balance Manager
   * Note: Simplified implementation
   */
  async depositToManager(
    managerId: string,
    coinType: string,
    amount: number
  ): Promise<void> {
    const tx = new Transaction();

    // Get coin type string
    const coinTypeString = this.assetTypes[coinType];
    if (!coinTypeString) {
      throw new Error(`Unknown coin type: ${coinType}`);
    }

    // Convert amount to proper units (considering decimals)
    const amountInUnits = this.convertToUnits(amount, coinType);

    // Split coin and deposit
    const coin = tx.splitCoins(tx.gas, [amountInUnits]);

    // Deposit to balance manager using Move call
    tx.moveCall({
      target: `${this.deepbookPackageId}::balance_manager::deposit`,
      arguments: [tx.object(managerId), coin],
      typeArguments: [coinTypeString],
    });

    await this.signAndExecute(tx);
  }


  /**
   * Check Balance Manager balance for specific asset
   * Note: Simplified implementation
   */
  async checkManagerBalance(
    managerKey: string,
    asset: string
  ): Promise<{ asset: string; balance: number }> {
    const manager = this.balanceManagers[managerKey];
    if (!manager) {
      throw new Error(`Balance manager ${managerKey} not found`);
    }

    const coinType = this.assetTypes[asset];
    if (!coinType) {
      throw new Error(`Unknown asset: ${asset}`);
    }

    // Query balance from chain
    const balance = await this.client.getBalance({
      owner: manager.address,
      coinType,
    });

    return {
      asset,
      balance: this.convertFromUnits(BigInt(balance.totalBalance), asset),
    };
  }

  /**
   * Get pool parameters (for checking minimum order sizes, etc.)
   * Note: Simplified implementation
   */
  async getPoolBookParams(poolKey: string): Promise<any> {
    const poolAddress = this.pools[this.env][poolKey];
    if (!poolAddress) {
      throw new Error(`Pool ${poolKey} not found for ${this.env}`);
    }

    console.log(`Getting pool parameters for ${poolKey} at ${poolAddress}`);

    return {
      poolKey,
      poolAddress,
      minOrderSize: 100000000, // Example: 0.1 SUI minimum
      tickSize: 1000,
      lotSize: 1000,
    };
  }

  /**
   * Place market order using platform's trade cap
   * Note: Simplified implementation
   */
  placeMarketOrder(
    tx: Transaction,
    poolKey: string,
    managerKey: string,
    amount: number
  ): void {
    const manager = this.balanceManagers[managerKey];
    if (!manager || !manager.tradeCap) {
      throw new Error(`Manager ${managerKey} does not have trade cap`);
    }

    const poolAddress = this.pools[this.env][poolKey];
    if (!poolAddress) {
      throw new Error(`Pool ${poolKey} not found`);
    }

    // Place market buy order using Move call
    tx.moveCall({
      target: `${this.deepbookPackageId}::deepbook::place_market_order`,
      arguments: [
        tx.object(poolAddress),
        tx.object(manager.address),
        tx.object(manager.tradeCap),
        tx.pure.u64(amount),
        tx.pure.u8(0), // self matching options
      ],
    });
  }

  /**
   * Execute market order (wrapper for placing and executing)
   */
  async executeMarketOrder(
    poolKey: string,
    managerKey: string,
    amount: number
  ): Promise<any> {
    const tx = new Transaction();
    this.placeMarketOrder(tx, poolKey, managerKey, amount);
    return await this.signAndExecute(tx);
  }

  /**
   * Sign and execute transaction
   */
  async signAndExecute(tx: Transaction): Promise<any> {
    tx.setSender(this.getActiveAddress());

    const result = await this.client.signAndExecuteTransaction({
      signer: this.keypair,
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    return result;
  }

  /**
   * Helper: Convert amount to chain units (considering decimals)
   */
  private convertToUnits(amount: number, coinType: string): number {
    const decimals = this.getDecimals(coinType);
    return Math.floor(amount * Math.pow(10, decimals));
  }

  /**
   * Helper: Convert from chain units to display amount
   */
  private convertFromUnits(units: bigint, coinType: string): number {
    const decimals = this.getDecimals(coinType);
    return Number(units) / Math.pow(10, decimals);
  }

  /**
   * Get decimals for coin type
   */
  private getDecimals(coinType: string): number {
    const decimalMap: Record<string, number> = {
      SUI: 9,
      USDC: 6,
      DBUSDC: 6,
      WBTC: 8,
      DEEP: 6,
    };

    return decimalMap[coinType] || 9;
  }

  /**
   * Get balance manager helper
   * Note: Returns simplified helper since we don't have the full SDK yet
   */
  get balanceManager() {
    return {
      createAndShareBalanceManagerWithOwner: this.createAndShareBalanceManagerWithOwner.bind(this),
      depositIntoManager: (managerKey: string, coinType: string, amount: number) => {
        return (tx: Transaction) => {
          const manager = this.balanceManagers[managerKey];
          if (!manager) {
            throw new Error(`Balance manager ${managerKey} not found`);
          }
          const coinTypeString = this.assetTypes[coinType];
          const amountInUnits = this.convertToUnits(amount, coinType);
          const coin = tx.splitCoins(tx.gas, [amountInUnits]);
          tx.moveCall({
            target: `${this.deepbookPackageId}::balance_manager::deposit`,
            arguments: [tx.object(manager.address), coin],
            typeArguments: [coinTypeString],
          });
        };
      }
    };
  }

  /**
   * Delegate trade cap helper
   */
  delegateTradeCap(tx: Transaction, managerKey: string): void {
    const manager = this.balanceManagers[managerKey];
    if (!manager) {
      throw new Error(`Balance manager ${managerKey} not found`);
    }

    const [tradeCap] = tx.moveCall({
      target: `${this.deepbookPackageId}::balance_manager::mint_trade_cap`,
      arguments: [tx.object(manager.address)],
    });

    // Transfer to platform address
    if (process.env.PLATFORM_ADDRESS) {
      tx.transferObjects([tradeCap], process.env.PLATFORM_ADDRESS);
    }
  }
}