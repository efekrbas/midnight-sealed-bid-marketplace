import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { sampleSigningKey, ContractState } from '@midnight-ntwrk/compact-runtime';

let _contractModule: any = null;
let _compiledContract: any = null;
let _ledgerFn: any = null;

export async function getCompiledContract(zkPath?: string): Promise<any> {
  if (!_compiledContract) {
    if (!_contractModule) {
      _contractModule = await import('./managed/marketplace/contract/index.js');
    }
    _compiledContract = CompiledContract.make(
      'marketplace',
      _contractModule.Contract,
    );
    _compiledContract = CompiledContract.withVacantWitnesses(_compiledContract);
  }
  return _compiledContract;
}

export async function getLedger(): Promise<any> {
  if (!_ledgerFn) {
    if (!_contractModule) {
      _contractModule = await import('./managed/marketplace/contract/index.js');
    }
    _ledgerFn = _contractModule.ledger;
  }
  return _ledgerFn;
}

export { sampleSigningKey, ContractState };
