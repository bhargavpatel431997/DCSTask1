# Recent Visitors

## Installation
`npm install`<br>
`npm install -g mocha`

## Deployed Link
(Disabled) https://dcstask1.herokuapp.com/

## Documentation
Please check <a href="https://github.com/bhargavpatel431997/DCSTask1/blob/master/Docs/Docs.pdf">Docs/Docs.pdf</a>

## Test Description
Test app with the different scenario.<br>
Run App: `npm start`<br>
Run Tests: `npm test`

### Test 1: Valid request value

`POST /metric/active_visitors` <br>
`REQUEST:  {'value':120.33}` <br>
`RESPONSE: {}`<br>
`STATUS: 200` <br>

### Test 2: Invalid request value
`POST /metric/active_visitors`<br>
`REQUEST: {'value':'Not a number 120.33'}`<br>
`RESPONSE: { "error": { "status": 400, "message": "Invalid value passed." } }`<br>
`STATUS: 400`<br>

### Test 3: Response of rounded value
`GET /metric/active_visitors/sum`<br>
`REQUEST: {}`<br>
`RESPONSE: { "value": 120 }`<br>
`STATUS: 200`<br>

### Test 4: Wrong URI
`GET /metric/WRONG_PATH/sum`<br>
`REQUEST: {}`<br>
`RESPONSE: { "error": { "status": 404, "message": "Invalid key." } }`<br>
`STATUS: 404`<br>

### Test 5: Check recent visitors after 10 seconds Interval (This interval is 1 hour in production but 10 seconds for the test)
`GET /metric/active_visitors/sum`<br>
`REQUEST: {}`<br>
`RESPONSE: { "value" : 0 }`<br>
`STATUS: 200`<br>

### Passed All Test Cases
<img src="https://github.com/bhargavpatel431997/DCSTask1/blob/master/Docs/Five%20Test%20passed.png"/>

## Logging
Added internal debug level logs for the application.
<img src="https://github.com/bhargavpatel431997/DCSTask1/blob/master/Docs/Debug%20Level%20Log.png"/>
