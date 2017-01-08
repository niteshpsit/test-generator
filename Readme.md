
## Test Cases Generator For RESTful APIS or node apis , token or cookies based

    Simplest way generate test cases for 'public' or 'token' or 'cookies' based api  within one minute

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
    body: {}, // body to pass to the api { 'username': 'test', 'password': 'test' } 
    strictCheck: true, // true to deep check response otherwise false
    testFile: __dirname +'/testfile.js', // Absolute path , file name to write test cases. It should be unique for each api otherwise it will override the test cases
    // loginCred pass only if api is need  authentication based or 'token' or 'cookies'
    loginCred: {
        session: 'token', // 'token' or 'cookies'
        key: 'eccess-token', // your token key only if session is token based
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
    body: data to pass to the api { Object }
    strictCheck: If you want to check expectedRes check strictly( deep check ), provide true 
    testFile: File name to write test { must be string with .js extension } 
    Define only when api is need authentication with 'token' or 'cookies' based
    loginCred: {
        session: 'token',// 'cookies' or 'token'
        key: 'eccess-token',// your token key only if session is token based
        endpoint: 'http://www.test.com/login',
        loginData: Object or data to pass for login api
    }

##To Run Test Cases
```bash
$ npm install mocha --save
$ npm install superagent --save
$ npm install chai --save
$ mocha test
```
##Note
 
    Feel free to create issues or suggestions or reach directly to me 

##Requirements

    node js  6.3.1 or latest
