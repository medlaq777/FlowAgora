import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Admin Flow (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let eventId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // Enable validation
    await app.init();

    // 1. Register Admin User
    const uniqueEmail = `admin_${Date.now()}@example.com`;
    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: uniqueEmail,
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      });

    // 2. Login as Admin
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: uniqueEmail,
        password: 'password123',
      })
      .expect(200);

    adminToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new event', async () => {
    const createEventDto = {
      title: 'Admin Created Event',
      description: 'An event created by admin',
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      location: 'Virtual',
      capacity: 50,
    };

    const response = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createEventDto)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe(createEventDto.title);
    eventId = response.body._id;
  });

  it('should update the event', async () => {
    const updateEventDto = {
      title: 'Updated Event Title',
    };

    const response = await request(app.getHttpServer())
      .put(`/events/${eventId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateEventDto)
      .expect(200);

    expect(response.body.title).toBe(updateEventDto.title);
  });

  it('should view event stats', async () => {
    const response = await request(app.getHttpServer())
      .get(`/events/${eventId}/stats`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('capacity');
    expect(response.body).toHaveProperty('reservations');
    expect(response.body).toHaveProperty('fillRate');
  });
});
