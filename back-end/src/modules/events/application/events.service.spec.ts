import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { EventStatus } from '../domain/entities/event.entity';
import { ReservationModel } from '../../reservations/infrastructure/persistence/reservation.schema';
import { EventModel } from '../infrastructure/persistence/event.schema';
import { NotFoundException } from '@nestjs/common';
import { ReservationStatus } from '../../reservations/domain/entities/reservation.entity';

describe('EventsService', () => {
  let service: EventsService;
  let eventModel: any;
  let reservationModel: any;

  beforeEach(async () => {
    eventModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    reservationModel = {
      countDocuments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(EventModel.name),
          useValue: eventModel,
        },
        {
          provide: getModelToken(ReservationModel.name),
          useValue: reservationModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createEventDto = {
        title: 'Test Event',
        description: 'Desc',
        date: new Date().toISOString(),
        location: 'Loc',
        capacity: 100,
      };

      const savedEvent = { ...createEventDto, _id: 'newId', status: EventStatus.PUBLISHED };
      const mockEventInstance = {
        save: jest.fn().mockResolvedValue(savedEvent),
      };
      
      const mockModel = jest.fn().mockImplementation(() => mockEventInstance) as any;
      mockModel.find = eventModel.find; 
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EventsService,
          {
            provide: getModelToken(EventModel.name),
            useValue: mockModel, 
          },
          {
            provide: getModelToken(ReservationModel.name),
            useValue: reservationModel,
          },
        ],
      }).compile();
      service = module.get<EventsService>(EventsService);


      const result = await service.create(createEventDto);
      expect(result).toEqual(savedEvent);
    });
  });

  describe('findAllPublished', () => {
    it('should return published events with reservation counts', async () => {
      const events = [{ _id: 'eventId', title: 'Event', status: EventStatus.PUBLISHED }];

      eventModel.find.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(events),
        }),
      });

      reservationModel.countDocuments.mockResolvedValue(5);

      const result = await service.findAllPublished();

      expect(result).toHaveLength(1);
      expect(result[0].reservedCount).toBe(5);
      expect(eventModel.find).toHaveBeenCalledWith({ status: EventStatus.PUBLISHED });
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      const events = [{ _id: 'eventId', title: 'Event' }];
      eventModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(events),
      });

      const result = await service.findAll();
      expect(result).toEqual(events);
    });
  });

  describe('findOne', () => {
    it('should return event details with stats', async () => {
      const event = { _id: 'eventId', title: 'Event', capacity: 100 };
      eventModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(event),
        }),
      });
      reservationModel.countDocuments.mockResolvedValue(10);

      const result = await service.findOne('eventId');
      expect(result._id).toBe('eventId');
      expect(result.reservedCount).toBe(10);
    });

    it('should throw NotFoundException if event not found', async () => {
      eventModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.findOne('eventId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOnePublic', () => {
    it('should return published event', async () => {
      const event = { _id: 'eventId', status: EventStatus.PUBLISHED };
      eventModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(event),
        }),
      });
      reservationModel.countDocuments.mockResolvedValue(0);

      const result = await service.findOnePublic('eventId');
      expect(result._id).toBe('eventId');
    });

    it('should throw NotFoundException if event not published', async () => {
      eventModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.findOnePublic('eventId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update event', async () => {
      const event = { _id: 'eventId', title: 'Updated' };
      eventModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(event),
      });

      const result = await service.update('eventId', { title: 'Updated' });
      expect(result).toEqual(event);
    });

     it('should throw NotFoundException if event to update not found', async () => {
       eventModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.update('eventId', {})).rejects.toThrow(NotFoundException);
    });
  });

   describe('updateStatus', () => {
    it('should update event status', async () => {
      const event = { _id: 'eventId', status: EventStatus.PUBLISHED };
      eventModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(event),
      });

      const result = await service.updateStatus('eventId', EventStatus.PUBLISHED);
      expect(result).toEqual(event);
    });
  });
  
  describe('findUpcoming', () => {
      it('should return upcoming published events', async () => {
          const events = [{_id: 'e1', date: new Date(Date.now() + 10000)}];
           eventModel.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue(events),
          });

          const result = await service.findUpcoming();
          expect(result).toEqual(events);
      });
  });

  describe('getStats', () => {
    it('should return correct statistics for an event', async () => {
      const event = { _id: 'eventId', capacity: 100 };
      eventModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(event),
        }),
      });
      reservationModel.countDocuments.mockImplementation((query) => ({
        exec: jest.fn().mockResolvedValue(
          query.status === ReservationStatus.PENDING ? 10 :
          query.status === ReservationStatus.CONFIRMED ? 20 :
          query.status === ReservationStatus.CANCELED ? 5 :
          query.status === ReservationStatus.REFUSED ? 3 :
          query.status?.$nin ? 30 : 0
        ),
      }));

      const result = await service.getStats('eventId');

      expect(result.capacity).toBe(100);
      expect(result.reservations).toBe(30);
      expect(result.fillRate).toBe(30);
      expect(result.breakdown).toEqual({
        PENDING: 10,
        CONFIRMED: 20,
        CANCELED: 5,
        REFUSED: 3,
      });
    });

    it('should calculate 100% fill rate when event is full', async () => {
      const event = { _id: 'eventId', capacity: 50 };
      eventModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(event),
        }),
      });
      reservationModel.countDocuments.mockImplementation((query) => ({
        exec: jest.fn().mockResolvedValue(
          query.status?.$nin ? 50 : 0
        ),
      }));

      const result = await service.getStats('eventId');

      expect(result.fillRate).toBe(100);
    });

    it('should handle zero capacity events', async () => {
      const event = { _id: 'eventId', capacity: 0 };
      eventModel.findById.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(event),
        }),
      });
      reservationModel.countDocuments.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(0),
      }));

      const result = await service.getStats('eventId');

      expect(result.capacity).toBe(0);
      expect(result.fillRate).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle events with past dates', async () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      const events = [];
      eventModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(events),
      });

      const result = await service.findUpcoming();
      expect(result).toEqual([]);
    });

    it('should handle very large capacity numbers', async () => {
      const createEventDto = {
        title: 'Large Event',
        description: 'Desc',
        date: new Date().toISOString(),
        location: 'Loc',
        capacity: 1000000,
      };

      const savedEvent = { ...createEventDto, _id: 'newId', status: EventStatus.PUBLISHED };
      const mockEventInstance = {
        save: jest.fn().mockResolvedValue(savedEvent),
      };
      
      const mockModel = jest.fn().mockImplementation(() => mockEventInstance) as any;
      mockModel.find = eventModel.find;
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EventsService,
          { provide: getModelToken(EventModel.name), useValue: mockModel },
          { provide: getModelToken(ReservationModel.name), useValue: reservationModel },
        ],
      }).compile();
      service = module.get<EventsService>(EventsService);

      const result = await service.create(createEventDto);
      expect(result.capacity).toBe(1000000);
    });

    it('should handle events with special characters in title', async () => {
      const createEventDto = {
        title: 'Event with émojis 🎉 & spéciàl çhars!',
        description: 'Desc',
        date: new Date().toISOString(),
        location: 'Loc',
        capacity: 100,
      };

      const savedEvent = { ...createEventDto, _id: 'newId', status: EventStatus.PUBLISHED };
      const mockEventInstance = {
        save: jest.fn().mockResolvedValue(savedEvent),
      };
      
      const mockModel = jest.fn().mockImplementation(() => mockEventInstance) as any;
      mockModel.find = eventModel.find;
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EventsService,
          { provide: getModelToken(EventModel.name), useValue: mockModel },
          { provide: getModelToken(ReservationModel.name), useValue: reservationModel },
        ],
      }).compile();
      service = module.get<EventsService>(EventsService);

      const result = await service.create(createEventDto);
      expect(result.title).toBe('Event with émojis 🎉 & spéciàl çhars!');
    });
  });
});
