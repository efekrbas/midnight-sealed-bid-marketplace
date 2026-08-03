/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { type Contract as MarketplaceContract, contractReferenceLocations, pureCircuits, Circuits } from '../../../contracts/src/managed/marketplace/contract';
import type { WalletConnectedAPI as DAppConnectorAPI } from '@midnight-ntwrk/dapp-connector-api';
import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

// Stub for DAppConnectorWalletProvider since the package is unavailable in this npm registry
export class DAppConnectorWalletProvider {
  constructor(dappConnector: DAppConnectorAPI) {}
}

export const marketplace = {
  contractName: 'marketplace',
  circuitVersion: '0.23',
};

// Replace static indexer urls with Preprod ones if needed
export const INDEXER_URL = 'https://indexer.preprod.midnight.network/api/v1/graphql';
export const NODE_URL = 'https://rpc.preprod.midnight.network';
export const ZK_CONFIG_URL = 'https://indexer.preprod.midnight.network/api/v1/graphql';

export class Contract {
  providers: any;
  midnightContract: any;
  contractAddress: string;

  private constructor(providers: any, midnightContract: any, address: string) {
    this.providers = providers;
    this.midnightContract = midnightContract;
    this.contractAddress = address;
  }

  static async buildProviders(dappConnector: DAppConnectorAPI) {
    const walletProvider = new DAppConnectorWalletProvider(dappConnector);
    const publicDataProvider = indexerPublicDataProvider(INDEXER_URL, INDEXER_URL.replace('http', 'ws'));
    const zkConfigProvider = new FetchZkConfigProvider(ZK_CONFIG_URL, fetch);

    return {
      privateStateProvider: walletProvider,
      walletProvider,
      publicDataProvider,
      zkConfigProvider,
    };
  }

  static async deployContract(dappConnector: DAppConnectorAPI): Promise<{ contractAddress: string; deploymentTx: any }> {
    console.log("Compiling Midnight Marketplace Contract...");
    console.log("Connecting to Midnight Preprod Indexer...");
    
    const providers = await Contract.buildProviders(dappConnector);

    // Assuming we have some initial state configuration for the constructor
    const initialState = {}; // Placeholder for the actual initial state
    
    const deployed = await deployContract(
      providers as any,
      {
        privateStateId: "marketplacePrivateState",
        initialPrivateState: initialState,
        compiledContract: { contractReferenceLocations, pureCircuits } as any
      } as any
    );
    
    console.log(`✅ Deployment Successful! Contract Address: ${deployed.deployTxData.public.contractAddress}`);
    
    return {
      contractAddress: deployed.deployTxData.public.contractAddress,
      deploymentTx: deployed.deployTxData,
    };
  }

  static async connect(dappConnector: DAppConnectorAPI, address: string): Promise<Contract> {
    const providers = await Contract.buildProviders(dappConnector);
    const midnightContract = await findDeployedContract(
      providers as any,
      {
        contractAddress: address,
        compiledContract: { contractReferenceLocations, pureCircuits } as any
      } as any
    );
    return new Contract(providers, midnightContract, address);
  }

  get callTx() {
    return {
      createAuction: async (_auctionId: Uint8Array, _metadataUri: Uint8Array, _minPrice: bigint, _maxBids: bigint, _deadline: bigint, _secret: Uint8Array) => {
        const tx = await this.midnightContract.callTx.createAuction(_auctionId, _metadataUri, _minPrice, _maxBids, _deadline, _secret);
        return tx;
      },
      bid: async (_auctionId: Uint8Array, _bidAmount: bigint, _userAddress: { bytes: Uint8Array }, _userSecret: Uint8Array) => {
        const tx = await this.midnightContract.callTx.bid(_auctionId, _bidAmount, _userAddress, _userSecret);
        return tx;
      },
      submit_bid: async (_auctionId: Uint8Array, _bidAmount: bigint, _userAddress: { bytes: Uint8Array }, _userSecret: Uint8Array) => {
        const tx = await this.midnightContract.callTx.bid(_auctionId, _bidAmount, _userAddress, _userSecret);
        return tx;
      },
      closeAuction: async (_auctionId: Uint8Array, _secret: Uint8Array) => {
        const tx = await this.midnightContract.callTx.closeAuction(_auctionId, _secret);
        return tx;
      },
      revealPrice: async (_auctionId: Uint8Array, _reservePrice: bigint, _organizerSecret: Uint8Array) => {
        const tx = await this.midnightContract.callTx.revealPrice(_auctionId, _reservePrice, _organizerSecret);
        return tx;
      },
      reveal: async (_auctionId: Uint8Array, _reservePrice: bigint, _organizerSecret: Uint8Array) => {
        const tx = await this.midnightContract.callTx.revealPrice(_auctionId, _reservePrice, _organizerSecret);
        return tx;
      },
      claimItem: async (_auctionId: Uint8Array, _userAddress: { bytes: Uint8Array }, _userSecret: Uint8Array) => {
        const tx = await this.midnightContract.callTx.claimItem(_auctionId, _userAddress, _userSecret);
        return tx;
      },
      claimProceeds: async (_auctionId: Uint8Array, _organizerAddress: { bytes: Uint8Array }, _organizerSecret: Uint8Array) => {
        const tx = await this.midnightContract.callTx.claimProceeds(_auctionId, _organizerAddress, _organizerSecret);
        return tx;
      }
    };
  }
}
