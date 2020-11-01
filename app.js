const express = require('express');
const createError = require('http-errors');
const app = express();
const VisitorMetricRoute = require('./Routes/VisitormetricController.route');
const logger = require("./logger");
const config = require("./INIT");
const fileName = "APP";
const methodName = "INIT";


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/metric', VisitorMetricRoute);


//In memory Cache object
app.set('cache', {});

logger({
  fileName,
  methodName,
  logMsg: "In memory cache object initialized"
});

// Interval in seconds to filter:
// e.g., vistior count before 7200 seconds which is 2 hours will not be considered into count
const interval = process.env.DEFAULT_INTERVAL || config.DEFAULT_INTERVAL || 2 * 60 * 60;

app.set('interval',  interval);

logger({
  fileName,
  methodName,
  logMsg: "Initial Interval for active visitor count: " + interval / 3600 + " hours"
});

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger({ fileName, methodName, logMsg: 'Server started on port ' + PORT + ' ...' });
});
