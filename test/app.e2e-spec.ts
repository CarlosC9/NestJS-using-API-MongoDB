import * as requestTest from 'supertest';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';

const request = require("request");
const app = "http://localhost:3000";

var token;

jasmine.addMatchers({
  toBeFive: function () {
    return {
      compare: function (actual, expected) {
        return {
          pass: actual === 5,
          message: actual + ' is not exactly 5'
        }
      }
    };
  },
  toBeBetween: function (lower, higher) {
    return {
      compare: function (actual, lower, higher) {
        return {
          pass: (actual >= lower && actual <= higher),
          message: actual + ' is not between ' + lower + ' and ' + higher
        }
      }
    };
  },
  toBeIn: function (expected) {
    return {
      compare: function (actual, expected) {
        return {
          pass: expected.some(function (item) { return item === actual; }),
          message: actual + ' is not in ' + expected
        }
      }
    };
  }
});

beforeAll(async (done) => {
  await mongoose.connect('mongodb://localhost:27017/diagramEditorDB');
  await mongoose.connection.db.dropDatabase();
  request.post(app + "/users", {
    json: {
      username: "username2",
      password: "password",
    }
  })
  setTimeout(done, 1000);
});

afterAll(async done => {
  await mongoose.disconnect(done);
})

describe('Authentication', () => {

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

  it('login', async () => {

    let user = {
      username: "username2",
      password: "password",
    }

    return requestTest(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        token = body.access_token;
        expect(body.access_token).toBeDefined();
      });
  });

  it('should cannot create again user', () => {
    let user: CreateUserDto = {
      username: "username2",
      password: "password",
    }

    return requestTest(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send(user)
      .expect(HttpStatus.BAD_REQUEST)
  });



});

describe('UserController', () => {

  it('get user configuration', () => {

    return requestTest(app)
      .get('/users/user-configuration')
      .set('Authorization', `Bearer ${token}`)
      .expect(({ body }) => {
        expect(['#000000','#ff00f2','#ff7b00']).toContain(body.colorParentType);
        expect(['#05FF23','#003cff','#ff0000']).toContain(body.colorScaleChange);
      })

  });

  it('get user configuration', () => {

    return requestTest(app)
      .get('/users/user-configuration')
      .set('Authorization', `Bearer ${token}`)
      .expect(({ body }) => {
        expect(['#000000','#ff00f2','#ff7b00']).toContain(body.colorParentType);
        expect(['#05FF23','#003cff','#ff0000']).toContain(body.colorScaleChange);
      })

  });

})

describe('Diagrams', () => {

  
  let id;
  
  it('create diagrams', () => {

    return requestTest(app)
    .post("/diagrams")
    .set('Authorization', `Bearer ${token}`)
    .expect( ({body}) => {
      id = body;
      expect(body).toBeDefined();
    } )

  })

  it('get all diagrams', () => {
    return requestTest(app)
    .get("/diagrams/my-diagrams")
    .set('Authorization', `Bearer ${token}`)
    .expect( ({body}) => {
      expect(body).toBeInstanceOf(Array);
    } )
  })

  it('get all diagrams when user has not validate', () => {
    return requestTest(app)
    .get("/diagrams/my-diagrams")
    .expect(HttpStatus.UNAUTHORIZED);
  })

  it('get one diagram', () => {
    return requestTest(app)
    .get(`/diagrams/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect( ({body}) => {
      expect(body.diagram).toBeDefined();
      expect(body.colorParentType).toBeDefined();
      expect(body.colorScaleChage).toBeDefined();
    } )
  })

  it('get one diagram that it not exists', () => {
    return requestTest(app)
    .get(`/diagrams/5e471ttta8d5d22f35500694`)
    .set('Authorization', `Bearer ${token}`)
    .expect(HttpStatus.NOT_FOUND);
  })

  it('add collaborator', () => {
    return requestTest(app)
    .put(`/diagrams/${id}/add-collaboration`)
    .set('Authorization', `Bearer ${token}`)
    .send({username: 'username'})
    .expect(HttpStatus.OK);
  })

  it('add collaborator but name not exists', () => {
    return requestTest(app)
    .put(`/diagrams/${id}/add-collaboration`)
    .set('Authorization', `Bearer ${token}`)
    .send({username: 'ewgweg'})
    .expect(HttpStatus.NOT_FOUND);
  })
})