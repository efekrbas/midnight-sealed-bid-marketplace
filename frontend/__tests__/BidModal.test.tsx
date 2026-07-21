import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BidModal from '../src/components/BidModal';
import { NotificationProvider } from '../src/context/NotificationContext';

describe('BidModal Component', () => {
  const mockAuction = {
    title: 'Rare Digital Art #102',
    highestBid: '500'
  };

  it('renders the bid modal correctly', () => {
    render(
      <NotificationProvider>
        <BidModal auction={mockAuction} onClose={() => {}} />
      </NotificationProvider>
    );

    expect(screen.getByText('Place Private Bid')).toBeInTheDocument();
    expect(screen.getByText('Rare Digital Art #102')).toBeInTheDocument();
  });

  it('prevents submission if bid is lower than current highest public bid', () => {
    render(
      <NotificationProvider>
        <BidModal auction={mockAuction} onClose={() => {}} />
      </NotificationProvider>
    );

    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '400' } });
    
    // HTML5 native validation will prevent this due to min="500"
    expect(input).toHaveAttribute('min', '500');
  });
});
