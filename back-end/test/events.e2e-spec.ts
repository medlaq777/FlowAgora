import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { EventStatus } from '../src/modules/events/domain/entities/event.entity';

describe('Events E2E Tests', () => {
  let app: INestApplication;
  let adminToken: string;
  let participantToken: string;
  let eventId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    // Create admin user and login
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

    // Create participant user and login
    const participantEmail = `participant${Date.now()}@flowagora.com`;
    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: participantEmail,
        password: 'participant123',
        role: 'PARTICIPANT',
        firstName: 'Participant',
        lastName: 'User',
      })
      .expect(201);

    const participantLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: participantEmail, password: 'participant123' })
      .expect(200);
    participantToken = participantLoginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ADMIN Event Workflow', () => {
    it('should create a new event as ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'E2E Test Event',
          description: 'Complete event lifecycle test',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Test Location',
          capacity: 50,
        })
        .expect(201);

      eventId = response.body._id;
      expect(response.body.title).toBe('E2E Test Event');
      expect(response.body.status).toBe(EventStatus.DRAFT);
    });

    it('should update event details as ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/events/${eventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated E2E Test Event',
          description: 'Updated description',
          capacity: 100,
        })
        .expect(200);

      expect(response.body.title).toBe('Updated E2E Test Event');
      expect(response.body.capacity).toBe(100);
    });

    it('should publish event as ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/events/${eventId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: EventStatus.PUBLISHED })
        .expect(200);

      expect(response.body.status).toBe(EventStatus.PUBLISHED);
    });

    it('should get event statistics as ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .get(`/events/${eventId}/stats`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('capacity');
      expect(response.body).toHaveProperty('reservations');
      expect(response.body).toHaveProperty('fillRate');
      expect(response.body).toHaveProperty('breakdown');
      expect(response.body.capacity).toBe(100);
    });

    it('should view all events (including drafts) as ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .get('/events/admin/all')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((e: any) => e._id === eventId)).toBe(true);
    });
  });

  describe('Public Event Access', () => {
    it('should view published events without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const event = response.body.find((e: any) => e._id === eventId);
      expect(event).toBeDefined();
      expect(event.status).toBe(EventStatus.PUBLISHED);
    });

    it('should view single published event without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get(`/events/${eventId}`)
        .expect(200);

      expect(response.body._id).toBe(eventId);
      expect(response.body.title).toBe('Updated E2E Test Event');
    });

    it('should not view draft events without authentication', async () => {
      // Create a draft event
      const draftResponse = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Draft Event',
          description: 'Should not be visible',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Hidden',
          capacity: 10,
        })
        .expect(201);

      const draftEventId = draftResponse.body._id;

      // Try to access draft event without auth
      await request(app.getHttpServer())
        .get(`/events/${draftEventId}`)
        .expect(404);
    });
  });

  describe('Event Status Transitions', () => {
    let testEventId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Status Test Event',
          description: 'Testing status transitions',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Test',
          capacity: 20,
        })
        .expect(201);

      testEventId = response.body._id;
    });

    it('should transition from DRAFT to PUBLISHED', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/events/${testEventId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: EventStatus.PUBLISHED })
        .expect(200);

      expect(response.body.status).toBe(EventStatus.PUBLISHED);
    });

    it('should transition from PUBLISHED to CANCELED', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/events/${testEventId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: EventStatus.CANCELED })
        .expect(200);

      expect(response.body.status).toBe(EventStatus.CANCELED);
    });
  });

  describe('Authorization Tests', () => {
    it('should not allow PARTICIPANT to create events', async () => {
      await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${participantToken}`)
        .send({
          title: 'Unauthorized Event',
          description: 'Should fail',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Nowhere',
          capacity: 10,
        })
        .expect(403);
    });

    it('should not allow unauthenticated users to create events', async () => {
      await request(app.getHttpServer())
        .post('/events')
        .send({
          title: 'Unauthorized Event',
          description: 'Should fail',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Nowhere',
          capacity: 10,
        })
        .expect(401);
    });

    it('should not allow PARTICIPANT to update event status', async () => {
      await request(app.getHttpServer())
        .patch(`/events/${eventId}/status`)
        .set('Authorization', `Bearer ${participantToken}`)
        .send({ status: EventStatus.CANCELED })
        .expect(403);
    });
  });

  describe('Edge Cases', () => {
    it('should handle event with very large capacity', async () => {
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Large Capacity Event',
          description: 'Testing large numbers',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Stadium',
          capacity: 1000000,
        })
        .expect(201);

      expect(response.body.capacity).toBe(1000000);
    });

    it('should handle event with special characters in title', async () => {
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Event with émojis 🎉 & spéciàl çhars!',
          description: 'Testing special characters',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Location',
          capacity: 50,
        })
        .expect(201);

      expect(response.body.title).toBe('Event with émojis 🎉 & spéciàl çhars!');
    });

    it('should return 404 for non-existent event', async () => {
      await request(app.getHttpServer())
        .get('/events/507f1f77bcf86cd799439011')
        .expect(404);
    });
  });
});
