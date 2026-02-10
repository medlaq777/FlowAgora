import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { EventStatus } from '../src/modules/events/domain/entities/event.entity';
import { ReservationStatus } from '../src/modules/reservations/domain/entities/reservation.entity';

describe('Role-Based Access Control E2E Tests', () => {
  let app: INestApplication;
  let adminToken: string;
  let organizerToken: string;
  let participantToken: string;
  let adminId: string;
  let organizerId: string;
  let participantId: string;
  let testEventId: string;
  let testReservationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    // Create ADMIN user
    const adminEmail = `admin${Date.now()}@flowagora.com`;
    const adminRes = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: adminEmail,
        password: 'admin123',
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User',
      })
      .expect(201);
    adminId = adminRes.body._id;

    const adminLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password: 'admin123' })
      .expect(200);
    adminToken = adminLoginRes.body.access_token;

    // Create ORGANIZER user
    const organizerEmail = `organizer${Date.now()}@flowagora.com`;
    const organizerRes = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: organizerEmail,
        password: 'organizer123',
        role: 'ORGANIZER',
        firstName: 'Organizer',
        lastName: 'User',
      })
      .expect(201);
    organizerId = organizerRes.body._id;

    const organizerLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: organizerEmail, password: 'organizer123' })
      .expect(200);
    organizerToken = organizerLoginRes.body.access_token;

    // Create PARTICIPANT user
    const participantEmail = `participant${Date.now()}@flowagora.com`;
    const participantRes = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: participantEmail,
        password: 'participant123',
        role: 'PARTICIPANT',
        firstName: 'Participant',
        lastName: 'User',
      })
      .expect(201);
    participantId = participantRes.body._id;

    const participantLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: participantEmail, password: 'participant123' })
      .expect(200);
    participantToken = participantLoginRes.body.access_token;

    // Create a test event
    const eventRes = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'RBAC Test Event',
        description: 'Testing role-based access',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Test Location',
        capacity: 50,
      })
      .expect(201);
    testEventId = eventRes.body._id;

    await request(app.getHttpServer())
      .patch(`/events/${testEventId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: EventStatus.PUBLISHED })
      .expect(200);

    // Create a test reservation
    const reservationRes = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${participantToken}`)
      .send({ eventId: testEventId })
      .expect(201);
    testReservationId = reservationRes.body._id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ADMIN Role Permissions', () => {
    it('should allow ADMIN to create events', async () => {
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Admin Created Event',
          description: 'Created by admin',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Admin Location',
          capacity: 100,
        })
        .expect(201);

      expect(response.body.title).toBe('Admin Created Event');
    });

    it('should allow ADMIN to update events', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/events/${testEventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Updated by Admin' })
        .expect(200);

      expect(response.body.title).toBe('Updated by Admin');
    });

    it('should allow ADMIN to change event status', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/events/${testEventId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: EventStatus.PUBLISHED })
        .expect(200);

      expect(response.body.status).toBe(EventStatus.PUBLISHED);
    });

    it('should allow ADMIN to view all events', async () => {
      const response = await request(app.getHttpServer())
        .get('/events/admin/all')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should allow ADMIN to view event statistics', async () => {
      const response = await request(app.getHttpServer())
        .get(`/events/${testEventId}/stats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('capacity');
      expect(response.body).toHaveProperty('reservations');
    });

    it('should allow ADMIN to view all reservations for an event', async () => {
      const response = await request(app.getHttpServer())
        .get(`/reservations/event/${testEventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should allow ADMIN to confirm reservations', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/reservations/${testReservationId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: ReservationStatus.CONFIRMED })
        .expect(200);

      expect(response.body.status).toBe(ReservationStatus.CONFIRMED);
    });

    it('should allow ADMIN to refuse reservations', async () => {
      // Create another reservation to refuse
      const newReservationRes = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participantToken}`)
        .send({ eventId: testEventId })
        .expect(201);

      const response = await request(app.getHttpServer())
        .patch(`/reservations/${newReservationRes.body._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: ReservationStatus.REFUSED })
        .expect(200);

      expect(response.body.status).toBe(ReservationStatus.REFUSED);
    });
  });

  describe('ORGANIZER Role Permissions', () => {
    it('should allow ORGANIZER to create events', async () => {
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          title: 'Organizer Created Event',
          description: 'Created by organizer',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Organizer Location',
          capacity: 75,
        })
        .expect(201);

      expect(response.body.title).toBe('Organizer Created Event');
    });

    it('should allow ORGANIZER to update events', async () => {
      const eventRes = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          title: 'Organizer Event',
          description: 'To be updated',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Location',
          capacity: 50,
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .patch(`/events/${eventRes.body._id}`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ title: 'Updated by Organizer' })
        .expect(200);

      expect(response.body.title).toBe('Updated by Organizer');
    });

    it('should allow ORGANIZER to change event status', async () => {
      const eventRes = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          title: 'Status Test Event',
          description: 'Testing status change',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Location',
          capacity: 30,
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .patch(`/events/${eventRes.body._id}/status`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ status: EventStatus.PUBLISHED })
        .expect(200);

      expect(response.body.status).toBe(EventStatus.PUBLISHED);
    });
  });

  describe('PARTICIPANT Role Permissions', () => {
    it('should NOT allow PARTICIPANT to create events', async () => {
      await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${participantToken}`)
        .send({
          title: 'Participant Event',
          description: 'Should fail',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Location',
          capacity: 50,
        })
        .expect(403);
    });

    it('should NOT allow PARTICIPANT to update events', async () => {
      await request(app.getHttpServer())
        .patch(`/events/${testEventId}`)
        .set('Authorization', `Bearer ${participantToken}`)
        .send({ title: 'Unauthorized Update' })
        .expect(403);
    });

    it('should NOT allow PARTICIPANT to change event status', async () => {
      await request(app.getHttpServer())
        .patch(`/events/${testEventId}/status`)
        .set('Authorization', `Bearer ${participantToken}`)
        .send({ status: EventStatus.CANCELED })
        .expect(403);
    });

    it('should allow PARTICIPANT to view published events', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .set('Authorization', `Bearer ${participantToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should allow PARTICIPANT to create reservations', async () => {
      // Create a new event for this test
      const eventRes = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Participant Reservation Test',
          description: 'Testing participant reservations',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Location',
          capacity: 20,
        })
        .expect(201);

      await request(app.getHttpServer())
        .patch(`/events/${eventRes.body._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: EventStatus.PUBLISHED })
        .expect(200);

      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participantToken}`)
        .send({ eventId: eventRes.body._id })
        .expect(201);

      expect(response.body.eventId).toBe(eventRes.body._id);
    });

    it('should allow PARTICIPANT to view their own reservations', async () => {
      const response = await request(app.getHttpServer())
        .get('/reservations/my-reservations')
        .set('Authorization', `Bearer ${participantToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should allow PARTICIPANT to cancel their own reservations', async () => {
      // Create a new reservation to cancel
      const eventRes = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Cancel Test Event',
          description: 'Testing cancellation',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Location',
          capacity: 15,
        })
        .expect(201);

      await request(app.getHttpServer())
        .patch(`/events/${eventRes.body._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: EventStatus.PUBLISHED })
        .expect(200);

      const reservationRes = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${participantToken}`)
        .send({ eventId: eventRes.body._id })
        .expect(201);

      const response = await request(app.getHttpServer())
        .patch(`/reservations/${reservationRes.body._id}/cancel`)
        .set('Authorization', `Bearer ${participantToken}`)
        .expect(200);

      expect(response.body.status).toBe(ReservationStatus.CANCELED);
    });

    it('should NOT allow PARTICIPANT to update reservation status', async () => {
      await request(app.getHttpServer())
        .patch(`/reservations/${testReservationId}/status`)
        .set('Authorization', `Bearer ${participantToken}`)
        .send({ status: ReservationStatus.CONFIRMED })
        .expect(403);
    });

    it('should NOT allow PARTICIPANT to view all reservations for an event', async () => {
      await request(app.getHttpServer())
        .get(`/reservations/event/${testEventId}`)
        .set('Authorization', `Bearer ${participantToken}`)
        .expect(403);
    });
  });

  describe('Unauthenticated Access', () => {
    it('should allow viewing published events without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should NOT allow creating events without authentication', async () => {
      await request(app.getHttpServer())
        .post('/events')
        .send({
          title: 'Unauthorized Event',
          description: 'Should fail',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Location',
          capacity: 50,
        })
        .expect(401);
    });

    it('should NOT allow creating reservations without authentication', async () => {
      await request(app.getHttpServer())
        .post('/reservations')
        .send({ eventId: testEventId })
        .expect(401);
    });

    it('should NOT allow viewing reservations without authentication', async () => {
      await request(app.getHttpServer())
        .get('/reservations/my-reservations')
        .expect(401);
    });
  });

  describe('Cross-Role Access Control', () => {
    it('should NOT allow PARTICIPANT to cancel another user\'s reservation', async () => {
      // Create a second participant
      const participant2Email = `participant2${Date.now()}@flowagora.com`;
      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: participant2Email,
          password: 'participant123',
          role: 'PARTICIPANT',
          firstName: 'Participant',
          lastName: 'Two',
        })
        .expect(201);

      const participant2LoginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: participant2Email, password: 'participant123' })
        .expect(200);

      const participant2Token = participant2LoginRes.body.access_token;

      // participant2 tries to cancel participant1's reservation
      await request(app.getHttpServer())
        .patch(`/reservations/${testReservationId}/cancel`)
        .set('Authorization', `Bearer ${participant2Token}`)
        .expect(403);
    });

    it('should NOT allow ORGANIZER to manage reservations (admin-only)', async () => {
      await request(app.getHttpServer())
        .patch(`/reservations/${testReservationId}/status`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ status: ReservationStatus.CONFIRMED })
        .expect(403);
    });
  });

  describe('JWT Token Validation', () => {
    it('should reject requests with invalid tokens', async () => {
      await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', 'Bearer invalid_token_here')
        .send({
          title: 'Test Event',
          description: 'Should fail',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Location',
          capacity: 50,
        })
        .expect(401);
    });

    it('should reject requests with malformed Authorization header', async () => {
      await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', 'InvalidFormat')
        .send({
          title: 'Test Event',
          description: 'Should fail',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Location',
          capacity: 50,
        })
        .expect(401);
    });
  });
});
