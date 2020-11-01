const createError = require('http-errors');
const fileName = "Visitormetric.Controller";
const logger = require("../logger");
const manageCache = async function (cache, interval, value, key, currentTime = null) {
  // UTILITY METHOD TO MANAGE CACHE
  // cache : in memory cache object
  // interval: application time interval to consider visit counts as active 
  // value: post request body value.
  // key: localhost/metric/{KEY}
  // currentTimestamp: current time in integer
  // Time Complexity: O(T) where T is number of expired time stamp value available in cache for key
  currentTime = currentTime == null ? parseInt((new Date().getTime() / 1000).toFixed(0)) : currentTime;
  var index = 0;
  var valueToDeduct = 0;
  while (index < cache[key]["list"].length) {
    if (currentTime - cache[key]["list"][index][0] < interval) {
      index = (index == 0) ? -1 : index;
      break;
    }
    index++;
    if (cache[key]["list"][index] !== undefined)
      valueToDeduct += cache[key]["list"][index][1];
  }
  cache[key]["sum"] -= valueToDeduct;
  cache[key]["sum"] += value;
  if (index != -1) {
    cache[key]["list"].splice(0, index);
  }
  cache[key]["sum"] = cache[key]["list"].length == 0 ? 0 : cache[key]["sum"];
  return cache
}



module.exports = {
  createOrUpdateMetric: async (req, res, next) => {
    /**
     * @api {post} /metric/:KEY Request to create or update current visitor counts for the dynamic KEY|Path.
     * @apiName createOrUpdateMetric
     * @apiGroup Visitormetric
     * @apiParam {String} KEY dynamic path param.
     * @apiParam {Number} value request body field to update visitor counts.
     * @apiSuccess {Object} object blank object response i.e, {}.
     * @apiError {Object} object status code 400 if wrong data passed e.g., {error:{status:400, message:"Invalid value passed."}}
     */

    const methodName = "createOrUpdateMetric";
    var logMsg = "";
    const key = req.params.key;
    logMsg = "In comming request to add visitor count for the Path: " + key;
    logger({ fileName, methodName, logMsg });

    // global app object for interval filter
    const interval = req.app.get("interval");
    // POST request body value 
    var value = Number(req.body["value"]);
    // In memory cache object 
    var cache = req.app.get("cache");
    // Current Time in integer(seconds)
    const currentTime = parseInt((new Date().getTime() / 1000).toFixed(0));

    try {
      // if POST request contains garbage value. e.g.,{value: "20esdfd"}
      if (isNaN(value))
        throw createError(400, "Invalid value passed.");

      // round value to nearest integer
      value = Math.round(value);

      // if KEY is already in cache then
      if (key in cache) {
        // if value is zero then there is no need to update the cache
        if (value != 0) {

          // to keep track of the expired time stamps, [Timestamp, Value] object is pushed into list
          cache[key]["list"].push([currentTime, value]);

          // efficient cache management 
          cache = await manageCache(cache, interval, value, key, currentTime);
          req.app.set("cache", cache);
          res.send({});

          logMsg = "Success. None zero value request."
          logger({ fileName, methodName, logMsg });
        }
        else {

          logMsg = "Success but value was zero."
          logger({ fileName, methodName, logMsg });
          res.send({});
        }
      }
      else {
        // if KEY is not in cache then create unique object in cache for the new KEY.
        // cache object {KEY1: {list:[TimeStamp, Value], sum:"sum of values of the list"}
        //               KEY2: {list:[TimeStamp, Value], sum:"sum of values of the list"}}
        // for different KEY, different object will be added into cache.
        // e.g.,  {  active_visitors: {  list: [[34234234, 5], [34234234, 4]], sum: 9  }  
        //           latest_visitors: {  list: [[40234234, 10], [45634234, 4]], sum: 14  } }
        logMsg = "Its First request for the path " + key + "."
        logger({ fileName, methodName, logMsg });
        req.app.set("cache", { ...cache, ...{ [key]: { list: [[currentTime, value]], sum: value } } });
        res.send({});
      }

    } catch (error) {
      logger({ fileName, methodName, logMsg: error.message }, "error");
      next(error);
    }
  },

  getMetricSumByKey: async (req, res, next) => {
    /**
     * @api {get} /metric/:KEY/sum Request to get latest visitor counts for the dynamic KEY|Path.
     * @apiName getMetricSumByKey
     * @apiGroup Visitormetric
     * @apiParam {String} KEY dynamic path param.
     * @apiSuccess {Object} Object Response object e.g., {value : 10} for the given KEY|Path.
     * @apiError {Object} Object status code 404 if wrong KEY|Path requested.
     */

    const methodName = "getMetricSumByKey";
    var logMsg = "";

    const key = req.params.key;
    const interval = req.app.get("interval");
    var cache = req.app.get("cache");
    try {
      // if key is in cache object then send current visitors count
      // else respond with bad request status
      logMsg = "Incomming request for the path " + key + "."
      logger({ fileName, methodName, logMsg });

      if (key in cache) {
        cache = await manageCache(cache, interval, 0, key);
        req.app.set("cache", cache);
        res.send({ value: cache[key]['sum'] });
        logMsg = "Success Path:" + key + " value sent."
        logger({ fileName, methodName, logMsg });
      } else {

        throw createError(404, "Invalid key.");
      }
    } catch (error) {
      logger({ fileName, methodName, logMsg: error.message }, "error");
      next(error);
    }
  }

};
