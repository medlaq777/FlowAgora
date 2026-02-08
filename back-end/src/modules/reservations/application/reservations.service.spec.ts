import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getModelToken } from '@nestjs/mongoose';
import { Reservation, ReservationStatus } from '../domain/entities/reservation.entity';
import { EventModel } from '../../events/infrastructure/persistence/event.schema';
import { ReservationModel } from '../infrastructure/persistence/reservation.schema';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationModel: any;
  let eventModel: any;

  beforeEach(async () => {
    reservationModel = jest.fn();
    reservationModel.create = jest.fn();
    reservationModel.findOne = jest.fn();
    reservationModel.findById = jest.fn();
    reservationModel.findByIdAndUpdate = jest.fn();
    reservationModel.countDocuments = jest.fn();

    eventModel = jest.fn();
    eventModel.findById = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getModelToken(ReservationModel.name),
          useValue: reservationModel,
        },
        {
          provide: getModelToken(EventModel.name),
          useValue: eventModel,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation if capacity allows', async () => {
        const createReservationDto = { eventId: 'eventId' };
        const userId = 'userId';
        const mockEvent = { _id: 'eventId', capacity: 100, status: 'PUBLISHED' };
        eventModel.findById.mockReturnValue({
             exec: jest.fn().mockResolvedValue(mockEvent),
        });
        reservationModel.findOne.mockReturnValue({
             exec: jest.fn().mockResolvedValue(null),
        });
        reservationModel.countDocuments.mockReturnValue({
             exec: jest.fn().mockResolvedValue(50),
        });

        const savedReservation = { 
            _id: 'resId', 
            eventId: 'eventId', 
            userId, 
            status: ReservationStatus.PENDING 
        };
        
        const mockReservationInstance = {
            save: jest.fn().mockResolvedValue(savedReservation),
        };
        
        (reservationModel as unknown as jest.Mock).mockImplementation(() => mockReservationInstance);

        const result = await service.create(createReservationDto, userId);
        expect(result).toEqual(savedReservation);
    });

    it('should throw error if event is full', async () => {
         const createReservationDto = { eventId: 'eventId' };
         const userId = 'userId';
        
        const mockEvent = { _id: 'eventId', capacity: 100, status: 'PUBLISHED' };
        eventModel.findById.mockReturnValue({
             exec: jest.fn().mockResolvedValue(mockEvent),
        });
        reservationModel.findOne.mockReturnValue({
             exec: jest.fn().mockResolvedValue(null),
        });
        reservationModel.countDocuments.mockReturnValue({
             exec: jest.fn().mockResolvedValue(100),
        });
        await expect(service.create(createReservationDto, userId)).rejects.toThrow(ConflictException);
    });
  });
});
