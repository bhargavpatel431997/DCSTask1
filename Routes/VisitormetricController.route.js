const express = require('express');
const router = express.Router();

const VisitormetricController = require('../Controllers/Visitormetric.Controller');

//Get a visitors sum by {key}
router.get('/:key/sum', VisitormetricController.getMetricSumByKey);

//Create or update a new key for Visitors 
router.post('/:key/', VisitormetricController.createOrUpdateMetric);

module.exports = router;
