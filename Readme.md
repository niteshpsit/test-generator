
## Test Cases Generator For RESTful APIS or node apis 

     Simple to generate node test cases for public and token based api within 1 minute

## Installation

```bash
$ npm install test-generator --save
$ npm install mocha --save
$ npm install superagent --save
$ npm install chai --save
```

## Quick start 
```js
var testGenerator = require("test-generator").testGenerator

config = {
    endpoint: "http://www.test.com/tests", // endpoint to generate test cases
    httpMethod: 'get', // http method 
    expectedRes: { name: "expected name" }, // expected response of api
    strictCheck: true, // true to deep check response otherwise false
    testFile: __dirname +'/testfile.js', // Absolute path , file name to write test cases. It should be unique for each api otherwise it will override the test cases
    loginCred: { // only for token based api
        session: 'token', // session type for now token
        key: 'eccess-token', // Your key name in header to pass token to call API
        endpoint: 'http://www.test.com/login', // endpoint point to login
        loginData: { username: 'test', password: 'test'} // login credentials for login
    }
}

testGenerator(config , (error, info)=>{
    /**
    * Here to check test cases generated or not
    * Info cantain test file name if test cases create successfully
    **/ 
})
```

## config docs

    endpoint: api endpoint to test { must be String }
    httpMethod: http method of api { must be String } 
    expectedRes: expected response from api { Any type except undefined }
    strictCheck: If you want to check expectedRes check strictly( deep check ), provide true 
    testFile: File name to write test { must be string with .js extension } 
    loginCred: Define only when api is need authentication with token to check {
        session: 'token',
        key: 'eccess-token',
        endpoint: 'http://www.test.com/login',
        loginData: Object or data to pass for login api
    }

##To Run Test Cases
```bash
$ mocha test
```
##Note
 
    Feel free to create issues or suggestions or reach directly to me 

##Requirements

    node js  6.3.1 or latest
