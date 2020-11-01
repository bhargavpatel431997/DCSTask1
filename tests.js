const express = require('express');
const createError = require('http-errors');
const app = express();
const VisitorMetricRoute = require('./Routes/VisitormetricController.route');
const request = require('supertest');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/metric', VisitorMetricRoute);


app.set('cache', {});
const interval = 10;
app.set('interval', interval);

//404 handler and pass to error handler
app.use((req, res, next) => {
  next(createError(404, 'Not found'));
});
//Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

// test 1
describe('POST /metric/{KEY} with valid value e.g., 120.33', function () {
  it('Responds with blank json', function (done) {
    request(app)
      .post('/metric/active_visitors')
      .send({ value: 120.33 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

// test 2
describe('POST /metric/{KEY} with invalid value e.g., blah', function () {
  it('Responds with 400 error status with message Invalid value passed', function (done) {
    request(app)
      .post('/metric/active_visitors')
      .send({ value: "blah" })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, { "error": { "status": 400, "message": "Invalid value passed." } })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

// test 3
describe('GET /metric/{KEY}/sum.', function () {
  it('Responds with 200 status with value = 120', function (done) {
    request(app)
      .get('/metric/active_visitors/sum')
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        value: 120
      })
      .end(function (err, res) {
        if (err) return done(err);

        return done();
      });
  });
});

// test 4
describe('GET /metric/{KEY}/sum where KEY is wrong.', function () {
  it('Responds with 404 status with message Invalid key passed', function (done) {
    request(app)
      .get('/metric/blah/sum')
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, 
        { "error": { "status": 404, "message": "Invalid key." } }
      )
      .end(function (err, res) {
        if (err) return done(err);

        return done();
      });
  });
});

// test 5
describe('GET /metric/{KEY}/sum after Interval of ' + interval + ' seconds.', function () {
  it('Responds with 200 status & body value = 0', function (done) {
    this.timeout((interval * 1000) + 100);
    setTimeout(() => request(app)
      .get('/metric/active_visitors/sum')
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        value: 0
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      }),
      interval * 1000
    )
  });
});