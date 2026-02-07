export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELED = 'CANCELED',
}

export interface Event {
  _id: string; // MongoDB ID is usually _id
  title: string;
  description: string;
  date: string; // Date comes as string from JSON
  location: string;
  capacity: number;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  reservedCount?: number;
}
