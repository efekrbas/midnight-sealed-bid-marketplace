export async function detectWallet(): Promise<any> {
  // Gracefully fallback or detect Lace, 1AM, or other compatible Midnight injected wallets
  const midnightObj = (window as any).midnight;
  if (!midnightObj) throw new Error('No Midnight wallet detected. Please install a compatible wallet.');
  
  const w = midnightObj.lace || midnightObj['1am'] || Object.values(midnightObj)[0];
  if (!w) throw new Error('No compatible Midnight wallet provider found.');
  return w;
}

export function fromHex(hex: string): Uint8Array {
  const h = hex.startsWith('0x') ? hex.slice(2) : hex;
  return Uint8Array.from(h.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
}

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
