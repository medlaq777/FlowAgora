import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { EventStatus } from '../src/modules/events/domain/entities/event.entity';
import { ReservationStatus } from '../src/modules/reservations/domain/entities/reservation.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let createdEventId: string;
  let createdReservationId: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('Authentication', () => {
      it('/auth/register (POST) - Register a new user', async () => {
          const email = `testuser${Date.now()}@example.com`;
          const response = await request(app.getHttpServer())
              .post('/users')
              .send({
                  email,
                  password: 'password123',
                  firstName: 'Test',
                  lastName: 'User',
                  role: 'PARTICIPANT'
              })
              .expect(201);
          
          userId = response.body._id;
      });

      it('/auth/login (POST) - Login as User', async () => { 
      });
  });

  it('Full User Journey: Register -> Login -> Create Event -> Reserve -> Confirm', async () => {
      const adminEmail = `admin${Date.now()}@flowagora.com`;
      const userEmail = `user${Date.now()}@flowagora.com`;
      const password = 'password123';

      await request(app.getHttpServer())
          .post('/users')
          .send({ email: adminEmail, password, role: 'ADMIN', firstName: 'Admin', lastName: 'User' })
          .expect(201);
      const adminLoginRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: adminEmail, password })
          .expect(200);
      adminToken = adminLoginRes.body.access_token;
      const userRegisterRes = await request(app.getHttpServer())
          .post('/users')
          .send({ email: userEmail, password, role: 'PARTICIPANT', firstName: 'Normal', lastName: 'User' })
          .expect(201);
      userId = userRegisterRes.body._id;
       const userLoginRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: userEmail, password })
          .expect(200);
      userToken = userLoginRes.body.access_token;
      const eventRes = await request(app.getHttpServer())
          .post('/events')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
              title: 'E2E Test Event',
              description: 'Testing the entire flow',
              date: new Date(Date.now() + 86400000).toISOString(),
              location: 'E2E World',
              capacity: 10
          })
          .expect(201);
      createdEventId = eventRes.body._id;
      await request(app.getHttpServer())
          .patch(`/events/${createdEventId}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: EventStatus.PUBLISHED })
          .expect(200);
      await request(app.getHttpServer())
          .get('/events')
          .expect(200)
          .expect((res) => {
              expect(res.body).toEqual(
                  expect.arrayContaining([
                      expect.objectContaining({ _id: createdEventId })
                  ])
              );
          });

      const reserveRes = await request(app.getHttpServer())
          .post('/reservations')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ eventId: createdEventId })
          .expect(201);
      createdReservationId = reserveRes.body._id;
       await request(app.getHttpServer())
          .get('/reservations/my-reservations')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200)
          .expect((res) => {
               expect(res.body).toEqual(
                  expect.arrayContaining([
                      expect.objectContaining({ _id: createdReservationId })
                  ])
              );
          });
      await request(app.getHttpServer())
          .patch(`/reservations/${createdReservationId}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: ReservationStatus.CONFIRMED })
          .expect(200)
          .expect((res) => {
              expect(res.body.status).toBe(ReservationStatus.CONFIRMED);
          });
      await request(app.getHttpServer())
          .get(`/reservations/${createdReservationId}/ticket`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200)
          .expect('Content-Type', 'application/pdf');
  });
});
