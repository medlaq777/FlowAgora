import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { EventStatus } from '../src/modules/events/domain/entities/event.entity';
import { ReservationStatus } from '../src/modules/reservations/domain/entities/reservation.entity';

describe('Reservations E2E Tests', () => {
  let app: INestApplication;
  let adminToken: string;
  let participant1Token: string;
  let participant2Token: string;
  let participant1Id: string;
  let participant2Id: string;
  let publishedEventId: string;
  let reservationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    // Create admin user
    const adminEmail = `admin${Date.now()}@flowagora.com`;
    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: adminEmail,
        password: 'admin123',
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User',
      })
      .expect(201);

    const adminLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password: 'admin123' })
      .expect(200);
    adminToken = adminLoginRes.body.access_token;

    // Create participant 1
    const participant1Email = `participant1${Date.now()}@flowagora.com`;
    const participant1Res = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: participant1Email,
        password: 'participant123',
        role: 'PARTICIPANT',
        firstName: 'Participant',
        lastName: 'One',
      })
      .expect(201);
    participant1Id = participant1Res.body._id;

    const participant1LoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: participant1Email, password: 'participant123' })
      .expect(200);
    participant1Token = participant1LoginRes.body.access_token;

    // Create participant 2
    const participant2Email = `participant2${Date.now()}@flowagora.com`;
    const participant2Res = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: participant2Email,
        password: 'participant123',
        role: 'PARTICIPANT',
        firstName: 'Participant',
        lastName: 'Two',
      })
      .expect(201);
    participant2Id = participant2Res.body._id;

    const participant2LoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: participant2Email, password: 'participant123' })
      .expect(200);
    participant2Token = participant2LoginRes.body.access_token;

    // Create and publish an event
    const eventRes = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Reservation Test Event',
        description: 'Event for testing reservations',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Test Location',
        capacity: 5,
      })
      .expect(201);

    publishedEventId = eventRes.body._id;

    await request(app.getHttpServer())
      .patch(`/events/${publishedEventId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: EventStatus.PUBLISHED })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('PARTICIPANT Reservation Workflow', () => {
    it('should allow participant to browse published events', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .set('Authorization', `Bearer ${participant1Token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const event = response.body.find((e: any) => e._id === publishedEventId);
      expect(event).toBeDefined();
    });

    it('should allow participant to create a reservation', async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participant1Token}`)
        .send({ eventId: publishedEventId })
        .expect(201);

      reservationId = response.body._id;
      expect(response.body.eventId).toBe(publishedEventId);
      expect(response.body.status).toBe(ReservationStatus.PENDING);
    });

    it('should allow participant to view their reservations', async () => {
      const response = await request(app.getHttpServer())
        .get('/reservations/my-reservations')
        .set('Authorization', `Bearer ${participant1Token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const reservation = response.body.find((r: any) => r._id === reservationId);
      expect(reservation).toBeDefined();
    });

    it('should prevent duplicate reservations by same user', async () => {
      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participant1Token}`)
        .send({ eventId: publishedEventId })
        .expect(409); // Conflict
    });

    it('should allow participant to cancel their own reservation', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/reservations/${reservationId}/cancel`)
        .set('Authorization', `Bearer ${participant1Token}`)
        .expect(200);

      expect(response.body.status).toBe(ReservationStatus.CANCELED);
    });

    it('should not allow participant to cancel already canceled reservation', async () => {
      await request(app.getHttpServer())
        .patch(`/reservations/${reservationId}/cancel`)
        .set('Authorization', `Bearer ${participant1Token}`)
        .expect(400); // Bad Request
    });
  });

  describe('ADMIN Reservation Management', () => {
    let newReservationId: string;

    beforeAll(async () => {
      // Create a new reservation for testing admin actions
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participant2Token}`)
        .send({ eventId: publishedEventId })
        .expect(201);

      newReservationId = response.body._id;
    });

    it('should allow admin to view all reservations for an event', async () => {
      const response = await request(app.getHttpServer())
        .get(`/reservations/event/${publishedEventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should allow admin to confirm a reservation', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/reservations/${newReservationId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: ReservationStatus.CONFIRMED })
        .expect(200);

      expect(response.body.status).toBe(ReservationStatus.CONFIRMED);
    });

    it('should allow admin to refuse a reservation', async () => {
      // Create another reservation to refuse
      const reservationRes = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participant1Token}`)
        .send({ eventId: publishedEventId })
        .expect(201);

      const response = await request(app.getHttpServer())
        .patch(`/reservations/${reservationRes.body._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: ReservationStatus.REFUSED })
        .expect(200);

      expect(response.body.status).toBe(ReservationStatus.REFUSED);
    });
  });

  describe('Ticket Generation', () => {
    let confirmedReservationId: string;

    beforeAll(async () => {
      // Create and confirm a reservation for ticket testing
      const reservationRes = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participant2Token}`)
        .send({ eventId: publishedEventId })
        .expect(201);

      confirmedReservationId = reservationRes.body._id;

      await request(app.getHttpServer())
        .patch(`/reservations/${confirmedReservationId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: ReservationStatus.CONFIRMED })
        .expect(200);
    });

    it('should generate PDF ticket for confirmed reservation', async () => {
      const response = await request(app.getHttpServer())
        .get(`/reservations/${confirmedReservationId}/ticket`)
        .set('Authorization', `Bearer ${participant2Token}`)
        .expect(200)
        .expect('Content-Type', 'application/pdf');

      expect(response.body).toBeDefined();
      expect(Buffer.isBuffer(response.body)).toBe(true);
    });

    it('should not allow downloading ticket for non-confirmed reservation', async () => {
      // Create a pending reservation
      const pendingRes = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participant1Token}`)
        .send({ eventId: publishedEventId })
        .expect(201);

      await request(app.getHttpServer())
        .get(`/reservations/${pendingRes.body._id}/ticket`)
        .set('Authorization', `Bearer ${participant1Token}`)
        .expect(400); // Bad Request
    });

    it('should not allow participant to download another user\'s ticket', async () => {
      await request(app.getHttpServer())
        .get(`/reservations/${confirmedReservationId}/ticket`)
        .set('Authorization', `Bearer ${participant1Token}`)
        .expect(403); // Forbidden
    });
  });

  describe('Capacity Limits', () => {
    let smallEventId: string;

    beforeAll(async () => {
      // Create event with capacity of 2
      const eventRes = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Small Capacity Event',
          description: 'Testing capacity limits',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Small Venue',
          capacity: 2,
        })
        .expect(201);

      smallEventId = eventRes.body._id;

      await request(app.getHttpServer())
        .patch(`/events/${smallEventId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: EventStatus.PUBLISHED })
        .expect(200);
    });

    it('should allow reservations up to capacity', async () => {
      // First reservation
      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participant1Token}`)
        .send({ eventId: smallEventId })
        .expect(201);

      // Second reservation
      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participant2Token}`)
        .send({ eventId: smallEventId })
        .expect(201);
    });

    it('should reject reservation when event is at full capacity', async () => {
      // Create a third participant
      const participant3Email = `participant3${Date.now()}@flowagora.com`;
      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: participant3Email,
          password: 'participant123',
          role: 'PARTICIPANT',
          firstName: 'Participant',
          lastName: 'Three',
        })
        .expect(201);

      const participant3LoginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: participant3Email, password: 'participant123' })
        .expect(200);

      // Try to make third reservation (should fail)
      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participant3LoginRes.body.access_token}`)
        .send({ eventId: smallEventId })
        .expect(409); // Conflict - event is full
    });
  });

  describe('Authorization Tests', () => {
    it('should not allow unauthenticated users to create reservations', async () => {
      await request(app.getHttpServer())
        .post('/reservations')
        .send({ eventId: publishedEventId })
        .expect(401);
    });

    it('should not allow participant to update reservation status', async () => {
      await request(app.getHttpServer())
        .patch(`/reservations/${reservationId}/status`)
        .set('Authorization', `Bearer ${participant1Token}`)
        .send({ status: ReservationStatus.CONFIRMED })
        .expect(403);
    });

    it('should not allow participant to cancel another user\'s reservation', async () => {
      // participant1 tries to cancel participant2's reservation
      const participant2Reservations = await request(app.getHttpServer())
        .get('/reservations/my-reservations')
        .set('Authorization', `Bearer ${participant2Token}`)
        .expect(200);

      const participant2ReservationId = participant2Reservations.body[0]?._id;

      if (participant2ReservationId) {
        await request(app.getHttpServer())
          .patch(`/reservations/${participant2ReservationId}/cancel`)
          .set('Authorization', `Bearer ${participant1Token}`)
          .expect(403);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should not allow reservation for non-published event', async () => {
      // Create a draft event
      const draftEventRes = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Draft Event',
          description: 'Should not accept reservations',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Test',
          capacity: 10,
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participant1Token}`)
        .send({ eventId: draftEventRes.body._id })
        .expect(400); // Bad Request
    });

    it('should return 404 for non-existent event', async () => {
      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participant1Token}`)
        .send({ eventId: '507f1f77bcf86cd799439011' })
        .expect(404);
    });

    it('should return 404 for non-existent reservation', async () => {
      await request(app.getHttpServer())
        .get('/reservations/507f1f77bcf86cd799439011/ticket')
        .set('Authorization', `Bearer ${participant1Token}`)
        .expect(404);
    });
  });
});
