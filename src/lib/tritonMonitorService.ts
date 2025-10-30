import { Connection, PublicKey, ParsedAccountData } from '@solana/web3.js';

export class TritonMonitorService {
  private connection: Connection;
  private pollingInterval: number;

  constructor(connection: Connection, pollingIntervalMs: number = 10000) {
    this.connection = connection;
    this.pollingInterval = pollingIntervalMs;
  }

  /**
   * Monitor wallet for idle USDC
   * @param walletAddress Wallet to monitor
   * @param callback Callback when idle USDC detected
   */
  async monitorIdleUSDC(
    walletAddress: PublicKey,
    callback: (amount: number) => void
  ): Promise<() => void> {
    const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Mainnet USDC
    let lastBalance = 0;
    let lastChangeTime = Date.now();

    const checkBalance = async () => {
      try {
        const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
          walletAddress,
          { mint: new PublicKey(USDC_MINT) }
        );

        if (tokenAccounts.value.length > 0) {
          const accountData = tokenAccounts.value[0].account.data as ParsedAccountData;
          const balance = accountData.parsed.info.tokenAmount.uiAmount;

          if (balance !== lastBalance) {
            lastBalance = balance;
            lastChangeTime = Date.now();
          } else if (balance > 0) {
            const hoursSinceChange = (Date.now() - lastChangeTime) / (1000 * 60 * 60);
            
            // If balance hasn't changed in 24 hours, consider it idle
            if (hoursSinceChange >= 24) {
              callback(balance);
            }
          }
        }
      } catch (error) {
        console.error('Error monitoring USDC:', error);
      }
    };

    // Initial check
    await checkBalance();

    // Set up polling
    const interval = setInterval(checkBalance, this.pollingInterval);

    // Return cleanup function
    return () => clearInterval(interval);
  }

  /**
   * Monitor for new deposits
   * @param walletAddress Wallet to monitor
   * @param callback Callback when deposit detected
   */
  async monitorDeposits(
    walletAddress: PublicKey,
    callback: (amount: number, mint: string) => void
  ): Promise<() => void> {
    let lastSignature: string | null = null;

    const checkTransactions = async () => {
      try {
        const signatures = await this.connection.getSignaturesForAddress(
          walletAddress,
          { limit: 10 }
        );

        if (signatures.length > 0 && signatures[0].signature !== lastSignature) {
          lastSignature = signatures[0].signature;

          // Parse the transaction to detect deposits
          const tx = await this.connection.getParsedTransaction(
            signatures[0].signature,
            { maxSupportedTransactionVersion: 0 }
          );

          if (tx && tx.meta && tx.meta.postBalances[0] > tx.meta.preBalances[0]) {
            const amount = (tx.meta.postBalances[0] - tx.meta.preBalances[0]) / 1e9;
            callback(amount, 'SOL');
          }
        }
      } catch (error) {
        console.error('Error monitoring deposits:', error);
      }
    };

    // Initial check
    await checkTransactions();

    // Set up polling
    const interval = setInterval(checkTransactions, this.pollingInterval);

    // Return cleanup function
    return () => clearInterval(interval);
  }

  /**
   * Get transaction history
   * @param walletAddress Wallet address
   * @param limit Number of transactions to fetch
   */
  async getTransactionHistory(
    walletAddress: PublicKey,
    limit: number = 100
  ) {
    try {
      const signatures = await this.connection.getSignaturesForAddress(
        walletAddress,
        { limit }
      );

      const transactions = await Promise.all(
        signatures.map(sig =>
          this.connection.getParsedTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0
          })
        )
      );

      return transactions.filter(tx => tx !== null);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }
}