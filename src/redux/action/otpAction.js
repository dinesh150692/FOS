/* Library Import */
import Config from 'react-native-config';
import { ToastAndroid } from 'react-native';
/* Sentry Import */
import {Sentry} from 'react-native-sentry';
/* Component Import */
import { fetchAPISetup } from '../../shared/fetch';
import { handleGenericError, handleUnauthorizedCase } from '../../components/common/errorHandler';
/* Action Import */
import { closeOTPModal, openOTPModal } from './modalAction';
import { getFetchHeaders } from './fetchHeaderAction';
/* Constant Import */
import { ACTION_TYPE } from '../actionType';
import { ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';

const MERCHANT_ONBARDING_URL = Config.MERCHANT_ONBARDING_URL;
const SEND_OTP = Config.SEND_OTP;
const VERIFY_OTP = Config.VERIFY_OTP;

/** Action to clear the otp token on success
 * 	@return {Object} 
 */
export function clearOTPToken(){
    return { type: ACTION_TYPE.CLEAR_OTP_TOKEN};
}

/** Makes http API call to get the super categories
 * 	Dispactches to save response in store on success
 * 	@return {Promise} 
 */
export function sendOTP(details) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = MERCHANT_ONBARDING_URL + SEND_OTP;
        const headers = getFetchHeaders();
        return fetchAPISetup(url,'POST', details, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success && result.data.data.hasOwnProperty('token') && result.data.data.token){
                let token = result.data.data.token;
                dispatch({ type: ACTION_TYPE.UPDATE_OTP_TOKEN, token});
                dispatch(openOTPModal());
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    if(result.data.hasOwnProperty('context') && Object.keys(result.data.context).length > 0 && result.data.context.hasOwnProperty('retryAfter')){
                        let timeOut = result.data.context.retryAfter ? result.data.context.retryAfter : 60;
                        this.setState({timeOut, banned: true});
                        if (typeof(this.timerCountDown) !== 'undefined'){
                            this.timerCountDown();
                        }
                    }
                    handleGenericError(result);
                }
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
            return null;
        }).catch(error => {
            Sentry.captureException(error);
            ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };

}


/** Makes http API call to get the super categories
 * 	Dispactches to save response in store on success
 * 	@return {Promise} 
 */
export function verifyOTP(details) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = MERCHANT_ONBARDING_URL + VERIFY_OTP;
        const headers = getFetchHeaders();
        return fetchAPISetup(url,'POST', details, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success && result.data.data.hasOwnProperty('verified') && result.data.data.verified){
                this.props.onSuccess();
                dispatch(clearOTPToken());
                dispatch(closeOTPModal());
            }else {
                if(handleUnauthorizedCase(result, dispatch)){
                    let error = handleGenericError(result, false);
                    if(result.data.hasOwnProperty('context') && Object.keys(result.data.context).length > 0 && result.data.context.hasOwnProperty('retryAfter')){
                        
                        let timeOut = result.data.context.retryAfter ? result.data.context.retryAfter : 60;
                        this.setState({timeOut, banned: true});
                        if (typeof(this.timerCountDown) !== 'undefined'){
                            this.timerCountDown();
                        }
                    }
                    this.setState({ otpError: error, otp: ['','','','','']}, () => {
                        this.handleInputValidation();
                    });
                    this.ref[0] && this.ref[0].focus();            
                }
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            Sentry.captureException(error);
            this.setState({ otpError: ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, otp: ['','','','','']}, () => {
                this.handleInputValidation();
            });
            this.ref[0] && this.ref[0].focus();  
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };   

}

