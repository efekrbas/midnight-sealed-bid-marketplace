// Mock implementation of Midnight Contract API for frontend compilation
// In a real environment, this would be imported from the compiled compact outputs

export const marketplace = {
  contractName: 'marketplace',
};

class TxResult {
  async wait() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success' });
      }, 1500); // Simulate network inclusion delay
    });
  }
}

export class Contract {
  providers: unknown;
  circuit: unknown;
  
  constructor(providers: unknown, circuit: unknown) {
    this.providers = providers;
    this.circuit = circuit;
  }

  callTx = {
    bid: async (_auctionId: string, _bidAmount: number, _userAddress: string, _userSecret: string) => {
      await new Promise(r => setTimeout(r, 1500)); // Simulate prover delay
      return new TxResult();
    },
    revealPrice: async (_auctionId: string, _reservePrice: number, _organizerSecret: string) => {
      await new Promise(r => setTimeout(r, 2000));
      return new TxResult();
    },
    claimItem: async (_auctionId: string, _userAddress: string, _userSecret: string) => {
      await new Promise(r => setTimeout(r, 1500));
      return new TxResult();
    },
    claimProceeds: async (_auctionId: string, _organizerAddress: string, _organizerSecret: string) => {
      await new Promise(r => setTimeout(r, 1000));
      return new TxResult();
    }
  };
}
