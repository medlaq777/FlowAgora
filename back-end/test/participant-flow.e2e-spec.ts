import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Participant Flow (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let participantToken: string;
  let eventId: string;
  let reservationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // 1. Setup Admin & Create Event
    const adminEmail = `admin_part_${Date.now()}@example.com`;
    await request(app.getHttpServer()).post('/users').send({
      email: adminEmail, password: 'password123', firstName: 'Admin', lastName: 'User', role: 'ADMIN',
    });
    const adminLogin = await request(app.getHttpServer()).post('/auth/login').send({
      email: adminEmail, password: 'password123',
    });
    adminToken = adminLogin.body.access_token;

    const eventRes = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Participant Test Event',
        description: 'Testing participant flow',
        date: new Date(Date.now() + 86400000).toISOString(),
        location: 'Virtual',
        capacity: 10,
      });
    eventId = eventRes.body._id;

    // Publish the event
    await request(app.getHttpServer())
      .patch(`/events/${eventId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'PUBLISHED' })
      .expect(200);

    // 2. Register & Login Participant
    const userEmail = `user_part_${Date.now()}@example.com`;
    await request(app.getHttpServer()).post('/users').send({
      email: userEmail, password: 'password123', firstName: 'Part', lastName: 'User', role: 'PARTICIPANT',
    });
    const userLogin = await request(app.getHttpServer()).post('/auth/login').send({
      email: userEmail, password: 'password123',
    });
    participantToken = userLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should list available events', async () => {
    const response = await request(app.getHttpServer())
      .get('/events')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
    const event = response.body.find(e => e._id === eventId);
    expect(event).toBeDefined();
  });

  it('should make a reservation', async () => {
    const response = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${participantToken}`)
      .send({ eventId })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.status).toBe('PENDING');
    reservationId = response.body._id;
  });

  it('should get my reservations', async () => {
    const response = await request(app.getHttpServer())
      .get('/reservations/my-reservations')
      .set('Authorization', `Bearer ${participantToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    const reservation = response.body.find(r => r._id === reservationId);
    expect(reservation).toBeDefined();
  });

  it('should cancel reservation', async () => {
    await request(app.getHttpServer())
      .patch(`/reservations/${reservationId}/cancel`)
      .set('Authorization', `Bearer ${participantToken}`)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/reservations/my-reservations')
      .set('Authorization', `Bearer ${participantToken}`);

    const reservation = response.body.find(r => r._id === reservationId);
    expect(reservation.status).toBe('CANCELED');
  });
});
