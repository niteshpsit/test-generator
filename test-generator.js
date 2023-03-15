/**
 * Module Dependencies
 * @module fs : file mamipulation
 * @module path : path mamipulation
 **/
var fs = require('fs')
var path = require('path')
/**
 * To Get expected string 
 * @param { String } type type of testcases 
 * @param { String } compareKey compare key for test
 * @param { String } compareWith value to compare
 * @returns { String } A string representing a test case
 **/
function getExpected(type = 'isEmpty', compareKey = 'body', compareWith) {
    return compareWith ? `expect(${compareKey})${expectType[type]}(${compareWith})` : `expect(${compareKey})${expectType[type]}`
}
/**
 * To Get test cases dependencies
 * @returns { String } A string for test dependencies
 **/
function getDependencies() {
    return `var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var request = require('superagent').agent();
var token = null;
var key = null;`
}
/**
 * function To generate the descption for test
 * @param { String } endpoint to generate test cases
 * @param { String } httpMethod endpoint method
 * @param { Object } api body payload
 * @param { String } apiType api session type session or token
 * @returns { String } template for test cases
 **/
function getTestTemplate(endpoint, httpMethod = 'GET', body, apiType) {
    endpoint = JSON.stringify(endpoint)
    body = body && (body instanceof Object) ? JSON.stringify(body) : {}
    return `

describe('${httpMethod}: ${endpoint} API', function() {

    let response;
    let body;
    before((done)=>{
        request
		${httpMethods[httpMethod]}(${endpoint})${ (httpMethod != "get" && httpMethod != "GET") ? `.send(${body})` : ''}${apiType === 'token' ? '.set(key,token)' : ''}
		.end(function(err, res){
			response = res;
            body = res.body;
			done();
		})
    })
    ${getExpectTemp('isEqual', 'response.statusCode', 200)}`
}
/**
 * Template For Close test cases file
 **/
function getCloseBrases() {
    return `
});`
}
/**
 * API to get token 
 * @param { String } endpoint api endpoint for login
 * @param { string } httpMethod method for api
 * @param { Object } loginCred containing endpoint , key , session type and loginData object 
 * @returns { String } template for test cases
**/
function getTokenApi(endpoint, httpMethod = 'POST', loginCred, apiType) {
    endpoint = JSON.stringify(endpoint)
    let loginData = JSON.stringify(loginCred.loginData)
    let key = apiType === 'token' ? JSON.stringify(loginCred.key) : ''
    return `

describe('${httpMethod}: ${endpoint} API', function() {
    ${ apiType === 'token' ? `key = ${key}` : ''}
    let response;
    before((done)=>{
        request
		${httpMethods[httpMethod]}(${endpoint})
        .send(${loginData})
		.end(function(err, res){
			response = res;
            ${ apiType === 'token' ? 'token = response.headers[key] || response.body[key];' : ''}
			done();
		})
    })
    ${getExpectTemp('isEqual', 'response.statusCode', 200)}
    ${ apiType === 'token' ? `${getExpectTemp('isNotNull', 'token')}` : ''}
})`
}
/**
 * http method
 **/
let httpMethods = {
    get: '.get',
    GET: '.get',
    post: '.post',
    POST: '.post',
    put: '.put',
    PUT: '.put',
    delete: '.detele',
    DELETE: '.detele',
    all: '.all',
    ALL: '.all'
}
/**
 * function generate the defferent - 2 cases for api test and returns template
 * @param { String } type of cases to compare
 * @param { String } word for compare
 * @returns { String } template for case   
 **/
function getCaseDescription(type, word = '') {
    return `it('${testDes(type, word)}', () => {`
}
/** 
 *  @function : isTestFile function for check filepath is js file path or not
 *  @filepath : Simple file path
 *  @returns : boolean
 **/
function isJsFile(filepath = '') {
    let extension = path.extname(filepath)
    return ('.js' === extension)
}
/**
 * @param { String } path is the path of file to write the contents
 * @param { String } content is the mail contents to write in the file 
 **/
function writeToFile(testFile, content, callback) {
    if (!isJsFile(testFile))
        return callback(errorMsg['testFile'], null)
    testFile = testFile
    fs.writeFile(testFile, content, 'utf-8', callback);
}
/**
 * @param { String } type test case to be done
 * @param { String } word for display in descption
 * @returns { String } case template
 **/
function testDes(type, word = '') {
    let message = {
        isNotEmpty: 'should not be empty',
        isEmpty: 'should be empty',
        haveAnyKeys: 'should have any keys ' + word,
        haveAllKeys: 'should have all keys ' + word,
        typeOf: 'should be typeOf ' + word,
        haveKey: 'should have key ' + word,
        arrayInclude: 'array should include ' + word,
        stringContain: 'String should contain ' + word,
        truthy: 'should be truthy value',
        notTruthy: 'should not be truthy value',
        isTrue: 'should be true',
        isNotTrue: 'should not be true',
        isFalse: 'should be false',
        isNotFalse: 'should not be false',
        isNull: 'should be null',
        isNotNull: 'should not be null',
        isUndefined: 'should be undefined',
        isNotUndefined: 'should not be undefined',
        isEqual: 'should be equal to ' + word,
        isNotEqual: 'should not be equal',
        isDeepEqual: 'should be deep equal',
        instanceof: 'should be instanceof ',
        isExist: 'should not be null and undefined',
        object: 'should be an Object',
        array: 'should be an Array',
        string: 'should be an String',
        number: 'should be a Number',
        boolean: 'should be a boolean'
    }
    return message[type]
}
/**
 * An Object to just return the expect value or function to use in compare
 **/
let expectType = {
    isNotEmpty: '.not.to.be.empty',
    isEmpty: '.to.be.empty',
    haveAnyKeys: '.to.have.any.keys',
    haveAllKeys: '.to.have.all.keys',
    haveKey: '.to.include.keys',
    typeOf: '.to.be.an',
    arrayInclude: '.to.include',
    stringContain: '.to.contain',
    truthy: '.to.be.ok',
    notTruthy: '.to.not.be.ok',
    isTrue: '.to.be.true',
    isNotTrue: '.to.not.be.true',
    isFalse: '.to.be.false',
    isNotFalse: '.to.not.be.false',
    isNull: '.to.be.null',
    isNotNull: '.to.not.be.null',
    isUndefined: '.to.be.undefined',
    isNotUndefined: '.to.not.be.undefined',
    isEqual: '.to.equal',
    isNotEqual: '.to.not.equal',
    isDeepEqual: '.to.deep.equal',
    instanceof: '.to.be.an.instanceof',
    isExist: '.to.exist'
}
/**
 * assert libraty
 * @param { String } type of case
 * @param { String } value to compare
 * @returns { String } String representing a test case
 **/
function getAssertCase(type = 'object', value = '') {

    let assertLib = {
        object: `assert.isObject(${value}, "should is an object");`,
        array: `assert.isArray(${value}, "should is an array");`,
        string: `assert.isString(${value}, "should is an string");`,
        number: `assert.isNumber(${value}, "should is a number");`,
        boolean: `assert.isBoolean(${value}, "should is a boolean");`
    }
    return assertLib[type]
}
/**
 * Error messages
 **/
let errorMsg = {
    loginDetail: "login Detail in complete",
    endpoint: "API endpoint must be define",
    httpMethod: "API must be provided get, post, ....",
    expectedRes: "Expected response must be defined",
    strictCheck: "strictCheck must be boolean",
    testFile: "testfile name must be string with .js extension",
    loginCred: "To test provide api token based Please provide"
}
/**  
 * To get expect template
 * @param { String } type case to compare
 * @param { String } compareKey compare key
 * @param { String } compareTo value with which we compare our response
 * @returns { String} Simple template of test case
 **/
function getExpectTemp(type = 'isNotEmpty', compareKey = 'body', compareTo) {
    compareTo = compareTo !== undefined ? JSON.stringify(compareTo) : compareTo
    let descption = `${getCaseDescription(type, compareTo)}`
    let test = getExpected(type, compareKey, compareTo)
    return `
    ${descption}
        ${test}
    })`
}
/**
 * To get assert template
 * @param { String } type case to compare
 * @param { String } compareKey compare key
 * @returns { String } Simple template of test case 
 **/
function getAssertTemp(type = 'object', compareKey = 'body') {
    let descption = `${getCaseDescription(type, compareKey)}`
    let test = getAssertCase(type, compareKey)
    return `
    ${descption}
        ${test}
    })`
}
/**
 * To generate the test case for any object
 * @param { Object } testObject object for which we need to create test cases
 * @param { String } compareKey compare key in expected response
 * @param { boolean } strictCheck for compare deep check
 * @returns { String } A Simple String representing test cases for given object  
 **/
function getTCForObject(testObject, compareKey = 'body', strictCheck = false) {
    if (!(testObject instanceof Object))
        return
    let returnString = ''
    returnString += getAssertTemp('object', compareKey)
    let objectKeys = Object.keys(testObject)
    returnString += objectKeys.length === 0 ? getExpectTemp('isEmpty', compareKey) : getExpectTemp('haveAllKeys', compareKey, objectKeys)
    if (strictCheck) {
        for (let key in testObject) {
            let type = testObject[key] instanceof Array ? 'array' : (testObject[key] instanceof Object ? 'object' : 'isEqual')
            if (type == 'object' || type == 'array')
                returnString += getAssertTemp(type, compareKey + '.' + key)
            else
                returnString += getExpectTemp(type, compareKey + '.' + key, testObject[key])
        }
    }
    return returnString
}
/**
 * To generate the test case for any Array
 * @param { Array } testArray array for which we need to create test cases
 * @param { String } compareKey compare key in expected response
 * @returns { String } A Simple String representing test cases for given object
 **/
function getTCForArray(testArray, compareKey = 'body') {
    if (!(testArray instanceof Array))
        return
    let returnString = ''
    returnString += getAssertTemp('array', compareKey)
    if (testArray.length == 0)
        returnString += getExpectTemp('isEmpty', compareKey)
    else {
        let valueToTest = testArray[0]
        valueType = (valueToTest instanceof Array) ? 'array' : ((valueToTest instanceof Object) ? 'object' : typeof valueToTest)
        if (valueType === 'object') {
            returnString += getTCForObject(valueToTest, compareKey + '[0]')
        }
        else {
            returnString += getAssertTemp(valueType, compareKey + '[0]')
        }
    }
    return returnString
}
/**
 * function auto generate the test cases for given api
 * @param { Object } config defining the config data for generating test case 
 * config = {
 *   endpoint: "http://www.test.com/tests",
 *   httpMethod: 'get'/'post....',
 *   expectedRes: { name: "expected name" },
 *   body: {} // body to pass api { 'username': 'test', 'password': 'test' }  
 *   strictCheck: true/false,
 *   testFile: 'test.js',
 *   loginCred: {
 *      session: 'token', // 'token' or 'cookies'
 *      key: 'eccess-token',// only if session is token based
 *      endpoint: 'http://www.test.com/login',
 *      loginData: Object or data to pass login api
 *   }
 * }
 * Here is a descption of config object keys
 * endpoint: api endpoint to test { must be String }
 * httpMethod: http method of api { must be String } 
 * expectedRes: expected response from api { Any type except undefined }
 * body: data to pass to the api { Object }
 * strictCheck: If you want to check expectedRes check strictly( deep check ), provide true 
 * testFile: File name to write test { must be string with .js extension }
 * Define only when api is need authentication with 'token' or 'cookies' based  
 * loginCred: {
 *      session: 'token',// 'cookies' or 'token'
 *      key: 'eccess-token', // your token key only if session is token based
 *      endpoint: 'http://www.test.com/login',
 *      // Object or data to pass for login api
 *      loginData: {
 *          'password': 'test ',
 *          'username': 'test'
 *      }
 *   }
 **/
function genTestCases(config, callback) {
    const { endpoint, httpMethod, expectedRes, body, strictCheck, testFile, loginCred} = config
    if (!endpoint || (typeof endpoint !== 'string'))
        return callback(errorMsg['endpoint'], null)
    if (!httpMethod || (typeof httpMethod !== 'string'))
        return callback(errorMsg['httpMethod'], null)
    if (expectedRes === undefined)
        return callback(errorMsg['expectedRes'], null)
    if ((strictCheck === undefined) || (typeof strictCheck !== 'boolean'))
        return callback(errorMsg['strictCheck'], null)
    if (testFile !== undefined && typeof testFile !== 'string')
        return callback(errorMsg['testFile'], null)
    /**
     * Api type
     **/
    let apiType
    /** 
     * Get Dependencies
     **/
    let testContent = getDependencies()
    /**
     * check for provite apis
     **/
    if (loginCred && loginCred instanceof Object && !(loginCred instanceof Array)) {
        if (loginCred.session == 'token' || loginCred.session == 'cookies') {
            apiType = loginCred.session
            /**
             * Code Get executed when if API is token based authentication
             **/
            if (apiType === 'cookies' || (apiType === 'token' && ('key' in loginCred))) {
                testContent += getTokenApi(loginCred.endpoint, 'post', loginCred, apiType)
            } else {
                return callback(errorMsg.loginDetail, null)
            }

        }
        else {
            /**
             * For returing an error 
            **/
            return callback(errorMsg.loginDetail, null)
        }
    }
    /** 
     * Get Template 
    **/
    testContent += getTestTemplate(endpoint, httpMethod, body, apiType)
    /** 
     * common testcases for all apis irrespective of api's response
    */
    testContent += getExpectTemp('isNotNull', 'body')
    testContent += getExpectTemp('isNotUndefined', 'body')
    /**
     * check response is Array or String
     **/
    let resType = (expectedRes instanceof Array) ? 'array' : typeof expectedRes;
    /**
     * This code get executed when expected response is object
     **/
    if (resType === 'object') {
        testContent += getTCForObject(expectedRes, 'body', strictCheck)
    }
    /**
     * This code get executed when expected response is array
     **/
    else if (resType === 'array') {
        testContent += getTCForArray(expectedRes)
    }
    /**
     * This code get executed if executed response if neither object nor array 
     **/
    else {
        testContent += getAssertTemp(resType, 'body')
        testContent += getExpectTemp('isEqual', 'body', expectedRes)
    }
    /**
     * Get Close brackets
     **/
    testContent += getCloseBrases()
    /**
     * Write test case ( String ) in file
     **/
    writeToFile(testFile, testContent, (error, info) => {
        callback(error, info)
    });
}

exports.testGenerator = genTestCases
