import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReserveButton from '../ReserveButton';
import { reservationsService } from '@/services/reservations.service';

// Mock dependencies
jest.mock('@/services/reservations.service');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/context/ToastContext', () => ({
    useToast: jest.fn(() => ({
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    })),
}));

const { useAuth } = require('@/context/AuthContext');

describe('ReserveButton Component Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Component Rendering', () => {
        it('should render reserve button when user can reserve', async () => {
            useAuth.mockReturnValue({ isAuthenticated: true });
            (reservationsService.findAllMine as jest.Mock).mockResolvedValue([]);

            const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

            await waitFor(() => {
                expect(container.textContent).toMatch(/reserve your spot/i);
            });
        });

        it('should show sold out when event is full', async () => {
            useAuth.mockReturnValue({ isAuthenticated: true });
            (reservationsService.findAllMine as jest.Mock).mockResolvedValue([]);

            const { container } = render(<ReserveButton eventId="event123" isFull={true} canReserve={false} />);

            await waitFor(() => {
                expect(container.textContent).toMatch(/sold out/i);
            });
        });

        it('should show unavailable when cannot reserve', async () => {
            useAuth.mockReturnValue({ isAuthenticated: true });
            (reservationsService.findAllMine as jest.Mock).mockResolvedValue([]);

            const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={false} />);

            await waitFor(() => {
                expect(container.textContent).toMatch(/unavailable/i);
            });
        });
    });

    describe('Reservation Status Display', () => {
        it('should show pending status for pending reservation', async () => {
            useAuth.mockReturnValue({ isAuthenticated: true });
            (reservationsService.findAllMine as jest.Mock).mockResolvedValue([
                { eventId: 'event123', status: 'PENDING' },
            ]);

            const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

            await waitFor(() => {
                expect(container.textContent).toMatch(/pending approval/i);
            });
        });

        it('should show confirmed status for confirmed reservation', async () => {
            useAuth.mockReturnValue({ isAuthenticated: true });
            (reservationsService.findAllMine as jest.Mock).mockResolvedValue([
                { eventId: 'event123', status: 'CONFIRMED' },
            ]);

            const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

            await waitFor(() => {
                expect(container.textContent).toMatch(/confirmed/i);
            });
        });

        it('should show refused status for refused reservation', async () => {
            useAuth.mockReturnValue({ isAuthenticated: true });
            (reservationsService.findAllMine as jest.Mock).mockResolvedValue([
                { eventId: 'event123', status: 'REFUSED' },
            ]);

            const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

            await waitFor(() => {
                expect(container.textContent).toMatch(/declined/i);
            });
        });

        it('should show canceled status for canceled reservation', async () => {
            useAuth.mockReturnValue({ isAuthenticated: true });
            (reservationsService.findAllMine as jest.Mock).mockResolvedValue([
                { eventId: 'event123', status: 'CANCELED' },
            ]);

            const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

            await waitFor(() => {
                expect(container.textContent).toMatch(/cancelled/i);
            });
        });
    });

    describe('User Interactions', () => {
        it('should call create reservation on button click', async () => {
            const user = userEvent.setup();
            useAuth.mockReturnValue({ isAuthenticated: true });
            (reservationsService.findAllMine as jest.Mock).mockResolvedValue([]);
            (reservationsService.create as jest.Mock).mockResolvedValue({
                _id: 'res123',
                eventId: 'event123',
                status: 'PENDING',
            });

            const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

            await waitFor(() => {
                expect(container.textContent).toMatch(/reserve your spot/i);
            });

            const button = screen.getByRole('button', { name: /reserve/i });
            await user.click(button);

            await waitFor(() => {
                expect(reservationsService.create).toHaveBeenCalledWith({ eventId: 'event123' });
            });
        });

        it('should show loading state during reservation', async () => {
            const user = userEvent.setup();
            useAuth.mockReturnValue({ isAuthenticated: true });
            (reservationsService.findAllMine as jest.Mock).mockResolvedValue([]);
            (reservationsService.create as jest.Mock).mockImplementation(
                () => new Promise((resolve) => setTimeout(resolve, 100))
            );

            const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

            await waitFor(() => {
                expect(container.textContent).toMatch(/reserve your spot/i);
            });

            const button = screen.getByRole('button', { name: /reserve/i });
            await user.click(button);

            await waitFor(() => {
                expect(container.textContent).toMatch(/reserving/i);
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle reservation check error', async () => {
            useAuth.mockReturnValue({ isAuthenticated: true });
            (reservationsService.findAllMine as jest.Mock).mockRejectedValue(
                new Error('Network error')
            );

            const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

            await waitFor(() => {
                expect(container.textContent).toMatch(/reserve your spot/i);
            });
        });
    });
});
