import { api } from './api';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED';
  creatorId: string;
  reservedCount?: number;
}

export interface CreateEventDto {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

export type UpdateEventDto = Partial<CreateEventDto>;

export const eventsService = {
  create: async (data: CreateEventDto): Promise<Event> => {
    return api.post<Event>('/events', data);
  },

  findAllPublished: async (): Promise<Event[]> => {
    return api.get<Event[]>('/events');
  },

  findAllAdmin: async (): Promise<Event[]> => {
    return api.get<Event[]>('/events/admin');
  },

  findUpcoming: async (): Promise<Event[]> => {
    return api.get<Event[]>('/events/upcoming');
  },

  findOne: async (id: string): Promise<Event> => {
    return api.get<Event>(`/events/${id}`);
  },

  update: async (id: string, data: UpdateEventDto): Promise<Event> => {
    return api.put<Event>(`/events/${id}`, data);
  },

  updateStatus: async (id: string, status: Event['status']): Promise<Event> => {
    return api.patch<Event>(`/events/${id}/status`, { status });
  },

  getStats: async (id: string): Promise<unknown> => {
    return api.get<unknown>(`/events/${id}/stats`);
  },
};
