const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');

const port = process.env.PORT = 4444;
process.env.MONGODB_URI = 'mongodb://localhost/planet_test_db';

require(__dirname + '/../server.js');
var Planet = require(__dirname + '/../model/model.js');

// POST
describe('POST method', () => {
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should create a new Planet', (done) => {
    request('localhost:' + port)
    .post('/planet')
    .send({ name: 'Pluto', color: 'black', size: 'small',
    moonsNumber: 1 })
    .end((err, res) => {
      expect(err).to.eql(null);
      // expect(res.status).to.eql(200);
      expect(res.body.name).to.eql('Pluto');
      done();
    });
  });
});

describe('GET method', () => {
  it('should get planet data', (done) => {
    request('localhost:' + port)
    .get('/planet')
    .end((err, res) => {
      expect(err).to.eql(null);
      // expect(Array.isArray(res.body.data)).to.eql(true);
      // expect(res.status).to.eql(200);
      done();
    });
  });
});

describe('PUT and DELETE', () => {
  beforeEach((done) => {
    var newPlanet = new Planet({ name: 'Pluto', color: 'black', size: 'small', moonsNumber: 1 });
    newPlanet.save((err, data) => {
      if(err) {
        console.log(err);
      }
      this.planet = data;
      done();
    });
  });
  afterEach((done) => {
    this.planet.remove((err) => {
      console.log(err);
      done();
    });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
  });
});

  it('PUT, should change a planet', (done) => {
    request('localhost:' + port)
    .put('/planet/' + this.planet.name)
    .send({ name: 'Pluto', color: 'gold', size: 'large', moonsNumber: 88 })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('Updated a Planet');
      done();
    });
  });

  it('DELETE, should DESTRY a planet!', (done) => {
    request('localhost:' + port)
    .delete('/planet/' + this.planet.name)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('OMG! We destroyed a planet!');
      done();
    });
  });
});
