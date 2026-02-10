import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReserveButton from '@/components/ReserveButton';
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

describe('Reservation Flow - Functional Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should complete reservation flow: browse → reserve → pending', async () => {
        const user = userEvent.setup();
        const eventId = 'event123';

        // Step 1: User is authenticated and can reserve
        useAuth.mockReturnValue({ isAuthenticated: true });
        (reservationsService.findAllMine as jest.Mock).mockResolvedValue([]);

        const { container } = render(<ReserveButton eventId={eventId} isFull={false} canReserve={true} />);

        // Step 2: User sees reserve button
        await waitFor(() => {
            expect(container.textContent).toMatch(/reserve your spot/i);
        });

        // Step 3: User clicks reserve
        (reservationsService.create as jest.Mock).mockResolvedValue({
            _id: 'res123',
            eventId: eventId,
            status: 'PENDING',
        });

        const reserveButton = screen.getByRole('button', { name: /reserve/i });
        await user.click(reserveButton);

        // Step 4: Reservation is created
        await waitFor(() => {
            expect(reservationsService.create).toHaveBeenCalledWith({ eventId });
        });
    });

    it('should show pending status after reservation', async () => {
        useAuth.mockReturnValue({ isAuthenticated: true });
        (reservationsService.findAllMine as jest.Mock).mockResolvedValue([
            { eventId: 'event123', status: 'PENDING' },
        ]);

        const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

        await waitFor(() => {
            expect(container.textContent).toMatch(/pending approval/i);
        });
    });

    it('should show confirmed status when admin confirms', async () => {
        useAuth.mockReturnValue({ isAuthenticated: true });
        (reservationsService.findAllMine as jest.Mock).mockResolvedValue([
            { eventId: 'event123', status: 'CONFIRMED' },
        ]);

        const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

        await waitFor(() => {
            expect(container.textContent).toMatch(/confirmed/i);
        });
    });

    it('should prevent reservation when event is full', async () => {
        useAuth.mockReturnValue({ isAuthenticated: true });
        (reservationsService.findAllMine as jest.Mock).mockResolvedValue([]);

        const { container } = render(<ReserveButton eventId="event123" isFull={true} canReserve={false} />);

        await waitFor(() => {
            expect(container.textContent).toMatch(/sold out/i);
        });
    });

    it('should prevent duplicate reservations', async () => {
        useAuth.mockReturnValue({ isAuthenticated: true });
        (reservationsService.findAllMine as jest.Mock).mockResolvedValue([
            { eventId: 'event123', status: 'PENDING' },
        ]);

        const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

        await waitFor(() => {
            expect(container.textContent).toMatch(/pending approval/i);
        });

        // Reserve button should not be visible
        expect(container.textContent).not.toMatch(/reserve your spot/i);
    });

    it('should handle reservation errors', async () => {
        const user = userEvent.setup();
        useAuth.mockReturnValue({ isAuthenticated: true });
        (reservationsService.findAllMine as jest.Mock).mockResolvedValue([]);
        (reservationsService.create as jest.Mock).mockRejectedValue(
            new Error('Event capacity reached')
        );

        const { container } = render(<ReserveButton eventId="event123" isFull={false} canReserve={true} />);

        await waitFor(() => {
            expect(container.textContent).toMatch(/reserve your spot/i);
        });

        const reserveButton = screen.getByRole('button', { name: /reserve/i });
        await user.click(reserveButton);

        await waitFor(() => {
            expect(reservationsService.create).toHaveBeenCalled();
        });
    });

    it('should show all reservation statuses correctly', async () => {
        useAuth.mockReturnValue({ isAuthenticated: true });

        // Test PENDING
        (reservationsService.findAllMine as jest.Mock).mockResolvedValue([
            { eventId: 'event123', status: 'PENDING' },
        ]);

        const { container, rerender, unmount } = render(
            <ReserveButton eventId="event123" isFull={false} canReserve={true} />
        );

        await waitFor(() => {
            expect(container.textContent).toMatch(/pending approval/i);
        });

        unmount();

        // Test CONFIRMED
        (reservationsService.findAllMine as jest.Mock).mockResolvedValue([
            { eventId: 'event123', status: 'CONFIRMED' },
        ]);

        const { container: container2, unmount: unmount2 } = render(
            <ReserveButton eventId="event123" isFull={false} canReserve={true} />
        );

        await waitFor(() => {
            expect(container2.textContent).toMatch(/confirmed/i);
        });

        unmount2();

        // Test REFUSED
        (reservationsService.findAllMine as jest.Mock).mockResolvedValue([
            { eventId: 'event123', status: 'REFUSED' },
        ]);

        const { container: container3, unmount: unmount3 } = render(
            <ReserveButton eventId="event123" isFull={false} canReserve={true} />
        );

        await waitFor(() => {
            expect(container3.textContent).toMatch(/declined/i);
        });

        unmount3();

        // Test CANCELED
        (reservationsService.findAllMine as jest.Mock).mockResolvedValue([
            { eventId: 'event123', status: 'CANCELED' },
        ]);

        const { container: container4 } = render(
            <ReserveButton eventId="event123" isFull={false} canReserve={true} />
        );

        await waitFor(() => {
            expect(container4.textContent).toMatch(/cancelled/i);
        });
    });
});
