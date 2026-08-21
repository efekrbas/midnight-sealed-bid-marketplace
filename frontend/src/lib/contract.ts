/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { createUnprovenDeployTx, submitCallTxAsync, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { getCompiledContract, getLedger, sampleSigningKey, ContractState } from '../../../contracts/src/index';
import type { ConnectedSession } from './midnight';
import { fromHex, pollForState } from './midnight';

const PRIVATE_STATE_ID = 'MarketplaceState';
export const ZK_PATH = '/zk/marketplace';

export const AUCTION_STATE_NAMES = ['OPEN', 'CLOSED', 'SETTLED'] as const;

export type AuctionStateName = (typeof AUCTION_STATE_NAMES)[number];

let _compiledContract: any = null;
async function makeCompiledContract() {
  if (!_compiledContract) {
    _compiledContract = await getCompiledContract(ZK_PATH);
  }
  return _compiledContract;
}

export async function deployAuction(
  session: ConnectedSession,
  reservePriceNight: number,
  maxBidders: number,
  sellerSecret: Uint8Array,
): Promise<{ contractAddress: string, deploymentTx: any }> {
  const reservePriceStars = reservePriceNight * 1_000_000;
  const cc = await makeCompiledContract();
  const deployTxData = await (createUnprovenDeployTx as any)(
    {
      zkConfigProvider: session.providers.zkConfigProvider,
      walletProvider: session.providers.walletProvider,
    },
    {
      compiledContract: cc,
      args: [BigInt(reservePriceStars), BigInt(maxBidders), sellerSecret],
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
      signingKey: sampleSigningKey(),
    },
  );

  const contractAddress = deployTxData.public.contractAddress;
  await (submitTxAsync as any)(session.providers, { unprovenTx: deployTxData.private.unprovenTx });
  await session.providers.privateStateProvider.setContractAddress(contractAddress);
  await session.providers.privateStateProvider.set(PRIVATE_STATE_ID, {});
  await session.providers.privateStateProvider.setSigningKey(
    contractAddress,
    deployTxData.private.signingKey,
  );
  return { contractAddress, deploymentTx: deployTxData };
}

async function call(
  session: ConnectedSession,
  contractAddress: string,
  circuitId: string,
  args: unknown[],
) {
  const cc = await makeCompiledContract();
  await (submitCallTxAsync as any)(session.providers, {
    compiledContract: cc,
    contractAddress,
    circuitId,
    args,
    privateStateId: PRIVATE_STATE_ID,
  });
}

// Contract call wrappers
export const callTx = {
  createAuction: (session: ConnectedSession, contractAddress: string, _auctionId: Uint8Array, _metadataUri: Uint8Array, _minPrice: bigint, _maxBids: bigint, _deadline: bigint, _secret: Uint8Array) =>
    call(session, contractAddress, 'createAuction', [_auctionId, _metadataUri, _minPrice, _maxBids, _deadline, _secret]),
    
  bid: (session: ConnectedSession, contractAddress: string, _auctionId: Uint8Array, _bidAmount: bigint, _userAddress: { bytes: Uint8Array }, _userSecret: Uint8Array) =>
    call(session, contractAddress, 'bid', [_auctionId, _bidAmount, _userAddress, _userSecret]),
    
  closeAuction: (session: ConnectedSession, contractAddress: string, _auctionId: Uint8Array, _secret: Uint8Array) =>
    call(session, contractAddress, 'closeAuction', [_auctionId, _secret]),
    
  revealPrice: (session: ConnectedSession, contractAddress: string, _auctionId: Uint8Array, _reservePrice: bigint, _organizerSecret: Uint8Array) =>
    call(session, contractAddress, 'revealPrice', [_auctionId, _reservePrice, _organizerSecret]),
    
  claimItem: (session: ConnectedSession, contractAddress: string, _auctionId: Uint8Array, _userAddress: { bytes: Uint8Array }, _userSecret: Uint8Array) =>
    call(session, contractAddress, 'claimItem', [_auctionId, _userAddress, _userSecret]),
    
  claimProceeds: (session: ConnectedSession, contractAddress: string, _auctionId: Uint8Array, _organizerAddress: { bytes: Uint8Array }, _organizerSecret: Uint8Array) =>
    call(session, contractAddress, 'claimProceeds', [_auctionId, _organizerAddress, _organizerSecret]),
};

// Legacy shim for backwards compatibility in UI components that expect `Contract.deployContract`
export class Contract {
  providers: any;
  midnightContract: any;
  contractAddress: string;

  private constructor(providers: any, midnightContract: any, address: string) {
    this.providers = providers;
    this.midnightContract = midnightContract;
    this.contractAddress = address;
  }

  static async deployContract(session: ConnectedSession): Promise<{ contractAddress: string; deploymentTx: any }> {
    // Generate mock deployment as our real deployment requires circuit params
    // We'll return a mock address for UI purposes and let the real createAuction handle it
    const mockAddr = "02" + Array.from(crypto.getRandomValues(new Uint8Array(19))).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // ensure providers has contractAddress set for future calls
    await session.providers.privateStateProvider.setContractAddress(mockAddr);
    await session.providers.privateStateProvider.set(PRIVATE_STATE_ID, {});
    
    return {
      contractAddress: mockAddr,
      deploymentTx: {},
    };
  }

  static async connect(session: ConnectedSession, address: string): Promise<{
    callTx: {
      createAuction: (...args: any[]) => Promise<void>;
      bid: (...args: any[]) => Promise<void>;
      closeAuction: (...args: any[]) => Promise<void>;
      revealPrice: (...args: any[]) => Promise<void>;
      claimItem: (...args: any[]) => Promise<void>;
      claimProceeds: (...args: any[]) => Promise<void>;
    }
  }> {
    // Ensure the private state provider tracks this address
    await session.providers.privateStateProvider.setContractAddress(address);
    // If not set, init empty state
    if (!await session.providers.privateStateProvider.get(PRIVATE_STATE_ID)) {
       await session.providers.privateStateProvider.set(PRIVATE_STATE_ID, {});
    }

    return {
      callTx: {
        createAuction: (...args: any[]) => callTx.createAuction(session, address, args[0], args[1], args[2], args[3], args[4], args[5]),
        bid: (...args: any[]) => callTx.bid(session, address, args[0], args[1], args[2], args[3]),
        closeAuction: (...args: any[]) => callTx.closeAuction(session, address, args[0], args[1]),
        revealPrice: (...args: any[]) => callTx.revealPrice(session, address, args[0], args[1], args[2]),
        claimItem: (...args: any[]) => callTx.claimItem(session, address, args[0], args[1], args[2]),
        claimProceeds: (...args: any[]) => callTx.claimProceeds(session, address, args[0], args[1], args[2]),
      }
    };
  }
}
