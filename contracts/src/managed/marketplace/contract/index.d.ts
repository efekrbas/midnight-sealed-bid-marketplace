import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum AuctionState { OPEN = 0, CLOSED = 1, SETTLED = 2 }

export type Auction = { organizer: Uint8Array;
                        hiddenPrice: Uint8Array;
                        publicPrice: bigint;
                        maxBids: bigint;
                        bidCount: bigint;
                        highestBid: bigint;
                        state: AuctionState;
                        metadataUri: Uint8Array;
                        deadlineBlock: bigint
                      };

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  createAuction(context: __compactRuntime.CircuitContext<PS>,
                _auctionId_0: Uint8Array,
                metadataUri_0: Uint8Array,
                minPrice_0: bigint,
                maxBidCount_0: bigint,
                deadlineBlock_0: bigint,
                _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  bid(context: __compactRuntime.CircuitContext<PS>,
      _auctionId_0: Uint8Array,
      bidAmount_0: bigint,
      _address_0: { bytes: Uint8Array },
      _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               _auctionId_0: Uint8Array,
               _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealPrice(context: __compactRuntime.CircuitContext<PS>,
              _auctionId_0: Uint8Array,
              minPrice_0: bigint,
              _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  claimItem(context: __compactRuntime.CircuitContext<PS>,
            _auctionId_0: Uint8Array,
            _address_0: { bytes: Uint8Array },
            _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  claimProceeds(context: __compactRuntime.CircuitContext<PS>,
                _auctionId_0: Uint8Array,
                _address_0: { bytes: Uint8Array },
                _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  createAuction(context: __compactRuntime.CircuitContext<PS>,
                _auctionId_0: Uint8Array,
                metadataUri_0: Uint8Array,
                minPrice_0: bigint,
                maxBidCount_0: bigint,
                deadlineBlock_0: bigint,
                _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  bid(context: __compactRuntime.CircuitContext<PS>,
      _auctionId_0: Uint8Array,
      bidAmount_0: bigint,
      _address_0: { bytes: Uint8Array },
      _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               _auctionId_0: Uint8Array,
               _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealPrice(context: __compactRuntime.CircuitContext<PS>,
              _auctionId_0: Uint8Array,
              minPrice_0: bigint,
              _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  claimItem(context: __compactRuntime.CircuitContext<PS>,
            _auctionId_0: Uint8Array,
            _address_0: { bytes: Uint8Array },
            _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  claimProceeds(context: __compactRuntime.CircuitContext<PS>,
                _auctionId_0: Uint8Array,
                _address_0: { bytes: Uint8Array },
                _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  createAuction(context: __compactRuntime.CircuitContext<PS>,
                _auctionId_0: Uint8Array,
                metadataUri_0: Uint8Array,
                minPrice_0: bigint,
                maxBidCount_0: bigint,
                deadlineBlock_0: bigint,
                _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  bid(context: __compactRuntime.CircuitContext<PS>,
      _auctionId_0: Uint8Array,
      bidAmount_0: bigint,
      _address_0: { bytes: Uint8Array },
      _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  closeAuction(context: __compactRuntime.CircuitContext<PS>,
               _auctionId_0: Uint8Array,
               _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revealPrice(context: __compactRuntime.CircuitContext<PS>,
              _auctionId_0: Uint8Array,
              minPrice_0: bigint,
              _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  claimItem(context: __compactRuntime.CircuitContext<PS>,
            _auctionId_0: Uint8Array,
            _address_0: { bytes: Uint8Array },
            _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  claimProceeds(context: __compactRuntime.CircuitContext<PS>,
                _auctionId_0: Uint8Array,
                _address_0: { bytes: Uint8Array },
                _secret_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  auctions: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Auction;
    [Symbol.iterator](): Iterator<[Uint8Array, Auction]>
  };
  bids: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  winnerClaimed: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
