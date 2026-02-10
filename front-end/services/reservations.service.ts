import { api } from './api';
import { Event } from './events.service';

export interface Reservation {
  _id: string;
  userId: string;
  eventId: Event;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'REFUSED';
  createdAt: string;
}

export interface CreateReservationDto {
  eventId: string;
}

export const reservationsService = {
  create: async (data: CreateReservationDto): Promise<Reservation> => {
    return api.post<Reservation>('/reservations', data);
  },

  updateStatus: async (id: string, status: Reservation['status']): Promise<Reservation> => {
    return api.patch<Reservation>(`/reservations/${id}/status`, { status });
  },

  cancel: async (id: string): Promise<Reservation> => {
    return api.patch<Reservation>(`/reservations/${id}/cancel`, {});
  },

  generateTicket: async (id: string): Promise<Blob> => {
    return api.get<Blob>(`/reservations/${id}/ticket`, { responseType: 'blob' });
  },

  findByEvent: async (eventId: string): Promise<Reservation[]> => {
    return api.get<Reservation[]>(`/reservations/by-event/${eventId}`);
  },

  findAllMine: async (): Promise<Reservation[]> => {
    return api.get<Reservation[]>('/reservations/my-reservations');
  },

  findByUser: async (userId: string): Promise<Reservation[]> => {
    return api.get<Reservation[]>(`/reservations/by-user/${userId}`);
  },
};
