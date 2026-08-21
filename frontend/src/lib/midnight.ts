import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import type { MidnightProvider, WalletProvider } from '@midnight-ntwrk/midnight-js-types';
import type { WalletConnectedAPI as DAppConnectorAPI } from '@midnight-ntwrk/dapp-connector-api';

export type ConnectedSession = {
  api: DAppConnectorAPI;
  config: any;
  providers: {
    privateStateProvider: ReturnType<typeof createPrivateStateProvider>;
    publicDataProvider: ReturnType<typeof createPatchedPublicDataProvider>;
    zkConfigProvider: FetchZkConfigProvider<any>;
    proofProvider: { proveTx: (unprovenTx: any) => Promise<any> };
    walletProvider: WalletProvider;
    midnightProvider: MidnightProvider;
  };
  unshieldedAddress: string;
  coinPublicKeyBytes: Uint8Array;
};

export function fromHex(hex: string): Uint8Array {
  const h = hex.startsWith('0x') ? hex.slice(2) : hex;
  return Uint8Array.from(h.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
}

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function coinPublicKeyToBytes(pk: unknown): Uint8Array {
  if (pk instanceof Uint8Array) return pk.length === 32 ? pk : pk.slice(0, 32);
  if (typeof pk === 'string') {
    const hex = pk.startsWith('0x') ? pk.slice(2) : pk;
    if (hex.length === 64 && /^[0-9a-fA-F]+$/.test(hex)) return fromHex(hex);
    return new Uint8Array(32);
  }
  if (Array.isArray(pk)) {
    return new Uint8Array(pk.length >= 32 ? pk.slice(0, 32) : [...pk, ...new Uint8Array(32 - pk.length)]);
  }
  if (pk && typeof pk === 'object' && 'bytes' in (pk as object)) {
    return coinPublicKeyToBytes((pk as { bytes: unknown }).bytes);
  }
  return new Uint8Array(32);
}

function createPrivateStateProvider() {
  let scope = '';
  const stateStore = new Map<string, unknown>();
  const signingKeyStore = new Map<string, unknown>();
  const key = (id: string) => `${scope}:${id}`;
  return {
    setContractAddress(address: string) {
      scope = address;
    },
    async set(id: string, state: unknown) {
      stateStore.set(key(id), state);
    },
    async get(id: string) {
      return stateStore.get(key(id)) ?? null;
    },
    async remove(id: string) {
      stateStore.delete(key(id));
    },
    async clear() {
      stateStore.clear();
    },
    async setSigningKey(addr: string, k: unknown) {
      signingKeyStore.set(addr, k);
    },
    async getSigningKey(addr: string) {
      return signingKeyStore.get(addr) ?? null;
    },
    async removeSigningKey(addr: string) {
      signingKeyStore.delete(addr);
    },
    async clearSigningKeys() {
      signingKeyStore.clear();
    },
    async exportPrivateStates(): Promise<never> {
      throw new Error('Not implemented.');
    }
  };
}

function createPatchedPublicDataProvider(indexerUri: string, indexerWsUri: string) {
  const provider = indexerPublicDataProvider(indexerUri, indexerWsUri);
  return {
    ...provider,
    async queryContractState(address: string) {
      return provider.queryContractState(address).catch(async (e) => {
        const res = await fetch(indexerUri, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            query: `query LATEST_CONTRACT_STATE($address: HexEncoded!) { contractAction(address: $address) { state } }`,
            variables: { address }
          }),
        });
        const payload = await res.json();
        const state = payload.data?.contractAction?.state;
        if (!state) throw e;
        return fromHex(state);
      });
    }
  };
}

export async function createConnectedSession(api: DAppConnectorAPI): Promise<ConnectedSession> {
  const [config, unshieldedAddress, shieldedAddress] = await Promise.all([
    api.getConfiguration(),
    api.getUnshieldedAddress(),
    api.getShieldedAddresses(),
  ]);

  const zkConfigProvider = new FetchZkConfigProvider(window.location.origin, fetch);

  const proofProvider = {
    async proveTx(unprovenTx: any) {
      return (api as any).proveTx(unprovenTx);
    },
  };

  const walletProvider = {
    async balanceTx(tx: any, newCoins: any) {
      const { Transaction } = await import('@midnight-ntwrk/ledger-v8');
      return (api as any).balanceTx((Transaction as any).deserialize(tx), newCoins);
    }
  } as unknown as WalletProvider;

  const midnightProvider = {
    async submitTx(tx: any) {
      const txData = typeof tx === 'string' ? tx : (tx.serialize ? tx.serialize() : tx);
      const result = await api.submitTransaction(txData);
      if (typeof result === 'string' && result) return result;
      if ((result as any)?.transactionId) return (result as any).transactionId;
      if ((result as any)?.id) return (result as any).id;
      return typeof txData === 'string' ? txData.slice(0, 64) : 'unknown-tx';
    },
  } as unknown as MidnightProvider;

  return {
    api,
    config,
    providers: {
      privateStateProvider: createPrivateStateProvider(),
      publicDataProvider: createPatchedPublicDataProvider(config.indexerUri, config.indexerWsUri),
      zkConfigProvider,
      proofProvider,
      walletProvider,
      midnightProvider,
    },
    unshieldedAddress: unshieldedAddress.unshieldedAddress,
    coinPublicKeyBytes: coinPublicKeyToBytes(shieldedAddress.shieldedCoinPublicKey),
  };
}

export async function pollForState(
  queryUrl: string,
  contractAddress: string,
  maxAttempts = 120,
  intervalMs = 2000,
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(queryUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: `query LATEST_CONTRACT_STATE($address: HexEncoded!) {
          contractAction(address: $address) { state }
        }`,
        variables: { address: contractAddress },
      }),
    });
    if (res.ok) {
      const payload = await res.json();
      const state = payload.data?.contractAction?.state;
      if (state) return state;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Contract state not indexed after ${(maxAttempts * intervalMs) / 1000}s`);
}

export async function detectWallet(): Promise<any> {
  const w =
    (window as any).midnight?.['1am'] ??
    (window as any).midnight?.lace ??
    Object.values((window as any).midnight ?? {})[0];
  if (!w) throw new Error('No Midnight wallet extension found');
  return w;
}
