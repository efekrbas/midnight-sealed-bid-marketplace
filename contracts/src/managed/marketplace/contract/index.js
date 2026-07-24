import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var AuctionState;
(function (AuctionState) {
  AuctionState[AuctionState['OPEN'] = 0] = 'OPEN';
  AuctionState[AuctionState['CLOSED'] = 1] = 'CLOSED';
  AuctionState[AuctionState['SETTLED'] = 2] = 'SETTLED';
})(AuctionState || (AuctionState = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_3 = new __compactRuntime.CompactTypeEnum(2, 1);

const _descriptor_4 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _Auction_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_1.alignment().concat(_descriptor_3.alignment().concat(_descriptor_0.alignment().concat(_descriptor_4.alignment()))))))));
  }
  fromValue(value_0) {
    return {
      organizer: _descriptor_0.fromValue(value_0),
      hiddenPrice: _descriptor_0.fromValue(value_0),
      publicPrice: _descriptor_1.fromValue(value_0),
      maxBids: _descriptor_2.fromValue(value_0),
      bidCount: _descriptor_2.fromValue(value_0),
      highestBid: _descriptor_1.fromValue(value_0),
      state: _descriptor_3.fromValue(value_0),
      metadataUri: _descriptor_0.fromValue(value_0),
      deadlineBlock: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.organizer).concat(_descriptor_0.toValue(value_0.hiddenPrice).concat(_descriptor_1.toValue(value_0.publicPrice).concat(_descriptor_2.toValue(value_0.maxBids).concat(_descriptor_2.toValue(value_0.bidCount).concat(_descriptor_1.toValue(value_0.highestBid).concat(_descriptor_3.toValue(value_0.state).concat(_descriptor_0.toValue(value_0.metadataUri).concat(_descriptor_4.toValue(value_0.deadlineBlock)))))))));
  }
}

const _descriptor_5 = new _Auction_0();

const _descriptor_6 = __compactRuntime.CompactTypeBoolean;

class _UserAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_7 = new _UserAddress_0();

class _Either_0 {
  alignment() {
    return _descriptor_6.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_6.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_6.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_8 = new _Either_0();

const _descriptor_9 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

const _descriptor_10 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_11 = new _ContractAddress_0();

class _Either_1 {
  alignment() {
    return _descriptor_6.alignment().concat(_descriptor_11.alignment().concat(_descriptor_7.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_6.fromValue(value_0),
      left: _descriptor_11.fromValue(value_0),
      right: _descriptor_7.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_6.toValue(value_0.is_left).concat(_descriptor_11.toValue(value_0.left).concat(_descriptor_7.toValue(value_0.right)));
  }
}

const _descriptor_12 = new _Either_1();

const _descriptor_13 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      createAuction: (...args_1) => {
        if (args_1.length !== 7) {
          throw new __compactRuntime.CompactError(`createAuction: expected 7 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const _auctionId_0 = args_1[1];
        const metadataUri_0 = args_1[2];
        const minPrice_0 = args_1[3];
        const maxBidCount_0 = args_1[4];
        const deadlineBlock_0 = args_1[5];
        const _secret_0 = args_1[6];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('createAuction',
                                     'argument 1 (as invoked from Typescript)',
                                     'marketplace.compact line 27 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(_auctionId_0.buffer instanceof ArrayBuffer && _auctionId_0.BYTES_PER_ELEMENT === 1 && _auctionId_0.length === 32)) {
          __compactRuntime.typeError('createAuction',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'marketplace.compact line 27 char 1',
                                     'Bytes<32>',
                                     _auctionId_0)
        }
        if (!(metadataUri_0.buffer instanceof ArrayBuffer && metadataUri_0.BYTES_PER_ELEMENT === 1 && metadataUri_0.length === 32)) {
          __compactRuntime.typeError('createAuction',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'marketplace.compact line 27 char 1',
                                     'Bytes<32>',
                                     metadataUri_0)
        }
        if (!(typeof(minPrice_0) === 'bigint' && minPrice_0 >= 0n && minPrice_0 <= 4294967295n)) {
          __compactRuntime.typeError('createAuction',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'marketplace.compact line 27 char 1',
                                     'Uint<0..4294967296>',
                                     minPrice_0)
        }
        if (!(typeof(maxBidCount_0) === 'bigint' && maxBidCount_0 >= 0n && maxBidCount_0 <= 65535n)) {
          __compactRuntime.typeError('createAuction',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'marketplace.compact line 27 char 1',
                                     'Uint<0..65536>',
                                     maxBidCount_0)
        }
        if (!(typeof(deadlineBlock_0) === 'bigint' && deadlineBlock_0 >= 0n && deadlineBlock_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('createAuction',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'marketplace.compact line 27 char 1',
                                     'Uint<0..18446744073709551616>',
                                     deadlineBlock_0)
        }
        if (!(_secret_0.buffer instanceof ArrayBuffer && _secret_0.BYTES_PER_ELEMENT === 1 && _secret_0.length === 32)) {
          __compactRuntime.typeError('createAuction',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'marketplace.compact line 27 char 1',
                                     'Bytes<32>',
                                     _secret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(_auctionId_0).concat(_descriptor_0.toValue(metadataUri_0).concat(_descriptor_1.toValue(minPrice_0).concat(_descriptor_2.toValue(maxBidCount_0).concat(_descriptor_4.toValue(deadlineBlock_0).concat(_descriptor_0.toValue(_secret_0)))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_4.alignment().concat(_descriptor_0.alignment())))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._createAuction_0(context,
                                               partialProofData,
                                               _auctionId_0,
                                               metadataUri_0,
                                               minPrice_0,
                                               maxBidCount_0,
                                               deadlineBlock_0,
                                               _secret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      bid: (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`bid: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const _auctionId_0 = args_1[1];
        const bidAmount_0 = args_1[2];
        const _address_0 = args_1[3];
        const _secret_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('bid',
                                     'argument 1 (as invoked from Typescript)',
                                     'marketplace.compact line 56 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(_auctionId_0.buffer instanceof ArrayBuffer && _auctionId_0.BYTES_PER_ELEMENT === 1 && _auctionId_0.length === 32)) {
          __compactRuntime.typeError('bid',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'marketplace.compact line 56 char 1',
                                     'Bytes<32>',
                                     _auctionId_0)
        }
        if (!(typeof(bidAmount_0) === 'bigint' && bidAmount_0 >= 0n && bidAmount_0 <= 4294967295n)) {
          __compactRuntime.typeError('bid',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'marketplace.compact line 56 char 1',
                                     'Uint<0..4294967296>',
                                     bidAmount_0)
        }
        if (!(typeof(_address_0) === 'object' && _address_0.bytes.buffer instanceof ArrayBuffer && _address_0.bytes.BYTES_PER_ELEMENT === 1 && _address_0.bytes.length === 32)) {
          __compactRuntime.typeError('bid',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'marketplace.compact line 56 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     _address_0)
        }
        if (!(_secret_0.buffer instanceof ArrayBuffer && _secret_0.BYTES_PER_ELEMENT === 1 && _secret_0.length === 32)) {
          __compactRuntime.typeError('bid',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'marketplace.compact line 56 char 1',
                                     'Bytes<32>',
                                     _secret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(_auctionId_0).concat(_descriptor_1.toValue(bidAmount_0).concat(_descriptor_7.toValue(_address_0).concat(_descriptor_0.toValue(_secret_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_7.alignment().concat(_descriptor_0.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._bid_0(context,
                                     partialProofData,
                                     _auctionId_0,
                                     bidAmount_0,
                                     _address_0,
                                     _secret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      closeAuction: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`closeAuction: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const _auctionId_0 = args_1[1];
        const _secret_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('closeAuction',
                                     'argument 1 (as invoked from Typescript)',
                                     'marketplace.compact line 98 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(_auctionId_0.buffer instanceof ArrayBuffer && _auctionId_0.BYTES_PER_ELEMENT === 1 && _auctionId_0.length === 32)) {
          __compactRuntime.typeError('closeAuction',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'marketplace.compact line 98 char 1',
                                     'Bytes<32>',
                                     _auctionId_0)
        }
        if (!(_secret_0.buffer instanceof ArrayBuffer && _secret_0.BYTES_PER_ELEMENT === 1 && _secret_0.length === 32)) {
          __compactRuntime.typeError('closeAuction',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'marketplace.compact line 98 char 1',
                                     'Bytes<32>',
                                     _secret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(_auctionId_0).concat(_descriptor_0.toValue(_secret_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._closeAuction_0(context,
                                              partialProofData,
                                              _auctionId_0,
                                              _secret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      revealPrice: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`revealPrice: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const _auctionId_0 = args_1[1];
        const minPrice_0 = args_1[2];
        const _secret_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revealPrice',
                                     'argument 1 (as invoked from Typescript)',
                                     'marketplace.compact line 121 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(_auctionId_0.buffer instanceof ArrayBuffer && _auctionId_0.BYTES_PER_ELEMENT === 1 && _auctionId_0.length === 32)) {
          __compactRuntime.typeError('revealPrice',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'marketplace.compact line 121 char 1',
                                     'Bytes<32>',
                                     _auctionId_0)
        }
        if (!(typeof(minPrice_0) === 'bigint' && minPrice_0 >= 0n && minPrice_0 <= 4294967295n)) {
          __compactRuntime.typeError('revealPrice',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'marketplace.compact line 121 char 1',
                                     'Uint<0..4294967296>',
                                     minPrice_0)
        }
        if (!(_secret_0.buffer instanceof ArrayBuffer && _secret_0.BYTES_PER_ELEMENT === 1 && _secret_0.length === 32)) {
          __compactRuntime.typeError('revealPrice',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'marketplace.compact line 121 char 1',
                                     'Bytes<32>',
                                     _secret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(_auctionId_0).concat(_descriptor_1.toValue(minPrice_0).concat(_descriptor_0.toValue(_secret_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._revealPrice_0(context,
                                             partialProofData,
                                             _auctionId_0,
                                             minPrice_0,
                                             _secret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      claimItem: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`claimItem: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const _auctionId_0 = args_1[1];
        const _address_0 = args_1[2];
        const _secret_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('claimItem',
                                     'argument 1 (as invoked from Typescript)',
                                     'marketplace.compact line 147 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(_auctionId_0.buffer instanceof ArrayBuffer && _auctionId_0.BYTES_PER_ELEMENT === 1 && _auctionId_0.length === 32)) {
          __compactRuntime.typeError('claimItem',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'marketplace.compact line 147 char 1',
                                     'Bytes<32>',
                                     _auctionId_0)
        }
        if (!(typeof(_address_0) === 'object' && _address_0.bytes.buffer instanceof ArrayBuffer && _address_0.bytes.BYTES_PER_ELEMENT === 1 && _address_0.bytes.length === 32)) {
          __compactRuntime.typeError('claimItem',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'marketplace.compact line 147 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     _address_0)
        }
        if (!(_secret_0.buffer instanceof ArrayBuffer && _secret_0.BYTES_PER_ELEMENT === 1 && _secret_0.length === 32)) {
          __compactRuntime.typeError('claimItem',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'marketplace.compact line 147 char 1',
                                     'Bytes<32>',
                                     _secret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(_auctionId_0).concat(_descriptor_7.toValue(_address_0).concat(_descriptor_0.toValue(_secret_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_7.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._claimItem_0(context,
                                           partialProofData,
                                           _auctionId_0,
                                           _address_0,
                                           _secret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      claimProceeds: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`claimProceeds: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const _auctionId_0 = args_1[1];
        const _address_0 = args_1[2];
        const _secret_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('claimProceeds',
                                     'argument 1 (as invoked from Typescript)',
                                     'marketplace.compact line 168 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(_auctionId_0.buffer instanceof ArrayBuffer && _auctionId_0.BYTES_PER_ELEMENT === 1 && _auctionId_0.length === 32)) {
          __compactRuntime.typeError('claimProceeds',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'marketplace.compact line 168 char 1',
                                     'Bytes<32>',
                                     _auctionId_0)
        }
        if (!(typeof(_address_0) === 'object' && _address_0.bytes.buffer instanceof ArrayBuffer && _address_0.bytes.BYTES_PER_ELEMENT === 1 && _address_0.bytes.length === 32)) {
          __compactRuntime.typeError('claimProceeds',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'marketplace.compact line 168 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     _address_0)
        }
        if (!(_secret_0.buffer instanceof ArrayBuffer && _secret_0.BYTES_PER_ELEMENT === 1 && _secret_0.length === 32)) {
          __compactRuntime.typeError('claimProceeds',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'marketplace.compact line 168 char 1',
                                     'Bytes<32>',
                                     _secret_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(_auctionId_0).concat(_descriptor_7.toValue(_address_0).concat(_descriptor_0.toValue(_secret_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_7.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._claimProceeds_0(context,
                                               partialProofData,
                                               _auctionId_0,
                                               _address_0,
                                               _secret_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      createAuction: this.circuits.createAuction,
      bid: this.circuits.bid,
      closeAuction: this.circuits.closeAuction,
      revealPrice: this.circuits.revealPrice,
      claimItem: this.circuits.claimItem,
      claimProceeds: this.circuits.claimProceeds
    };
    this.provableCircuits = {
      createAuction: this.circuits.createAuction,
      bid: this.circuits.bid,
      closeAuction: this.circuits.closeAuction,
      revealPrice: this.circuits.revealPrice,
      claimItem: this.circuits.claimItem,
      claimProceeds: this.circuits.claimProceeds
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('createAuction', new __compactRuntime.ContractOperation());
    state_0.setOperation('bid', new __compactRuntime.ContractOperation());
    state_0.setOperation('closeAuction', new __compactRuntime.ContractOperation());
    state_0.setOperation('revealPrice', new __compactRuntime.ContractOperation());
    state_0.setOperation('claimItem', new __compactRuntime.ContractOperation());
    state_0.setOperation('claimProceeds', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(0n),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(1n),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_13.toValue(2n),
                                                                                              alignment: _descriptor_13.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _left_0(value_0) {
    return { is_left: true, left: value_0, right: new Uint8Array(32) };
  }
  _right_0(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  _nativeToken_0() {
    return new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
  _sendUnshielded_0(context, partialProofData, color_0, amount_0, recipient_0) {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(7n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(amount_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    const tmp_1 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(8n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                              { value: _descriptor_8.toValue(tmp_1),
                                                                                                alignment: _descriptor_8.alignment() },
                                                                                              { value: _descriptor_12.toValue(recipient_0),
                                                                                                alignment: _descriptor_12.alignment() }
                                                                                            )).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(amount_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    if (recipient_0.is_left
        &&
        this._equal_0(recipient_0.left.bytes,
                      _descriptor_11.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_13.toValue(0n),
                                                                                                             alignment: _descriptor_13.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value).bytes))
    {
      const tmp_2 = this._left_0(color_0);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_13.toValue(6n),
                                                                    alignment: _descriptor_13.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_2),
                                                                                                alignment: _descriptor_8.alignment() }).encode() } },
                                         { dup: { n: 1 } },
                                         { dup: { n: 1 } },
                                         'member',
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(amount_0),
                                                                                                alignment: _descriptor_9.alignment() }).encode() } },
                                         { swap: { n: 0 } },
                                         'neg',
                                         { branch: { skip: 4 } },
                                         { dup: { n: 2 } },
                                         { dup: { n: 2 } },
                                         { idx: { cached: true,
                                                  pushPath: false,
                                                  path: [ { tag: 'stack' }] } },
                                         'add',
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
    }
    return [];
  }
  _receiveUnshielded_0(context, partialProofData, color_0, amount_0) {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(6n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(tmp_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(amount_0),
                                                                                              alignment: _descriptor_9.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    return [];
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_10, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_0,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _createAuction_0(context,
                   partialProofData,
                   _auctionId_0,
                   metadataUri_0,
                   minPrice_0,
                   maxBidCount_0,
                   deadlineBlock_0,
                   _secret_0)
  {
    const auctionId_0 = _auctionId_0;
    __compactRuntime.assert(!_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_13.toValue(0n),
                                                                                                                   alignment: _descriptor_13.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Auction already exists');
    __compactRuntime.assert(minPrice_0 > 0n,
                            'Reserve price must be greater than zero');
    __compactRuntime.assert(maxBidCount_0 > 0n,
                            'Max bids must be greater than zero');
    const pubKey_0 = this._getDappPublicKey_0(_secret_0);
    const tmp_0 = { organizer: pubKey_0,
                    hiddenPrice:
                      this._commitPrice_0(__compactRuntime.convertFieldToBytes(32,
                                                                               minPrice_0,
                                                                               'marketplace.compact line 44 char 34'),
                                          _secret_0),
                    publicPrice: 0n,
                    maxBids: maxBidCount_0,
                    bidCount: 0n,
                    highestBid: 0n,
                    state: 0,
                    metadataUri: metadataUri_0,
                    deadlineBlock: deadlineBlock_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(0n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _bid_0(context,
         partialProofData,
         _auctionId_0,
         bidAmount_0,
         _address_0,
         _secret_0)
  {
    const auctionId_0 = _auctionId_0;
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(0n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Auction does not exist');
    const auction_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_13.toValue(0n),
                                                                                                            alignment: _descriptor_13.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(auctionId_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    __compactRuntime.assert(auction_0.state === 0, 'Auction is not open');
    let t_0;
    __compactRuntime.assert((t_0 = auction_0.bidCount, t_0 < auction_0.maxBids),
                            'Bids are full');
    __compactRuntime.assert(bidAmount_0 > 0n, 'Bid must be greater than zero');
    const pubKey_0 = this._getDappPublicKey_0(_secret_0);
    __compactRuntime.assert(!this._equal_1(pubKey_0, auction_0.organizer),
                            'Organizer cannot bid');
    const bidderId_0 = pubKey_0;
    const publicBid_0 = bidAmount_0;
    const bidKey_0 = this._hashBidKey_0(auctionId_0, bidderId_0);
    if (_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_13.toValue(1n),
                                                                                              alignment: _descriptor_13.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(bidKey_0),
                                                                                                                          alignment: _descriptor_0.alignment() }).encode() } },
                                                                   'member',
                                                                   { popeq: { cached: true,
                                                                              result: undefined } }]).value))
    {
      let t_1;
      __compactRuntime.assert((t_1 = _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                               partialProofData,
                                                                                               [
                                                                                                { dup: { n: 0 } },
                                                                                                { idx: { cached: false,
                                                                                                         pushPath: false,
                                                                                                         path: [
                                                                                                                { tag: 'value',
                                                                                                                  value: { value: _descriptor_13.toValue(1n),
                                                                                                                           alignment: _descriptor_13.alignment() } }] } },
                                                                                                { idx: { cached: false,
                                                                                                         pushPath: false,
                                                                                                         path: [
                                                                                                                { tag: 'value',
                                                                                                                  value: { value: _descriptor_0.toValue(bidKey_0),
                                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                                { popeq: { cached: false,
                                                                                                           result: undefined } }]).value),
                               t_1 < publicBid_0),
                              'New bid must be higher');
    }
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(1n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(bidKey_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(publicBid_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const newBidCount_0 = ((t1) => {
                            if (t1 > 65535n) {
                              throw new __compactRuntime.CompactError('marketplace.compact line 78 char 25: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 65535');
                            }
                            return t1;
                          })(auction_0.bidCount + 1n);
    const isHigher_0 = publicBid_0 > auction_0.highestBid;
    const newHighestBid_0 = isHigher_0 ? publicBid_0 : auction_0.highestBid;
    const isFull_0 = this._equal_2(newBidCount_0, auction_0.maxBids);
    const newState_0 = isFull_0 ? 1 : auction_0.state;
    const tmp_0 = { organizer: auction_0.organizer,
                    hiddenPrice: auction_0.hiddenPrice,
                    publicPrice: auction_0.publicPrice,
                    maxBids: auction_0.maxBids,
                    bidCount: newBidCount_0,
                    highestBid: newHighestBid_0,
                    state: newState_0,
                    metadataUri: auction_0.metadataUri,
                    deadlineBlock: auction_0.deadlineBlock };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(0n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _closeAuction_0(context, partialProofData, _auctionId_0, _secret_0) {
    const auctionId_0 = _auctionId_0;
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(0n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Auction does not exist');
    const auction_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_13.toValue(0n),
                                                                                                            alignment: _descriptor_13.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(auctionId_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    const pubKey_0 = this._getDappPublicKey_0(_secret_0);
    __compactRuntime.assert(this._equal_3(auction_0.organizer, pubKey_0),
                            'Only organizer can close');
    __compactRuntime.assert(auction_0.state === 0, 'Auction already closed');
    const tmp_0 = { organizer: auction_0.organizer,
                    hiddenPrice: auction_0.hiddenPrice,
                    publicPrice: auction_0.publicPrice,
                    maxBids: auction_0.maxBids,
                    bidCount: auction_0.bidCount,
                    highestBid: auction_0.highestBid,
                    state: 1,
                    metadataUri: auction_0.metadataUri,
                    deadlineBlock: auction_0.deadlineBlock };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(0n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _revealPrice_0(context, partialProofData, _auctionId_0, minPrice_0, _secret_0)
  {
    const auctionId_0 = _auctionId_0;
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(0n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Auction does not exist');
    const auction_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_13.toValue(0n),
                                                                                                            alignment: _descriptor_13.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(auctionId_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    const pubKey_0 = this._getDappPublicKey_0(_secret_0);
    __compactRuntime.assert(this._equal_4(auction_0.organizer, pubKey_0),
                            'Only organizer can reveal');
    __compactRuntime.assert(auction_0.state === 1, 'Auction not closed');
    const hashedPrice_0 = this._commitPrice_0(__compactRuntime.convertFieldToBytes(32,
                                                                                   minPrice_0,
                                                                                   'marketplace.compact line 130 char 37'),
                                              _secret_0);
    __compactRuntime.assert(this._equal_5(hashedPrice_0, auction_0.hiddenPrice),
                            'Price mismatch — cannot change reserve');
    const tmp_0 = { organizer: auction_0.organizer,
                    hiddenPrice: auction_0.hiddenPrice,
                    publicPrice: minPrice_0,
                    maxBids: auction_0.maxBids,
                    bidCount: auction_0.bidCount,
                    highestBid: auction_0.highestBid,
                    state: 2,
                    metadataUri: auction_0.metadataUri,
                    deadlineBlock: auction_0.deadlineBlock };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(0n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _claimItem_0(context, partialProofData, _auctionId_0, _address_0, _secret_0) {
    const auctionId_0 = _auctionId_0;
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(0n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Auction does not exist');
    const auction_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_13.toValue(0n),
                                                                                                            alignment: _descriptor_13.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(auctionId_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    __compactRuntime.assert(auction_0.state === 2, 'Auction not settled');
    let t_0;
    __compactRuntime.assert((t_0 = auction_0.highestBid,
                             t_0 >= auction_0.publicPrice),
                            'No valid winning bid');
    const pubKey_0 = this._getDappPublicKey_0(_secret_0);
    const bidderId_0 = pubKey_0;
    const bidKey_0 = this._hashBidKey_0(auctionId_0, bidderId_0);
    __compactRuntime.assert(this._equal_6(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_13.toValue(1n),
                                                                                                                                alignment: _descriptor_13.alignment() } }] } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_0.toValue(bidKey_0),
                                                                                                                                alignment: _descriptor_0.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          auction_0.highestBid),
                            'Not the highest bidder');
    __compactRuntime.assert(!_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_13.toValue(2n),
                                                                                                                   alignment: _descriptor_13.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Already claimed');
    this._receiveUnshielded_0(context,
                              partialProofData,
                              this._nativeToken_0(),
                              auction_0.publicPrice);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_13.toValue(2n),
                                                                  alignment: _descriptor_13.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(true),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _claimProceeds_0(context,
                   partialProofData,
                   _auctionId_0,
                   _address_0,
                   _secret_0)
  {
    const auctionId_0 = _auctionId_0;
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(0n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Auction does not exist');
    const auction_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_13.toValue(0n),
                                                                                                            alignment: _descriptor_13.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(auctionId_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    const pubKey_0 = this._getDappPublicKey_0(_secret_0);
    __compactRuntime.assert(this._equal_7(auction_0.organizer, pubKey_0),
                            'Not organizer');
    __compactRuntime.assert(auction_0.state === 2, 'Auction not settled');
    __compactRuntime.assert(_descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_13.toValue(2n),
                                                                                                                  alignment: _descriptor_13.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(auctionId_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'No winner claimed');
    this._sendUnshielded_0(context,
                           partialProofData,
                           this._nativeToken_0(),
                           auction_0.publicPrice,
                           this._right_0(_address_0));
    return [];
  }
  _hashBidKey_0(auctionId_0, bidderId_0) {
    return this._persistentHash_0([auctionId_0, bidderId_0]);
  }
  _commitPrice_0(_price_0, _secret_0) {
    return this._persistentCommit_0(_price_0, _secret_0);
  }
  _getDappPublicKey_0(_secret_0) {
    return this._persistentHash_0([new Uint8Array([109, 97, 114, 107, 101, 116, 112, 108, 97, 99, 101, 58, 112, 107, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   _secret_0]);
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    auctions: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(0n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(0n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'marketplace.compact line 22 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(0n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'marketplace.compact line 22 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(0n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_5.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    bids: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'marketplace.compact line 23 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'marketplace.compact line 23 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(1n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_1.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    winnerClaimed: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(2n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                                 alignment: _descriptor_4.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(2n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'marketplace.compact line 24 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(2n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'marketplace.compact line 24 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_13.toValue(2n),
                                                                                                     alignment: _descriptor_13.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_6.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({ });
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
