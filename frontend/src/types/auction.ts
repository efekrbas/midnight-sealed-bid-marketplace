export type AuctionStatus = 'Open' | 'Revealing' | 'Ended';

export interface AuctionItem {
  id: string;
  title: string;
  image: string;
  status: AuctionStatus;
  highestBid: string;
  highestBidValue?: number;
  endsInSeconds: number;
  category: string;
  endsIn?: string;
  isCustom?: boolean;
}
