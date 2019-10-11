/* Library Imports */
import Config from 'react-native-config';

/* Constant Imports */
import { SERVER_ERROR } from '../shared/constants';
import {ERROR_CODES_AND_MESSAGES,LOGIN_ERROR_CODES_AND_MESSAGES} from '../shared/errorCodes';

const baseUrl = Config.API_BASE_URL;
const appId = Config.APP_ID;

/** Function to set options with headers, method to be sent in Fetch API call
 *	@param	{String}	methodType
 *	@return {Object}	options
 */
function setOptions(methodType, optionsConfig) {
	let options = {
		method : methodType,
		headers: {
			'Accept': '*/*',
			'content-type': 'application/json'
		}
    };
	options.headers['X-APP-ID'] = appId;
	if (optionsConfig) {
		options.headers = {...options.headers, ...optionsConfig.headers};
	}
	return options;
}

/** function to check if provided param in valid JSON string
 *	@param	{String}    str
 *	@return	{Boolean}    
 */
function isJson(str) {
	try {
		return (JSON.parse(str) && !!str);
	} catch (e) {
		return false;
	}
}

/** Handles response and error from fetch API
 *	@param	{Object}	response
 *	@return {Promise}	response/error
 */
function handleErrors(response) {
	let resp = {};
	//need to store csrf token
	resp.headers = response.headers.map['x-csrf-token'] ? response.headers.map['x-csrf-token'][0] : '';
	let status = Number(response.status);
	//success response
	if(status >= 200 &&  status < 300){
		return response.text().then(str => { 
			let isDataJson = isJson(str);
			let data = '';
			if (isDataJson) {
				data = JSON.parse(str);
				resp.data = data;
			}else{
				resp.data = {
					code: SERVER_ERROR,
					message: ERROR_CODES_AND_MESSAGES.GENERIC_ERROR
				}
			}
			return resp;
		});
	}else{
		// checks for error
		console.log(response);
		return response.text().then(str => {
			console.log('error resp:',str);
			let isDataJson = isJson(str);
			let data = '';
			if (isDataJson) {
				console.log('error json');
				data = JSON.parse(str);
				let code = data.code || data.errorCode;
				resp.data = {
					code: code,
					context: data.context || {},
					message: ERROR_CODES_AND_MESSAGES[code] || LOGIN_ERROR_CODES_AND_MESSAGES[code]
				}
			}else{
				console.log('error NOT json');
				resp.data = {
					code: SERVER_ERROR,
					message: ERROR_CODES_AND_MESSAGES.GENERIC_ERROR
				}
			}
			return resp;
		});
	}
}

/** Fetch API call for GET APIs
 *	@param	{String}	apiUrl
 *	@return {Promise}	response/error
 */
export function fetchGetAPI(apiUrl, data, headers) {
	let options = headers ?  setOptions('GET', headers) : setOptions('GET');
	if (data) {
		options.qs = data;
	}
	let resp ={};
	let url = baseUrl + apiUrl;
	// console.log('URL:',url);
    console.log("fetchGetAPI --> options",options, url);
    return fetch(url, options)
		.then(handleErrors)
		.then((responseJson) => {
			return (responseJson === undefined) ? [] : responseJson;
		})
		.catch((error) => {
			// console.log("ERROR MESSAGE IN GET API CALL ----- " + error);
			if(error.toString() === 'TypeError: Network request failed'){
				resp.data = {
					code: SERVER_ERROR,
					message: ERROR_CODES_AND_MESSAGES.NETWORK_ERROR
				}
				return resp;
			}else{
				throw Error(error);
			}
		});
}

/** Fetch API call for POST, PUT, DELETE APIs
 *	@param	{String}	apiUrl
 *	@param	{String}	methodType
 *	@param	{String}	data					req.body to be passed
 *	@return	{Promise}	response/error
 */
export function fetchAPISetup(apiUrl, methodType, data, optionsConfig) {
	let options = setOptions(methodType, optionsConfig);
	if (data) options.body = JSON.stringify(data);
	let url = baseUrl + apiUrl;
	let resp ={};
	// console.log('data:',data);
	// console.log('url:',url);
    console.log("fetchAPISetup --> options",options, url);
	return fetch(url, options)
		.then(handleErrors)
		.then((response) => {
			console.log('Post API Response: ',response);
			return response;
		})
		.catch((error) => {
			console.log("ERROR MESSAGE IN OTHER THAN GET API CALLS ----- " + error);
			if(error.toString() === 'TypeError: Network request failed'){
				resp.data = {
					code: SERVER_ERROR,
					message: ERROR_CODES_AND_MESSAGES.NETWORK_ERROR
				}
				return resp;
			}else{
				throw Error(error);
			}
		});
}

/** Fetch API call for file upload
 *	@param	{Object}	file
 *	@param	{String}	apiUrl
 *	@param	{String}	methodType
 *	@param	{String}	data					req.body to be passed
 *	@return	{Promise}	response/error
 */
export function fetchAPIFileUpload(file, apiUrl, methodType, data, optionsConfig) {
	let options = setOptions(methodType, optionsConfig);
	delete options.headers['content-type'];
	delete options.headers['Accept'];	
	// console.log("fetchAPIFileUpload --> options",options);
	const formData = new FormData();
	formData.append('category', data.category);
	formData.append('type', data.type);
	formData.append('merchantId', data.merchantId);
	if (data.stageUpdate != undefined) {
        formData.append('stageUpdate', data.stageUpdate);
	}
	// formData.append('update', true);
	formData.append('file', {uri: file.uri, type: 'image/jpeg', name: file.uri.split('/').pop(), filename: file.uri.split('/').pop()});
	options.body = formData;
	let url = baseUrl + apiUrl;
	let resp ={};
	console.log('url:',url);
	return fetch(url, options)
		.then(handleErrors)
		.then((response) => {
			console.log('Post API Response: ',response);
			return response;
		})
		.catch((error) => {
			console.log("ERROR MESSAGE IN OTHER THAN GET API CALLS ----- " + error);
			if(error.toString() === 'TypeError: Network request failed'){
				resp.data = {
					code: SERVER_ERROR,
					message: ERROR_CODES_AND_MESSAGES.NETWORK_ERROR
				}
				return resp;
			}else{
				throw Error(error);
			}
		});
}