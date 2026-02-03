export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELED = 'CANCELED',
}

export class Event {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly date: Date,
    public readonly location: string,
    public readonly status: EventStatus = EventStatus.DRAFT,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
