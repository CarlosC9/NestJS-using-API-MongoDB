import * as requestTest from 'supertest';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';

const app = "http://localhost:3000";

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/diagramEditorDB');
  await mongoose.connection.db.dropDatabase();
});

afterAll(async done => {
  await mongoose.disconnect(done);
})

describe('Auth (e2e)', () => {

  beforeEach(function (done) {
    setTimeout(done, 1000);
  });

  // register
  it('register', () => {

    let user: CreateUserDto = {
      username: "username",
      password: "password",
    }

    return requestTest(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send(user)
      .expect(HttpStatus.CREATED)
  });

  // login
  it('login', () => {

    let user = {
      username: "username",
      password: "password",
    }

    return requestTest(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.access_token).toBeDefined();
      });
  });


});