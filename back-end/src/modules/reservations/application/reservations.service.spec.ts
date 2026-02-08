import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getModelToken } from '@nestjs/mongoose';
import { ReservationStatus } from '../domain/entities/reservation.entity';
import { EventModel } from '../../events/infrastructure/persistence/event.schema';
import { ReservationModel } from '../infrastructure/persistence/reservation.schema';
import { NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { EventStatus } from '../../events/domain/entities/event.entity';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationModel: any;
  let eventModel: any;

  beforeEach(async () => {
    reservationModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      countDocuments: jest.fn(),
      find: jest.fn(),
    };

    eventModel = {
      findById: jest.fn(),
    };

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
        const mockEvent = { _id: 'eventId', capacity: 100, status: EventStatus.PUBLISHED };
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
        const mockModel = jest.fn().mockImplementation(() => mockReservationInstance) as any;
        Object.assign(mockModel, reservationModel);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReservationsService,
                { provide: getModelToken(ReservationModel.name), useValue: mockModel },
                { provide: getModelToken(EventModel.name), useValue: eventModel },
            ],
        }).compile();
        service = module.get<ReservationsService>(ReservationsService);

        const result = await service.create(createReservationDto, userId);
        expect(result).toEqual(savedReservation);
    });

    it('should throw error if event is full', async () => {
         const createReservationDto = { eventId: 'eventId' };
         const userId = 'userId';
        
        const mockEvent = { _id: 'eventId', capacity: 100, status: EventStatus.PUBLISHED };
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

    it('should throw error if event not found', async () => {
         const createReservationDto = { eventId: 'eventId' };
         const userId = 'userId';
        eventModel.findById.mockReturnValue({
             exec: jest.fn().mockResolvedValue(null),
        });
        await expect(service.create(createReservationDto, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw error if event not published', async () => {
         const createReservationDto = { eventId: 'eventId' };
         const userId = 'userId';
        const mockEvent = { _id: 'eventId', capacity: 100, status: EventStatus.DRAFT };
        eventModel.findById.mockReturnValue({
             exec: jest.fn().mockResolvedValue(mockEvent),
        });
        await expect(service.create(createReservationDto, userId)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if user already reserved', async () => {
         const createReservationDto = { eventId: 'eventId' };
         const userId = 'userId';
        const mockEvent = { _id: 'eventId', capacity: 100, status: EventStatus.PUBLISHED };
        eventModel.findById.mockReturnValue({
             exec: jest.fn().mockResolvedValue(mockEvent),
        });
        reservationModel.findOne.mockReturnValue({
             exec: jest.fn().mockResolvedValue({ _id: 'existing' }),
        });
        await expect(service.create(createReservationDto, userId)).rejects.toThrow(ConflictException);
    });
  });

  describe('updateStatus', () => {
      it('should update status', async () => {
          const reservation = { _id: 'resId', status: ReservationStatus.CONFIRMED };
          reservationModel.findByIdAndUpdate.mockReturnValue({
              exec: jest.fn().mockResolvedValue(reservation),
          });

          const result = await service.updateStatus('resId', ReservationStatus.CONFIRMED);
          expect(result).toEqual(reservation);
      });

      it('should throw NotFoundException if reservation not found', async () => {
          reservationModel.findByIdAndUpdate.mockReturnValue({
              exec: jest.fn().mockResolvedValue(null),
          });
          await expect(service.updateStatus('resId', ReservationStatus.CONFIRMED)).rejects.toThrow(NotFoundException);
      });
  });

  describe('cancelByUser', () => {
      it('should cancel reservation', async () => {
          const reservation = { 
              _id: 'resId', 
              userId: 'userId', 
              status: ReservationStatus.PENDING,
              save: jest.fn().mockResolvedValue({ status: ReservationStatus.CANCELED })
          };
          reservationModel.findById.mockReturnValue({
              exec: jest.fn().mockResolvedValue(reservation),
          });

          const result = await service.cancelByUser('resId', 'userId');
          expect(result.status).toBe(ReservationStatus.CANCELED);
      });

      it('should throw ForbiddenException if user does not own reservation', async () => {
          const reservation = { 
              _id: 'resId', 
              userId: 'otherUser', 
              status: ReservationStatus.PENDING 
          };
          reservationModel.findById.mockReturnValue({
              exec: jest.fn().mockResolvedValue(reservation),
          });

          await expect(service.cancelByUser('resId', 'userId')).rejects.toThrow(ForbiddenException);
      });

      it('should throw BadRequestException if already canceled', async () => {
           const reservation = { 
              _id: 'resId', 
              userId: 'userId', 
              status: ReservationStatus.CANCELED 
          };
          reservationModel.findById.mockReturnValue({
              exec: jest.fn().mockResolvedValue(reservation),
          });

          await expect(service.cancelByUser('resId', 'userId')).rejects.toThrow(BadRequestException);
      });
  });

  describe('findByEvent', () => {
      it('should return reservations for event', async () => {
           const reservations = [{ _id: 'res1' }];
           reservationModel.find.mockReturnValue({
               exec: jest.fn().mockResolvedValue(reservations),
           });
           
           const result = await service.findByEvent('eventId');
           expect(result).toEqual(reservations);
      });
  });

  describe('findByUser', () => {
      it('should return reservations for user', async () => {
           const reservations = [{ _id: 'res1' }];
           reservationModel.find.mockReturnValue({
               exec: jest.fn().mockResolvedValue(reservations),
           });
           
           const result = await service.findByUser('userId');
           expect(result).toEqual(reservations);
      });
  });
});
