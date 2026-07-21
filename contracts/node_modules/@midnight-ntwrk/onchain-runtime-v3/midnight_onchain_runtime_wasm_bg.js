let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(
state => {
    wasm.__wbindgen_export_5.get(state.dtor)(state.a, state.b);
}
);

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_5.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * @param {any} coin
 * @param {any} recipient
 * @returns {any}
 */
export function runtimeCoinCommitment(coin, recipient) {
    const ret = wasm.runtimeCoinCommitment(coin, recipient);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @returns {any}
 */
export function hashToCurve(align, val) {
    const ret = wasm.hashToCurve(align, val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @returns {string}
 */
export function sampleRawTokenType() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleRawTokenType();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} input
 * @param {any} output
 * @param {string} rand
 * @returns {string}
 */
export function communicationCommitment(input, output, rand) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(rand, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.communicationCommitment(input, output, ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @returns {string}
 */
export function dummyContractAddress() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.dummyContractAddress();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @returns {string}
 */
export function communicationCommitmentRandomness() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.communicationCommitmentRandomness();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {string} key
 * @param {Uint8Array} data
 * @returns {string}
 */
export function signData(key, data) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.signData(ptr0, len0, data);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {any} align
 * @param {any} val
 * @param {any} opening
 * @returns {any}
 */
export function persistentCommit(align, val, opening) {
    const ret = wasm.persistentCommit(align, val, opening);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} x
 * @returns {any}
 */
export function bigIntToValue(x) {
    const ret = wasm.bigIntToValue(x);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} key
 * @param {Uint8Array} data
 * @param {string} signature
 * @returns {boolean}
 */
export function verifySignature(key, data, signature) {
    const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(signature, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.verifySignature(ptr0, len0, data, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {any}
 */
export function ecAdd(a, b) {
    const ret = wasm.ecAdd(a, b);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} transient
 * @returns {any}
 */
export function upgradeFromTransient(transient) {
    const ret = wasm.upgradeFromTransient(transient);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} persistent
 * @returns {any}
 */
export function degradeToTransient(persistent) {
    const ret = wasm.degradeToTransient(persistent);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} domain_sep
 * @param {string} contract
 * @returns {string}
 */
export function rawTokenType(domain_sep, contract) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(contract, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.rawTokenType(domain_sep, ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {string} key
 * @returns {string}
 */
export function signatureVerifyingKey(key) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.signatureVerifyingKey(ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @returns {bigint}
 */
export function maxField() {
    const ret = wasm.maxField();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function signingKeyFromBip340(bytes) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.signingKeyFromBip340(bytes);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} align
 * @param {any} val
 * @returns {any}
 */
export function transientHash(align, val) {
    const ret = wasm.transientHash(align, val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} val
 * @returns {any}
 */
export function ecMulGenerator(val) {
    const ret = wasm.ecMulGenerator(val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @returns {string}
 */
export function dummyUserAddress() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.dummyUserAddress();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} alignment
 * @returns {bigint}
 */
export function maxAlignedSize(alignment) {
    const ret = wasm.maxAlignedSize(alignment);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return BigInt.asUintN(64, ret[0]);
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {any}
 */
export function ecMul(a, b) {
    const ret = wasm.ecMul(a, b);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @returns {string}
 */
export function sampleSigningKey() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleSigningKey();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @returns {string}
 */
export function sampleUserAddress() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleUserAddress();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @returns {string}
 */
export function sampleContractAddress() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleContractAddress();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} coin
 * @param {any} sender_evidence
 * @returns {any}
 */
export function runtimeCoinNullifier(coin, sender_evidence) {
    const ret = wasm.runtimeCoinNullifier(coin, sender_evidence);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @returns {any}
 */
export function persistentHash(align, val) {
    const ret = wasm.persistentHash(align, val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @param {any} opening
 * @returns {any}
 */
export function transientCommit(align, val, opening) {
    const ret = wasm.transientCommit(align, val, opening);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} x
 * @returns {bigint}
 */
export function valueToBigInt(x) {
    const ret = wasm.valueToBigInt(x);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} input
 * @param {any} output
 * @param {any} public_transcript
 * @param {any} private_transcript_outputs
 * @param {string | null} [key_location]
 * @returns {Uint8Array}
 */
export function proofDataIntoSerializedPreimage(input, output, public_transcript, private_transcript_outputs, key_location) {
    var ptr0 = isLikeNone(key_location) ? 0 : passStringToWasm0(key_location, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.proofDataIntoSerializedPreimage(input, output, public_transcript, private_transcript_outputs, ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} entry_point
 * @returns {string}
 */
export function entryPointHash(entry_point) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.entryPointHash(entry_point);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {bigint} x
 * @returns {bigint}
 */
export function bigIntModFr(x) {
    const ret = wasm.bigIntModFr(x);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} value
 * @returns {any}
 */
export function leafHash(value) {
    const ret = wasm.leafHash(value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} addr
 * @returns {Uint8Array}
 */
export function encodeContractAddress(addr) {
    const ptr0 = passStringToWasm0(addr, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodeContractAddress(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} addr
 * @returns {Uint8Array}
 */
export function encodeUserAddress(addr) {
    const ptr0 = passStringToWasm0(addr, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodeUserAddress(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} pk
 * @returns {string}
 */
export function decodeCoinPublicKey(pk) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decodeCoinPublicKey(pk);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {string} pk
 * @returns {Uint8Array}
 */
export function encodeCoinPublicKey(pk) {
    const ptr0 = passStringToWasm0(pk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodeCoinPublicKey(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} coin
 * @returns {any}
 */
export function encodeShieldedCoinInfo(coin) {
    const ret = wasm.encodeShieldedCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} tt
 * @returns {Uint8Array}
 */
export function encodeRawTokenType(tt) {
    const ptr0 = passStringToWasm0(tt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodeRawTokenType(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} addr
 * @returns {string}
 */
export function decodeUserAddress(addr) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decodeUserAddress(addr);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} coin
 * @returns {any}
 */
export function decodeShieldedCoinInfo(coin) {
    const ret = wasm.decodeShieldedCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} addr
 * @returns {string}
 */
export function decodeContractAddress(addr) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decodeContractAddress(addr);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} coin
 * @returns {any}
 */
export function decodeQualifiedShieldedCoinInfo(coin) {
    const ret = wasm.decodeQualifiedShieldedCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} tt
 * @returns {string}
 */
export function decodeRawTokenType(tt) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decodeRawTokenType(tt);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} coin
 * @returns {any}
 */
export function encodeQualifiedShieldedCoinInfo(coin) {
    const ret = wasm.encodeQualifiedShieldedCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}
/**
 * @param {VmStack} initial
 * @param {any} ops
 * @param {CostModel} cost_model
 * @param {any} gas_limit
 * @returns {VmResults}
 */
export function runProgram(initial, ops, cost_model, gas_limit) {
    _assertClass(initial, VmStack);
    _assertClass(cost_model, CostModel);
    const ret = wasm.runProgram(initial.__wbg_ptr, ops, cost_model.__wbg_ptr, gas_limit);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return VmResults.__wrap(ret[0]);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_2.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}
function __wbg_adapter_14(arg0, arg1, arg2) {
    wasm.closure690_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_258(arg0, arg1, arg2, arg3) {
    wasm.closure730_externref_shim(arg0, arg1, arg2, arg3);
}

const __wbindgen_enum_ReadableStreamType = ["bytes"];

const ChargedStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_chargedstate_free(ptr >>> 0, 1));

export class ChargedState {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ChargedState.prototype);
        obj.__wbg_ptr = ptr;
        ChargedStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChargedStateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_chargedstate_free(ptr, 0);
    }
    /**
     * @param {StateValue} state
     */
    constructor(state) {
        _assertClass(state, StateValue);
        const ret = wasm.chargedstate_new(state.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        ChargedStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {StateValue}
     */
    get state() {
        const ret = wasm.chargedstate_state(this.__wbg_ptr);
        return StateValue.__wrap(ret);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.chargedstate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ChargedState.prototype[Symbol.dispose] = ChargedState.prototype.free;

const ContractMaintenanceAuthorityFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractmaintenanceauthority_free(ptr >>> 0, 1));

export class ContractMaintenanceAuthority {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractMaintenanceAuthority.prototype);
        obj.__wbg_ptr = ptr;
        ContractMaintenanceAuthorityFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractMaintenanceAuthorityFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractmaintenanceauthority_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {ContractMaintenanceAuthority}
     */
    static deserialize(raw) {
        const ret = wasm.contractmaintenanceauthority_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ContractMaintenanceAuthority.__wrap(ret[0]);
    }
    /**
     * @param {Array<any>} committee
     * @param {number} threshold
     * @param {bigint | null} [counter]
     */
    constructor(committee, threshold, counter) {
        const ret = wasm.contractmaintenanceauthority_new(committee, threshold, isLikeNone(counter) ? 0 : addToExternrefTable0(counter));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ContractMaintenanceAuthorityFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {bigint}
     */
    get counter() {
        const ret = wasm.contractmaintenanceauthority_counter(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Array<any>}
     */
    get committee() {
        const ret = wasm.contractmaintenanceauthority_committee(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    serialize() {
        const ret = wasm.contractmaintenanceauthority_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {number}
     */
    get threshold() {
        const ret = wasm.contractmaintenanceauthority_threshold(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractmaintenanceauthority_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ContractMaintenanceAuthority.prototype[Symbol.dispose] = ContractMaintenanceAuthority.prototype.free;

const ContractOperationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractoperation_free(ptr >>> 0, 1));

export class ContractOperation {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractOperation.prototype);
        obj.__wbg_ptr = ptr;
        ContractOperationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractOperationFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractoperation_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {ContractOperation}
     */
    static deserialize(raw) {
        const ret = wasm.contractoperation_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ContractOperation.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    get verifierKey() {
        const ret = wasm.contractoperation_verifier_key(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} key
     */
    set verifierKey(key) {
        const ret = wasm.contractoperation_set_verifier_key(this.__wbg_ptr, key);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    constructor() {
        const ret = wasm.contractoperation_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ContractOperationFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    serialize() {
        const ret = wasm.contractoperation_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractoperation_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ContractOperation.prototype[Symbol.dispose] = ContractOperation.prototype.free;

const ContractStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractstate_free(ptr >>> 0, 1));

export class ContractState {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractState.prototype);
        obj.__wbg_ptr = ptr;
        ContractStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractStateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractstate_free(ptr, 0);
    }
    /**
     * @returns {any[]}
     */
    operations() {
        const ret = wasm.contractstate_operations(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {Uint8Array} raw
     * @returns {ContractState}
     */
    static deserialize(raw) {
        const ret = wasm.contractstate_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ContractState.__wrap(ret[0]);
    }
    /**
     * @param {Map<any, any>} value_map
     */
    set balance(value_map) {
        const ret = wasm.contractstate_set_balance(this.__wbg_ptr, value_map);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {any} operation
     * @param {ContractOperation} value
     */
    setOperation(operation, value) {
        _assertClass(value, ContractOperation);
        const ret = wasm.contractstate_setOperation(this.__wbg_ptr, operation, value.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {ContractMaintenanceAuthority}
     */
    get maintenanceAuthority() {
        const ret = wasm.contractstate_maintenance_authority(this.__wbg_ptr);
        return ContractMaintenanceAuthority.__wrap(ret);
    }
    /**
     * @param {ContractMaintenanceAuthority} authority
     */
    set maintenanceAuthority(authority) {
        _assertClass(authority, ContractMaintenanceAuthority);
        wasm.contractstate_set_maintenance_authority(this.__wbg_ptr, authority.__wbg_ptr);
    }
    constructor() {
        const ret = wasm.contractstate_new();
        this.__wbg_ptr = ret >>> 0;
        ContractStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {ChargedState}
     */
    get data() {
        const ret = wasm.contractstate_data(this.__wbg_ptr);
        return ChargedState.__wrap(ret);
    }
    /**
     * @param {any} query
     * @param {CostModel} cost_model
     * @returns {any}
     */
    query(query, cost_model) {
        _assertClass(cost_model, CostModel);
        const ret = wasm.contractstate_query(this.__wbg_ptr, query, cost_model.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Map<any, any>}
     */
    get balance() {
        const ret = wasm.contractstate_balance(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {ChargedState} data
     */
    set data(data) {
        _assertClass(data, ChargedState);
        wasm.contractstate_set_data(this.__wbg_ptr, data.__wbg_ptr);
    }
    /**
     * @param {any} operation
     * @returns {ContractOperation | undefined}
     */
    operation(operation) {
        const ret = wasm.contractstate_operation(this.__wbg_ptr, operation);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : ContractOperation.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    serialize() {
        const ret = wasm.contractstate_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractstate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ContractState.prototype[Symbol.dispose] = ContractState.prototype.free;

const CostModelFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_costmodel_free(ptr >>> 0, 1));

export class CostModel {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CostModel.prototype);
        obj.__wbg_ptr = ptr;
        CostModelFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CostModelFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_costmodel_free(ptr, 0);
    }
    /**
     * @returns {CostModel}
     */
    static initialCostModel() {
        const ret = wasm.costmodel_initialCostModel();
        return CostModel.__wrap(ret);
    }
    constructor() {
        const ret = wasm.costmodel_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        CostModelFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.costmodel_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) CostModel.prototype[Symbol.dispose] = CostModel.prototype.free;

const IntoUnderlyingByteSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0, 1));

export class IntoUnderlyingByteSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingByteSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingbytesource_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get autoAllocateChunkSize() {
        const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {ReadableByteStreamController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    /**
     * @param {ReadableByteStreamController} controller
     */
    start(controller) {
        wasm.intounderlyingbytesource_start(this.__wbg_ptr, controller);
    }
    /**
     * @returns {ReadableStreamType}
     */
    get type() {
        const ret = wasm.intounderlyingbytesource_type(this.__wbg_ptr);
        return __wbindgen_enum_ReadableStreamType[ret];
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingbytesource_cancel(ptr);
    }
}
if (Symbol.dispose) IntoUnderlyingByteSource.prototype[Symbol.dispose] = IntoUnderlyingByteSource.prototype.free;

const IntoUnderlyingSinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsink_free(ptr >>> 0, 1));

export class IntoUnderlyingSink {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSinkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsink_free(ptr, 0);
    }
    /**
     * @param {any} reason
     * @returns {Promise<any>}
     */
    abort(reason) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_abort(ptr, reason);
        return ret;
    }
    /**
     * @returns {Promise<any>}
     */
    close() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_close(ptr);
        return ret;
    }
    /**
     * @param {any} chunk
     * @returns {Promise<any>}
     */
    write(chunk) {
        const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, chunk);
        return ret;
    }
}
if (Symbol.dispose) IntoUnderlyingSink.prototype[Symbol.dispose] = IntoUnderlyingSink.prototype.free;

const IntoUnderlyingSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsource_free(ptr >>> 0, 1));

export class IntoUnderlyingSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsource_free(ptr, 0);
    }
    /**
     * @param {ReadableStreamDefaultController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingsource_cancel(ptr);
    }
}
if (Symbol.dispose) IntoUnderlyingSource.prototype[Symbol.dispose] = IntoUnderlyingSource.prototype.free;

const QueryContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_querycontext_free(ptr >>> 0, 1));

export class QueryContext {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(QueryContext.prototype);
        obj.__wbg_ptr = ptr;
        QueryContextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QueryContextFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_querycontext_free(ptr, 0);
    }
    /**
     * @returns {any}
     */
    get comIndices() {
        const ret = wasm.querycontext_com_indices(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} effects
     */
    set effects(effects) {
        const ret = wasm.querycontext_set_effects(this.__wbg_ptr, effects);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {VmStack}
     */
    toVmStack() {
        const ret = wasm.querycontext_toVmStack(this.__wbg_ptr);
        return VmStack.__wrap(ret);
    }
    /**
     * @param {any} transcript
     * @param {CostModel} cost_model
     * @returns {QueryContext}
     */
    runTranscript(transcript, cost_model) {
        _assertClass(cost_model, CostModel);
        const ret = wasm.querycontext_runTranscript(this.__wbg_ptr, transcript, cost_model.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QueryContext.__wrap(ret[0]);
    }
    /**
     * @param {string} comm
     * @param {bigint} index
     * @returns {QueryContext}
     */
    insertCommitment(comm, index) {
        const ptr0 = passStringToWasm0(comm, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.querycontext_insertCommitment(this.__wbg_ptr, ptr0, len0, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QueryContext.__wrap(ret[0]);
    }
    /**
     * @param {ChargedState} state
     * @param {string} address
     */
    constructor(state, address) {
        _assertClass(state, ChargedState);
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.querycontext_new(state.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        QueryContextFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get block() {
        const ret = wasm.querycontext_block(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} ops
     * @param {CostModel} cost_model
     * @param {any} gas_limit
     * @returns {QueryResults}
     */
    query(ops, cost_model, gas_limit) {
        _assertClass(cost_model, CostModel);
        const ret = wasm.querycontext_query(this.__wbg_ptr, ops, cost_model.__wbg_ptr, gas_limit);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QueryResults.__wrap(ret[0]);
    }
    /**
     * @returns {ChargedState}
     */
    get state() {
        const ret = wasm.querycontext_state(this.__wbg_ptr);
        return ChargedState.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    get address() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.querycontext_address(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    get effects() {
        const ret = wasm.querycontext_effects(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} coin
     * @returns {any}
     */
    qualify(coin) {
        const ret = wasm.querycontext_qualify(this.__wbg_ptr, coin);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} block
     */
    set block(block) {
        const ret = wasm.querycontext_set_block(this.__wbg_ptr, block);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.querycontext_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) QueryContext.prototype[Symbol.dispose] = QueryContext.prototype.free;

const QueryResultsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_queryresults_free(ptr >>> 0, 1));

export class QueryResults {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(QueryResults.prototype);
        obj.__wbg_ptr = ptr;
        QueryResultsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QueryResultsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_queryresults_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.queryresults_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        QueryResultsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get events() {
        const ret = wasm.queryresults_events(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {QueryContext}
     */
    get context() {
        const ret = wasm.queryresults_context(this.__wbg_ptr);
        return QueryContext.__wrap(ret);
    }
    /**
     * @returns {any}
     */
    get gasCost() {
        const ret = wasm.queryresults_gas_cost(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.queryresults_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) QueryResults.prototype[Symbol.dispose] = QueryResults.prototype.free;

const StateBoundedMerkleTreeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_stateboundedmerkletree_free(ptr >>> 0, 1));

export class StateBoundedMerkleTree {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StateBoundedMerkleTree.prototype);
        obj.__wbg_ptr = ptr;
        StateBoundedMerkleTreeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StateBoundedMerkleTreeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stateboundedmerkletree_free(ptr, 0);
    }
    /**
     * @param {bigint} index
     * @param {any} leaf
     * @returns {any}
     */
    pathForLeaf(index, leaf) {
        const ret = wasm.stateboundedmerkletree_pathForLeaf(this.__wbg_ptr, index, leaf);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} leaf
     * @returns {any}
     */
    findPathForLeaf(leaf) {
        const ret = wasm.stateboundedmerkletree_findPathForLeaf(this.__wbg_ptr, leaf);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    root() {
        const ret = wasm.stateboundedmerkletree_root(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {number} height
     */
    constructor(height) {
        const ret = wasm.stateboundedmerkletree_blank(height);
        this.__wbg_ptr = ret >>> 0;
        StateBoundedMerkleTreeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get height() {
        const ret = wasm.stateboundedmerkletree_height(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {StateBoundedMerkleTree}
     */
    rehash() {
        const ret = wasm.stateboundedmerkletree_rehash(this.__wbg_ptr);
        return StateBoundedMerkleTree.__wrap(ret);
    }
    /**
     * @param {bigint} index
     * @param {any} leaf
     * @returns {StateBoundedMerkleTree}
     */
    update(index, leaf) {
        const ret = wasm.stateboundedmerkletree_update(this.__wbg_ptr, index, leaf);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateBoundedMerkleTree.__wrap(ret[0]);
    }
    /**
     * @param {bigint} start
     * @param {bigint} end
     * @returns {StateBoundedMerkleTree}
     */
    collapse(start, end) {
        const ret = wasm.stateboundedmerkletree_collapse(this.__wbg_ptr, start, end);
        return StateBoundedMerkleTree.__wrap(ret);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.stateboundedmerkletree_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) StateBoundedMerkleTree.prototype[Symbol.dispose] = StateBoundedMerkleTree.prototype.free;

const StateMapFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_statemap_free(ptr >>> 0, 1));

export class StateMap {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StateMap.prototype);
        obj.__wbg_ptr = ptr;
        StateMapFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StateMapFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_statemap_free(ptr, 0);
    }
    /**
     * @param {any} key
     * @returns {StateValue | undefined}
     */
    get(key) {
        const ret = wasm.statemap_get(this.__wbg_ptr, key);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : StateValue.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.statemap_new();
        this.__wbg_ptr = ret >>> 0;
        StateMapFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any[]}
     */
    keys() {
        const ret = wasm.statemap_keys(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {any} key
     * @param {StateValue} value
     * @returns {StateMap}
     */
    insert(key, value) {
        _assertClass(value, StateValue);
        const ret = wasm.statemap_insert(this.__wbg_ptr, key, value.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateMap.__wrap(ret[0]);
    }
    /**
     * @param {any} key
     * @returns {StateMap}
     */
    remove(key) {
        const ret = wasm.statemap_remove(this.__wbg_ptr, key);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateMap.__wrap(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.statemap_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) StateMap.prototype[Symbol.dispose] = StateMap.prototype.free;

const StateValueFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_statevalue_free(ptr >>> 0, 1));

export class StateValue {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StateValue.prototype);
        obj.__wbg_ptr = ptr;
        StateValueFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StateValueFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_statevalue_free(ptr, 0);
    }
    /**
     * @param {StateValue} value
     * @returns {StateValue}
     */
    arrayPush(value) {
        _assertClass(value, StateValue);
        const ret = wasm.statevalue_arrayPush(this.__wbg_ptr, value.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @returns {StateBoundedMerkleTree | undefined}
     */
    asBoundedMerkleTree() {
        const ret = wasm.statevalue_asBoundedMerkleTree(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : StateBoundedMerkleTree.__wrap(ret[0]);
    }
    /**
     * @param {StateBoundedMerkleTree} tree
     * @returns {StateValue}
     */
    static newBoundedMerkleTree(tree) {
        _assertClass(tree, StateBoundedMerkleTree);
        const ret = wasm.statevalue_newBoundedMerkleTree(tree.__wbg_ptr);
        return StateValue.__wrap(ret);
    }
    constructor() {
        const ret = wasm.statevalue_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        StateValueFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.statevalue_type(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {StateMap | undefined}
     */
    asMap() {
        const ret = wasm.statevalue_asMap(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : StateMap.__wrap(ret[0]);
    }
    /**
     * @param {any} value
     * @returns {StateValue}
     */
    static decode(value) {
        const ret = wasm.statevalue_decode(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    encode() {
        const ret = wasm.statevalue_encode(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    asCell() {
        const ret = wasm.statevalue_asCell(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {StateMap} map
     * @returns {StateValue}
     */
    static newMap(map) {
        _assertClass(map, StateMap);
        const ret = wasm.statevalue_newMap(map.__wbg_ptr);
        return StateValue.__wrap(ret);
    }
    /**
     * @returns {any[] | undefined}
     */
    asArray() {
        const ret = wasm.statevalue_asArray(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * @returns {number}
     */
    logSize() {
        const ret = wasm.statevalue_logSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {any} value
     * @returns {StateValue}
     */
    static newCell(value) {
        const ret = wasm.statevalue_newCell(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @returns {StateValue}
     */
    static newNull() {
        const ret = wasm.statevalue_newNull();
        return StateValue.__wrap(ret);
    }
    /**
     * @returns {StateValue}
     */
    static newArray() {
        const ret = wasm.statevalue_newArray();
        return StateValue.__wrap(ret);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.statevalue_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) StateValue.prototype[Symbol.dispose] = StateValue.prototype.free;

const VmResultsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vmresults_free(ptr >>> 0, 1));

export class VmResults {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VmResults.prototype);
        obj.__wbg_ptr = ptr;
        VmResultsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VmResultsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vmresults_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.vmresults_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @returns {VmStack}
     */
    get stack() {
        const ret = wasm.vmresults_stack(this.__wbg_ptr);
        return VmStack.__wrap(ret);
    }
    /**
     * @returns {any}
     */
    get events() {
        const ret = wasm.vmresults_events(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    get gasCost() {
        const ret = wasm.vmresults_gas_cost(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.vmresults_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) VmResults.prototype[Symbol.dispose] = VmResults.prototype.free;

const VmStackFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vmstack_free(ptr >>> 0, 1));

export class VmStack {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VmStack.prototype);
        obj.__wbg_ptr = ptr;
        VmStackFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VmStackFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vmstack_free(ptr, 0);
    }
    removeLast() {
        wasm.vmstack_removeLast(this.__wbg_ptr);
    }
    /**
     * @param {number} idx
     * @returns {StateValue | undefined}
     */
    get(idx) {
        const ret = wasm.vmstack_get(this.__wbg_ptr, idx);
        return ret === 0 ? undefined : StateValue.__wrap(ret);
    }
    constructor() {
        const ret = wasm.vmstack_new();
        this.__wbg_ptr = ret >>> 0;
        VmStackFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {StateValue} value
     * @param {boolean} is_strong
     */
    push(value, is_strong) {
        _assertClass(value, StateValue);
        wasm.vmstack_push(this.__wbg_ptr, value.__wbg_ptr, is_strong);
    }
    /**
     * @returns {number}
     */
    length() {
        const ret = wasm.vmstack_length(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} idx
     * @returns {boolean | undefined}
     */
    isStrong(idx) {
        const ret = wasm.vmstack_isStrong(this.__wbg_ptr, idx);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.vmstack_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) VmStack.prototype[Symbol.dispose] = VmStack.prototype.free;

export function __wbg_BigInt_40a77d45cca49470() { return handleError(function (arg0) {
    const ret = BigInt(arg0);
    return ret;
}, arguments) };

export function __wbg_BigInt_6adbfd8eb0f7ec07(arg0) {
    const ret = BigInt(arg0);
    return ret;
};

export function __wbg_Error_e17e777aac105295(arg0, arg1) {
    const ret = Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_Number_998bea33bd87c3e0(arg0) {
    const ret = Number(arg0);
    return ret;
};

export function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_buffer_8d40b1d762fb3c66(arg0) {
    const ret = arg0.buffer;
    return ret;
};

export function __wbg_byobRequest_2c036bceca1e6037(arg0) {
    const ret = arg0.byobRequest;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_byteLength_331a6b5545834024(arg0) {
    const ret = arg0.byteLength;
    return ret;
};

export function __wbg_byteOffset_49a5b5608000358b(arg0) {
    const ret = arg0.byteOffset;
    return ret;
};

export function __wbg_call_13410aac570ffff7() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_call_a5400b25a865cfd8() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_close_cccada6053ee3a65() { return handleError(function (arg0) {
    arg0.close();
}, arguments) };

export function __wbg_close_d71a78219dc23e91() { return handleError(function (arg0) {
    arg0.close();
}, arguments) };

export function __wbg_contractstate_new(arg0) {
    const ret = ContractState.__wrap(arg0);
    return ret;
};

export function __wbg_crypto_86f2631e91b51511(arg0) {
    const ret = arg0.crypto;
    return ret;
};

export function __wbg_done_75ed0ee6dd243d9d(arg0) {
    const ret = arg0.done;
    return ret;
};

export function __wbg_enqueue_452bc2343d1c2ff9() { return handleError(function (arg0, arg1) {
    arg0.enqueue(arg1);
}, arguments) };

export function __wbg_entries_2be2f15bd5554996(arg0) {
    const ret = Object.entries(arg0);
    return ret;
};

export function __wbg_from_88bc52ce20ba6318(arg0) {
    const ret = Array.from(arg0);
    return ret;
};

export function __wbg_getRandomValues_b3f15fcbfabb0f8b() { return handleError(function (arg0, arg1) {
    arg0.getRandomValues(arg1);
}, arguments) };

export function __wbg_get_0da715ceaecea5c8(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

export function __wbg_get_458e874b43b18b25() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_get_5ee3191755594360(arg0, arg1) {
    const ret = arg0.get(arg1);
    return ret;
};

export function __wbg_getwithrefkey_1dc361bd10053bfe(arg0, arg1) {
    const ret = arg0[arg1];
    return ret;
};

export function __wbg_instanceof_ArrayBuffer_67f3012529f6a2dd(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Map_ebb01a5b6b5ffd0b(arg0) {
    let result;
    try {
        result = arg0 instanceof Map;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Uint8Array_9a8378d955933db7(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_isArray_030cce220591fb41(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
};

export function __wbg_isSafeInteger_1c0d1af5542e102a(arg0) {
    const ret = Number.isSafeInteger(arg0);
    return ret;
};

export function __wbg_iterator_f370b34483c71a1c() {
    const ret = Symbol.iterator;
    return ret;
};

export function __wbg_keys_822161a7faf55538(arg0) {
    const ret = arg0.keys();
    return ret;
};

export function __wbg_length_186546c51cd61acd(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_6bb7e81f9d7713e4(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_msCrypto_d562bbe83e0d4b91(arg0) {
    const ret = arg0.msCrypto;
    return ret;
};

export function __wbg_new_19c25a3f2fa63a02() {
    const ret = new Object();
    return ret;
};

export function __wbg_new_1f3a344cf3123716() {
    const ret = new Array();
    return ret;
};

export function __wbg_new_2e3c58a15f39f5f9(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_258(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return ret;
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_new_2ff1f68f3676ea53() {
    const ret = new Map();
    return ret;
};

export function __wbg_new_638ebfaedbf32a5e(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

export function __wbg_new_da9dc54c5db29dfa(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_newfromslice_074c56947bd43469(arg0, arg1) {
    const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_newnoargs_254190557c45b4ec(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_e8f53910b4d42b45(arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_newwithlength_a167dcc7aaa3ba77(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
};

export function __wbg_next_5b3530e612fde77d(arg0) {
    const ret = arg0.next;
    return ret;
};

export function __wbg_next_692e82279131b03c() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments) };

export function __wbg_node_e1f24f89a7336c2e(arg0) {
    const ret = arg0.node;
    return ret;
};

export function __wbg_process_3975fd6c72f520aa(arg0) {
    const ret = arg0.process;
    return ret;
};

export function __wbg_prototypesetcall_3d4a26c1ed734349(arg0, arg1, arg2) {
    Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
};

export function __wbg_push_330b2eb93e4e1212(arg0, arg1) {
    const ret = arg0.push(arg1);
    return ret;
};

export function __wbg_queueMicrotask_25d0739ac89e8c88(arg0) {
    queueMicrotask(arg0);
};

export function __wbg_queueMicrotask_4488407636f5bf24(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
};

export function __wbg_randomFillSync_f8c153b79f285817() { return handleError(function (arg0, arg1) {
    arg0.randomFillSync(arg1);
}, arguments) };

export function __wbg_require_b74f47fc2d022fd6() { return handleError(function () {
    const ret = module.require;
    return ret;
}, arguments) };

export function __wbg_resolve_4055c623acdd6a1b(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
};

export function __wbg_respond_6c2c4e20ef85138e() { return handleError(function (arg0, arg1) {
    arg0.respond(arg1 >>> 0);
}, arguments) };

export function __wbg_set_1353b2a5e96bc48c(arg0, arg1, arg2) {
    arg0.set(getArrayU8FromWasm0(arg1, arg2));
};

export function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
};

export function __wbg_set_90f6c0f7bd8c0415(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
};

export function __wbg_set_b7f1cf4fae26fe2a(arg0, arg1, arg2) {
    const ret = arg0.set(arg1, arg2);
    return ret;
};

export function __wbg_statevalue_new(arg0) {
    const ret = StateValue.__wrap(arg0);
    return ret;
};

export function __wbg_static_accessor_GLOBAL_8921f820c2ce3f12() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_f0a4409105898184() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_SELF_995b214ae681ff99() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_WINDOW_cde3890479c675ea() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_subarray_70fd07feefe14294(arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_then_e22500defe16819f(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
};

export function __wbg_toString_7268338f40012a03() { return handleError(function (arg0, arg1) {
    const ret = arg0.toString(arg1);
    return ret;
}, arguments) };

export function __wbg_toString_d8f537919ef401d6(arg0) {
    const ret = arg0.toString();
    return ret;
};

export function __wbg_value_dd9372230531eade(arg0) {
    const ret = arg0.value;
    return ret;
};

export function __wbg_versions_4e31226f5e8dc909(arg0) {
    const ret = arg0.versions;
    return ret;
};

export function __wbg_view_91cc97d57ab30530(arg0) {
    const ret = arg0.view;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_wbindgenbigintgetasi64_ac743ece6ab9bba1(arg0, arg1) {
    const v = arg1;
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbg_wbindgenbooleanget_3fe6f642c7d97746(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? v : undefined;
    return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
};

export function __wbg_wbindgencbdrop_eb10308566512b88(arg0) {
    const obj = arg0.original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

export function __wbg_wbindgendebugstring_99ef257a3ddda34d(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_wbindgenin_d7a1ee10933d2d55(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
};

export function __wbg_wbindgenisbigint_ecb90cc08a5a9154(arg0) {
    const ret = typeof(arg0) === 'bigint';
    return ret;
};

export function __wbg_wbindgenisfunction_8cee7dce3725ae74(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};

export function __wbg_wbindgenisnull_f3037694abe4d97a(arg0) {
    const ret = arg0 === null;
    return ret;
};

export function __wbg_wbindgenisobject_307a53c6bd97fbf8(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbg_wbindgenisstring_d4fa939789f003b0(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
};

export function __wbg_wbindgenisundefined_c4b71d073b92f3c5(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbg_wbindgenjsvaleq_e6f2ad59ccae1b58(arg0, arg1) {
    const ret = arg0 === arg1;
    return ret;
};

export function __wbg_wbindgenjsvallooseeq_9bec8c9be826bed1(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
};

export function __wbg_wbindgennumberget_f74b4c7525ac05cb(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbg_wbindgenshr_7d2aae6044c0dab1(arg0, arg1) {
    const ret = arg0 >> arg1;
    return ret;
};

export function __wbg_wbindgenstringget_0f16a6ddddef376f(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_wbindgenthrow_451ec1a8469d7eb6(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_cast_2241b6af4c4b2941(arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_cast_4625c577ab2ec9ee(arg0) {
    // Cast intrinsic for `U64 -> Externref`.
    const ret = BigInt.asUintN(64, arg0);
    return ret;
};

export function __wbindgen_cast_9ae0607507abb057(arg0) {
    // Cast intrinsic for `I64 -> Externref`.
    const ret = arg0;
    return ret;
};

export function __wbindgen_cast_9f23747c70687cbf(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 689, function: Function { arguments: [Externref], shim_idx: 690, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, 689, __wbg_adapter_14);
    return ret;
};

export function __wbindgen_cast_cb9088102bce6b30(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
    const ret = getArrayU8FromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_cast_d6cd19b81560fd6e(arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return ret;
};

export function __wbindgen_cast_e7b45dd881f38ce3(arg0, arg1) {
    // Cast intrinsic for `U128 -> Externref`.
    const ret = (BigInt.asUintN(64, arg0) | (BigInt.asUintN(64, arg1) << BigInt(64)));
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_2;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

