import { describe, test, expect, beforeAll } from '@jest/globals';
import { Contract } from '../src/managed/marketplace/contract/index.js';
import { createCircuitContext, createConstructorContext, dummyContractAddress } from '@midnight-ntwrk/compact-runtime';

describe('Marketplace Compact Smart Contract', () => {
  let contract: Contract<any>;
  let initialContext: any;
  
  beforeAll(() => {
    contract = new Contract({});
    const contractAddress = dummyContractAddress();
    const coinPublicKey = new Uint8Array(32);
    coinPublicKey[0] = 2;
    
    // Create initial state
    const constructorContext = createConstructorContext({}, coinPublicKey);
    const initialState = contract.initialState(constructorContext).currentContractState;
    
    // Create execution context based on initial state
    initialContext = createCircuitContext(contractAddress, coinPublicKey, initialState, {});
  });

  test('should allow creating an auction with a hidden reserve price', () => {
    const auctionId = new Uint8Array(32);
    auctionId[0] = 99; // some unique id
    const metadataUri = new Uint8Array(32);
    const minPrice = 500n;
    const maxBidCount = 5n;
    const deadlineBlock = 100n;
    const secret = new Uint8Array(32);
    
    // Executes circuit locally against the initial state (empty map)
    const result = contract.circuits.createAuction(
      initialContext, 
      auctionId, 
      metadataUri, 
      minPrice, 
      maxBidCount, 
      deadlineBlock, 
      secret
    );
    
    expect(result.result).toEqual([]);
    expect(result.proofData).toBeDefined();
  });

  test('should reject an invalid bid on non-existent auction', () => {
    const auctionId = new Uint8Array(32); 
    const bidAmount = 250n; 
    const address = { bytes: new Uint8Array(32) };
    const secret = new Uint8Array(32);
    
    // Should throw assertion because the auction map is empty in initial state
    expect(() => {
      contract.circuits.bid(initialContext, auctionId, bidAmount, address, secret);
    }).toThrow();
  });

  test('should reject closing a non-existent auction', () => {
    const auctionId = new Uint8Array(32);
    const secret = new Uint8Array(32);
    
    // Should throw assertion because the auction map is empty
    expect(() => {
      contract.circuits.closeAuction(initialContext, auctionId, secret);
    }).toThrow();
  });
});

