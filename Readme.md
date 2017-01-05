
## Test Case Generator For RESTful APIS

     Simple to generate node test cases for public and token based api within 1 minute

## Installation

```bash
$ npm install test-generator --save
```

## Quick start 
```js
var testGenerator = require("test-generator").testGenerator

config = {
    endpoint: "http://www.test.com/tests", // endpoint to generate test cases
    httpMethod: 'get', // http method 
    expectedRes: { name: "expected name" }, // expected response of api
    strictCheck: true, // true to deep check response otherwise false
    testFile: 'test.js', // file name to write test cases
    loginCred: { // only for token based api
        session: 'token', // session type for now session
        key: 'eccess-token', // Your key name in header to pass token to call API
        endpoint: 'http://www.test.com/login', // endpoint point to login
        loginData: Object or data to pass login api // login credentials for login
    }
}

testGenerator(config , (error, info)=>{
    // Here to check test cases generated or not
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
