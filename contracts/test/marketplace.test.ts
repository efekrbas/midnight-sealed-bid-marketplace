import { describe, test, expect, beforeAll } from '@jest/globals';
import { Contract } from '../src/managed/marketplace/contract/index.js';
import { ContractState, CircuitContext } from '@midnight-ntwrk/compact-runtime';

describe('Marketplace Compact Smart Contract', () => {
  let contract: Contract<any>;
  let context: CircuitContext<any>;
  
  beforeAll(() => {
    contract = new Contract({});
    context = {
      originalState: new ContractState(new Uint8Array(), []),
      transactionContext: {
        isLocalTx: true
      },
      currentQueryContext: { query: () => [] }
    } as any;
  });

  test.skip('should allow creating an auction with a hidden reserve price', () => {
    const auctionId = new Uint8Array(32);
    const metadataUri = new Uint8Array(32);
    const minPrice = 500n;
    const maxBidCount = 5n;
    const deadlineBlock = 100n;
    const secret = new Uint8Array(32);
    
    // Call the circuit
    const result = contract.circuits.createAuction(context, auctionId, metadataUri, minPrice, maxBidCount, deadlineBlock, secret);
    
    // Assert no errors thrown and return value is empty []
    expect(result.result).toEqual([]);
    
    // If it didn't throw an assertion error, the state transition was valid
    expect(result.state).toBeDefined();
  });

  test.skip('should accept a valid bid that is greater than the public highest bid', () => {
    // Setup auction state first (normally handled by chain)
    const auctionId = new Uint8Array(32);
    const bidAmount = 200n;
    const address = { bytes: new Uint8Array(32) };
    const secret = new Uint8Array(32);
    
    // First, we need to create the auction in our local state context
    const createResult = contract.circuits.createAuction(context, auctionId, new Uint8Array(32), 100n, 5n, 100n, new Uint8Array(32));
    
    // Create new context with updated state
    const bidContext = {
      originalState: createResult.state,
      transactionContext: { isLocalTx: true },
      currentQueryContext: { query: () => [] }
    } as any;
    
    // Place bid
    const bidResult = contract.circuits.bid(bidContext, auctionId, bidAmount, address, secret);
    
    expect(bidResult.result).toEqual([]);
  });

  test.skip('should reject an invalid bid on non-existent auction', () => {
    const auctionId = new Uint8Array(32); // Empty ID that hasn't been created
    // Modify one byte to make it different
    auctionId[0] = 1;
    
    const bidAmount = 250n; 
    const address = { bytes: new Uint8Array(32) };
    const secret = new Uint8Array(32);
    
    // Should throw assertion "Auction does not exist"
    expect(() => {
      contract.circuits.bid(context, auctionId, bidAmount, address, secret);
    }).toThrow();
  });

  test.skip('should reject closing an auction from non-organizer', () => {
    const auctionId = new Uint8Array(32);
    const secret = new Uint8Array(32);
    secret[0] = 1; // Different secret than organizer
    
    const createResult = contract.circuits.createAuction(context, auctionId, new Uint8Array(32), 100n, 5n, 100n, new Uint8Array(32));
    
    const closeContext = {
      originalState: createResult.state,
      transactionContext: { isLocalTx: true },
      currentQueryContext: { query: () => [] }
    } as any;
    
    // Should throw assertion "Only organizer can close"
    expect(() => {
      contract.circuits.closeAuction(closeContext, auctionId, secret);
    }).toThrow();
  });
});
