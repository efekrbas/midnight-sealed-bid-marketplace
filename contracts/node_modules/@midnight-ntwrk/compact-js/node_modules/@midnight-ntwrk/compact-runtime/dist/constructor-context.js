// This file is part of Compact.
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// 	http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { emptyZswapLocalState } from './zswap.js';
/**
 * Creates a new {@link ConstructorContext} with the given initial private state and an empty Zswap local state.
 *
 * @param initialPrivateState The private state to use to execute the contract's constructor.
 * @param coinPublicKey The Zswap coin public key of the user executing the contract.
 */
export const createConstructorContext = (initialPrivateState, coinPublicKey) => ({
    initialPrivateState,
    initialZswapLocalState: emptyZswapLocalState(coinPublicKey),
});
//# sourceMappingURL=constructor-context.js.map