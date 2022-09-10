import { DatabaseService } from './../../src/db/db.service';
import { DBModule } from './../../src/db/db.module';
import { AppModule } from './../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TestUtils } from '../utils';
import { MockFactory } from './mock.factory';
import { config } from 'dotenv';

describe('/api/v1/notes (e2e)', () => {
  let app: INestApplication;
  let testUtils: TestUtils;
  const mockFactory = new MockFactory();
  const newNote = mockFactory.genCreateNoteDto();
  const updateNote = mockFactory.genUpdateNoteDto();
  config({ path: './env.test' });

  console.log(process.env.DATABASE_URL);
  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule, DBModule],
      providers: [DatabaseService, TestUtils],
    }).compile();

    testUtils = moduleFixture.get<TestUtils>(TestUtils);
    app = moduleFixture.createNestApplication();

    await testUtils.reloadFixtures();
    await app.init();
  });

  afterEach((done) => {
    (async () => {
      await testUtils.reloadFixtures();
      await testUtils.closeConnection();
      done();
    })();
  });

  it('GET all notes', async () => {
    try {
      const createNoteResponse = await request(app.getHttpServer())
        .post('/api/v1/notes')
        .send(newNote)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      const getNotesResponse = await request(app.getHttpServer())
        .get('/api/v1/notes')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(getNotesResponse.status).toBe(200);
      expect(typeof getNotesResponse.body).toBe('object');
      expect(getNotesResponse.body).toHaveLength(3);
      expect(getNotesResponse.body[2].id).toBe(createNoteResponse.body.id);
    } catch (err) {
      throw err;
    }
  });

  it('GET note by id', async () => {
    try {
      console.log(newNote);
      const createNoteResponse = await request(app.getHttpServer())
        .post('/api/v1/notes')
        .send(newNote)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      const getNoteResponse = await request(app.getHttpServer())
        .get(`/api/v1/notes/${createNoteResponse.body.id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(getNoteResponse.status).toBe(200);
      expect(typeof getNoteResponse.body).toBe('object');
      expect(getNoteResponse.body.id).toBe(createNoteResponse.body.id);
    } catch (error) {
      throw error;
    }
  });

  it('POST note', async () => {
    try {
      const response = await request(app.getHttpServer())
        .post('/api/v1/notes')
        .send(newNote)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(typeof response.body).toBe('object');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body).toHaveProperty('isCompleted');
      expect(response.body.text).toBe(newNote.text);
      expect(response.body.isCompleted).toBe(false);
      expect(response.body.updatedAt).toBe(response.body.createdAt);
    } catch (error) {
      throw error;
    }
  });

  it('PATCH note by id', async () => {
    const createNoteResponse = await request(app.getHttpServer())
      .post('/api/v1/notes')
      .send(newNote)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const updateNoteResponse = await request(app.getHttpServer())
      .patch(`/api/v1/notes/${createNoteResponse.body.id}`)
      .send(updateNote)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(updateNoteResponse.status).toBe(200);
    expect(typeof updateNoteResponse).toBe('object');
    expect(updateNoteResponse.body.isCompleted).toBe(updateNote.isCompleted);
    expect(createNoteResponse.body.createdAt).not.toBe(
      updateNoteResponse.body.updatedAt,
    );
  });

  it('DELETE Note by id', async () => {
    const createNoteResponse = await request(app.getHttpServer())
      .post('/api/v1/notes')
      .send(newNote)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const deleteNoteResponse = await request(app.getHttpServer())
      .delete(`/api/v1/notes/${createNoteResponse.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(deleteNoteResponse.status).toBe(200);
    expect(typeof deleteNoteResponse.body).toBe('object');
    expect(deleteNoteResponse.body.id).toBe(createNoteResponse.body.id);
  });
});
