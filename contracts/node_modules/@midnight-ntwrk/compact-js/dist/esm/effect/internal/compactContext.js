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
import { Effect } from 'effect';
/** @internal */
export const TypeId = Symbol();
/** @internal */
export const getContractContext = (compiledContract) => compiledContract[TypeId];
/** @internal */
export const createContract = (compiledContract) => Effect.sync(() => {
    const context = getContractContext(compiledContract);
    if (!context.ctor)
        throw new Error('Invalid CompactContext (missing constructor)');
    return new context.ctor(context.witnesses);
});
//# sourceMappingURL=compactContext.js.map