const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');

const port = process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost/planet_test_db';

const server = require(__dirname + '/../server.js');
var Planet = require(__dirname + '/../model/model.js');

// POST
describe('Deal with the server', () => {

  after((done) => {
    server.stop(() => {
      console.log('stopped the server');
      // process.exit()
    });
    done();
  });

describe('POST method', () => {
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should create a new Planet', (done) => {
    request('localhost:' + port)
    .post('/planets')
    .send({ name: 'Pluto', color: 'black', size: 'small',
    moonsNumber: 1 })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.name).to.eql('Pluto');
      done();
    });
  });
});

describe('GET method', () => {
  it('should get planet data', (done) => {
    request('localhost:' + port)
    .get('/planets')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body).to.eql([]);
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
    .put('/planets/' + this.planet.name)
    .send({ name: 'Pluto', color: 'gold', size: 'large', moonsNumber: 88 })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.color).to.eql('gold');
      done();
    });
  });

  it('DELETE, should DESTRY a planet!', (done) => {
    request('localhost:' + port)
    .delete('/planets/' + this.planet.name)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.message).to.eql('OMG! We destroyed a planet!');
      done();
    });
  });
});
});
