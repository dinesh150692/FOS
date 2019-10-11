import store from '../../../index';

let options = {};

export function getFetchHeaders(updateOptions = true) {
    if(!!options && options.hasOwnProperty('headers') && 
        options.headers.hasOwnProperty('X-CSRF-TOKEN') && 
        options.headers['X-CSRF-TOKEN'] &&
        // options.headers.hasOwnProperty('X-AGENT-ID') &&
        // options.headers['X-AGENT-ID'] &&
        options.headers.hasOwnProperty('X-DEVICE-FINGERPRINT') &&
        options.headers['X-DEVICE-FINGERPRINT'] &&
        updateOptions
    ){
        return options;
    }else{
        let  { devicePrint, loginDetails } = store.getState();
        options = {
            headers:{
                //'X-AGENT-ID': loginDetails.agentId,
                'X-DEVICE-FINGERPRINT': devicePrint,
                'X-CSRF-TOKEN': loginDetails.initialToken
            }
        }
        return options;
    }
}

export function clearFetchHeaders(){
    options = {};
}