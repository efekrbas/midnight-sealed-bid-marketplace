/*
 * This file is part of midnight-sdk.
 * Copyright (C) 2025 Midnight Foundation
 * SPDX-License-Identifier: Apache-2.0
 * Licensed under the Apache License, Version 2.0 (the "License");
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { dual } from 'effect/Function';
import { pipeArguments } from 'effect/Pipeable';
import * as CompactContextInternal from './internal/compactContext.js';
export const TypeId = Symbol.for('compact-js/CompiledContract');
const CompiledContractProto = {
    [TypeId]: {
        _C: (_) => _,
        _PS: (_) => _,
        _R: (_) => _
    },
    pipe() {
        return pipeArguments(this, arguments); // eslint-disable-line prefer-rest-params
    }
};
/**
 * Initializes an object that represents a binding to a Compact compiled contract.
 *
 * @param tag A unique identifier that represents this type of contract.
 * @param ctor The contract constructor, as imported from the compiled Compact output.
 * @returns A {@link CompiledContract}.
 *
 * @category constructors
 */
export const make = (tag, ctor) => {
    const self = Object.create(CompiledContractProto);
    self.tag = tag;
    self[CompactContextInternal.TypeId] = { ctor };
    return self;
};
/**
 * Associates an object that implements the contract witnesses for the Compact compiled contract.
 *
 * @category combinators
 */
export const withWitnesses = dual(2, (self, witnesses) => {
    return {
        ...self,
        [CompactContextInternal.TypeId]: {
            ...self[CompactContextInternal.TypeId],
            witnesses
        }
    };
});
/**
 * Associates _vacant_ witnesses with a Compact compiled contract that specifies no witnesses.
 *
 * @param self The {@link CompiledContract} for which no witnesses are required.
 *
 * @category combinators
 */
export const withVacantWitnesses = (self) => {
    return {
        ...self,
        [CompactContextInternal.TypeId]: {
            ...self[CompactContextInternal.TypeId],
            witnesses: {}
        }
    };
};
/**
 * Associates a file path of where to find the compiled assets for the Compact compiled contract.
 *
 * @remarks
 * Relative file paths will be resolved relative to the base paths provided to each service that accesses
 * the compiled file assets.
 *
 * @category combinators
 */
export const withCompiledFileAssets = dual(2, (self, compiledAssetsPath) => {
    return {
        ...self,
        [CompactContextInternal.TypeId]: {
            ...self[CompactContextInternal.TypeId],
            compiledAssetsPath
        }
    };
});
/**
 * Retrieves a path to file based assets associated with a compiled contract.
 *
 * @param self The {@link CompiledContract} from which the assets path should be retrieved.
 * @returns A string representing a path to the file assets configured for `self`.
 */
export const getCompiledAssetsPath = (self) => {
    const context = CompactContextInternal.getContractContext(self);
    return context.compiledAssetsPath;
};
//# sourceMappingURL=CompiledContract.js.map