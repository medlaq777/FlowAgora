import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event, EventStatus } from '../domain/entities/event.entity';
import { ReservationModel } from '../../reservations/infrastructure/persistence/reservation.schema';
import { EventModel } from '../infrastructure/persistence/event.schema';

describe('EventsService', () => {
  let service: EventsService;
  let eventModel: any;
  let reservationModel: any;

  beforeEach(async () => {
    eventModel = jest.fn();
    eventModel.find = jest.fn();
    eventModel.findById = jest.fn();
    eventModel.findByIdAndUpdate = jest.fn();
    eventModel.countDocuments = jest.fn();

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
        capacity: 100
      };
      
      const savedEvent = { ...createEventDto, _id: 'newId', status: EventStatus.PUBLISHED };
      
      const mockEventInstance = {
        save: jest.fn().mockResolvedValue(savedEvent),
      };
      
      (eventModel as unknown as jest.Mock).mockImplementation(() => mockEventInstance);

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
      expect(reservationModel.countDocuments).toHaveBeenCalled();
    });
  });
});
