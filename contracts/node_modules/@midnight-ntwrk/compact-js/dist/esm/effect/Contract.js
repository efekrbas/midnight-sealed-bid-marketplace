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
import { Brand } from 'effect';
export const VerifierKey = Brand.nominal();
export const ZKIR = Brand.nominal();
const ProvableCircuitId_ = Brand.nominal();
export const ProvableCircuitId = (id) => ProvableCircuitId_(id);
export const getProvableCircuitIds = (contract) => Object.keys(contract.provableCircuits).map(ProvableCircuitId);
//# sourceMappingURL=Contract.js.map