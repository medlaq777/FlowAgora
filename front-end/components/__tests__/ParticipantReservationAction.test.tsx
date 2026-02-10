import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ParticipantReservationAction from '../ParticipantReservationAction';
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
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

describe('ParticipantReservationAction Component Tests', () => {
    const mockOnUpdate = jest.fn();

    beforeAll(() => {
        // Mock DOM methods for file download
        global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
        global.URL.revokeObjectURL = jest.fn();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockConfirm.mockReturnValue(true);
    });

    describe('Component Rendering', () => {
        it('should show download button for CONFIRMED status', () => {
            render(
                <ParticipantReservationAction
                    id="res123"
                    onUpdate={mockOnUpdate}
                    status="CONFIRMED"
                    eventTitle="Test Event"
                />
            );

            expect(screen.getByLabelText(/download ticket/i)).toBeInTheDocument();
        });

        it('should show cancel button for PENDING status', () => {
            render(
                <ParticipantReservationAction
                    id="res123"
                    onUpdate={mockOnUpdate}
                    status="PENDING"
                />
            );

            expect(screen.getByLabelText(/cancel reservation/i)).toBeInTheDocument();
        });

        it('should not show cancel for CANCELED status', () => {
            render(
                <ParticipantReservationAction
                    id="res123"
                    onUpdate={mockOnUpdate}
                    status="CANCELED"
                />
            );

            expect(screen.queryByLabelText(/cancel reservation/i)).not.toBeInTheDocument();
        });

        it('should not show cancel for REFUSED status', () => {
            render(
                <ParticipantReservationAction
                    id="res123"
                    onUpdate={mockOnUpdate}
                    status="REFUSED"
                />
            );

            expect(screen.queryByLabelText(/cancel reservation/i)).not.toBeInTheDocument();
        });
    });

    describe('Cancel Functionality', () => {
        it('should show confirmation dialog on cancel', async () => {
            const user = userEvent.setup();
            render(
                <ParticipantReservationAction
                    id="res123"
                    onUpdate={mockOnUpdate}
                    status="PENDING"
                />
            );

            const cancelButton = screen.getByLabelText(/cancel reservation/i);
            await user.click(cancelButton);

            expect(mockConfirm).toHaveBeenCalled();
        });

        it('should cancel reservation when confirmed', async () => {
            const user = userEvent.setup();
            (reservationsService.cancel as jest.Mock).mockResolvedValue({});

            render(
                <ParticipantReservationAction
                    id="res123"
                    onUpdate={mockOnUpdate}
                    status="PENDING"
                />
            );

            const cancelButton = screen.getByLabelText(/cancel reservation/i);
            await user.click(cancelButton);

            await waitFor(() => {
                expect(reservationsService.cancel).toHaveBeenCalledWith('res123');
                expect(mockOnUpdate).toHaveBeenCalled();
            });
        });

        it('should not cancel when user declines', async () => {
            const user = userEvent.setup();
            mockConfirm.mockReturnValue(false);

            render(
                <ParticipantReservationAction
                    id="res123"
                    onUpdate={mockOnUpdate}
                    status="PENDING"
                />
            );

            const cancelButton = screen.getByLabelText(/cancel reservation/i);
            await user.click(cancelButton);

            expect(mockConfirm).toHaveBeenCalled();
            expect(reservationsService.cancel).not.toHaveBeenCalled();
        });

        it('should show loading state during cancel', async () => {
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

            const cancelButton = screen.getByLabelText(/cancel reservation/i);
            await user.click(cancelButton);

            await waitFor(() => {
                expect(screen.getByText(/canceling/i)).toBeInTheDocument();
            });
        });
    });

    describe('Ticket Download Functionality', () => {
        it('should download ticket on button click', async () => {
            const user = userEvent.setup();
            const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
            (reservationsService.generateTicket as jest.Mock).mockResolvedValue(mockBlob);

            render(
                <ParticipantReservationAction
                    id="res123"
                    onUpdate={mockOnUpdate}
                    status="CONFIRMED"
                    eventTitle="Test Event"
                />
            );

            const downloadButton = screen.getByLabelText(/download ticket/i);
            await user.click(downloadButton);

            await waitFor(() => {
                expect(reservationsService.generateTicket).toHaveBeenCalledWith('res123');
            });
        });

        it('should show loading state during download', async () => {
            const user = userEvent.setup();
            (reservationsService.generateTicket as jest.Mock).mockImplementation(
                () => new Promise((resolve) => setTimeout(resolve, 100))
            );

            render(
                <ParticipantReservationAction
                    id="res123"
                    onUpdate={mockOnUpdate}
                    status="CONFIRMED"
                />
            );

            const downloadButton = screen.getByLabelText(/download ticket/i);
            await user.click(downloadButton);

            await waitFor(() => {
                expect(screen.getByText(/downloading/i)).toBeInTheDocument();
            });
        });
    });
});
