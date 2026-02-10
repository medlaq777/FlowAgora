import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParticipantReservationAction from '@/components/ParticipantReservationAction';
import { reservationsService } from '@/services/reservations.service';

// Mock dependencies
jest.mock('@/services/reservations.service');

jest.mock('@/context/ToastContext', () => ({
    useToast: jest.fn(() => ({
        success: jest.fn(),
        error: jest.fn(),
    })),
}));

// Mock window.confirm
global.confirm = jest.fn();

describe('Cancellation Flow - Functional Tests', () => {
    const mockOnUpdate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (global.confirm as jest.Mock).mockReturnValue(true);
    });

    it('should complete cancellation flow: view → cancel → confirm → cancelled', async () => {
        const user = userEvent.setup();

        // Step 1: User has a PENDING reservation
        render(
            <ParticipantReservationAction
                id="res123"
                onUpdate={mockOnUpdate}
                status="PENDING"
            />
        );

        // Step 2: User sees cancel button
        expect(screen.getByText(/cancel/i)).toBeInTheDocument();

        // Step 3: User clicks cancel
        const cancelButton = screen.getByText(/cancel/i);
        await user.click(cancelButton);

        // Step 4: Confirmation dialog appears
        expect(global.confirm).toHaveBeenCalled();

        // Step 5: Reservation is cancelled
        (reservationsService.cancel as jest.Mock).mockResolvedValue({});

        await waitFor(() => {
            expect(reservationsService.cancel).toHaveBeenCalledWith('res123');
            expect(mockOnUpdate).toHaveBeenCalled();
        });
    });

    it('should cancel CONFIRMED reservation', async () => {
        const user = userEvent.setup();
        (reservationsService.cancel as jest.Mock).mockResolvedValue({});

        render(
            <ParticipantReservationAction
                id="res123"
                onUpdate={mockOnUpdate}
                status="CONFIRMED"
            />
        );

        // Both download and cancel should be visible
        expect(screen.getByText(/download ticket/i)).toBeInTheDocument();
        expect(screen.getByText(/cancel/i)).toBeInTheDocument();

        const cancelButton = screen.getByText(/cancel/i);
        await user.click(cancelButton);

        await waitFor(() => {
            expect(reservationsService.cancel).toHaveBeenCalled();
            expect(mockOnUpdate).toHaveBeenCalled();
        });
    });

    it('should not cancel when user declines confirmation', async () => {
        const user = userEvent.setup();
        (global.confirm as jest.Mock).mockReturnValue(false);

        render(
            <ParticipantReservationAction
                id="res123"
                onUpdate={mockOnUpdate}
                status="PENDING"
            />
        );

        const cancelButton = screen.getByText(/cancel/i);
        await user.click(cancelButton);

        expect(global.confirm).toHaveBeenCalled();
        expect(reservationsService.cancel).not.toHaveBeenCalled();
    });

    it('should handle cancellation errors', async () => {
        const user = userEvent.setup();
        (reservationsService.cancel as jest.Mock).mockRejectedValue(
            new Error('Network error')
        );

        render(
            <ParticipantReservationAction
                id="res123"
                onUpdate={mockOnUpdate}
                status="PENDING"
            />
        );

        const cancelButton = screen.getByText(/cancel/i);
        await user.click(cancelButton);

        await waitFor(() => {
            expect(reservationsService.cancel).toHaveBeenCalled();
            expect(mockOnUpdate).not.toHaveBeenCalled();
        });
    });

    it('should show loading state during cancellation', async () => {
        const user = userEvent.setup();
        (reservationsService.cancel as jest.Mock).mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 100))
        );

        render(
            <ParticipantReservationAction
                id="res123"
                onUpdate={mockOnUpdate}
                status="PENDING"
            />
        );

        const cancelButton = screen.getByText(/cancel/i);
        await user.click(cancelButton);

        expect(screen.getByText(/canceling/i)).toBeInTheDocument();
    });

    it('should not show cancel for CANCELED status', () => {
        render(
            <ParticipantReservationAction
                id="res123"
                onUpdate={mockOnUpdate}
                status="CANCELED"
            />
        );

        expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
    });

    it('should not show cancel for REFUSED status', () => {
        render(
            <ParticipantReservationAction
                id="res123"
                onUpdate={mockOnUpdate}
                status="REFUSED"
            />
        );

        expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
    });
});
