# Recent Visitors

## Installation Procedure
`npm install`<br>
`npm install -g mocha`

## Test Description
Run tests: `mocha tests.js`
### test 1: 
`POST /metric/active_visitors`<br>
`REQUEST: {'value':120.33}`<br>
`RESPONSE: {}`<br>
`STATUS: 200`<br>

### test 2: 
`POST /metric/active_visitors`<br>
`REQUEST: {'value':'Not a number 120.33'}`<br>
`RESPONSE: { "error": { "status": 400, "message": "Invalid value passed." } }`<br>
`STATUS: 400`<br>

### test 3: 
`GET /metric/active_visitors/sum`<br>
`REQUEST: {}`<br>
`RESPONSE: { "value": 120 }`<br>
`STATUS: 200`<br>

### test 4: 
`GET /metric/WRONG_PATH/sum`<br>
`REQUEST: {}`<br>
`RESPONSE: { "error": { "status": 404, "message": "Invalid key." } }`<br>
`STATUS: 404`<br>

### test 5: Test after 10 seconds Interval (This interval is 1 hour in production but 10 seconds for the test)
`GET /metric/active_visitors/sum`<br>
`REQUEST: {}`<br>
`RESPONSE: { "value" : 0 }`<br>
`STATUS: 200`<br>



## Documentation
Please check `Docs/Docs.pdf`
