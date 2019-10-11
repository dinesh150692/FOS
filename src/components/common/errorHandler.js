/* Library Import */
import { ToastAndroid } from 'react-native';
/* Component Imports */
import { logout } from '../common/logout';
/* Action Imports */
import { clearTimer } from '../../redux/action/timerAction';
import { closeAllModal } from '../../redux/action/modalAction';
import  { clearFetchHeaders } from '../../redux/action/fetchHeaderAction';
/* Constant Imports */
import { ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';
import {ACTION_TYPE} from "../../redux/actionType";

export function handleGenericError(result, display = true){
    if(result.data.hasOwnProperty('success') && !result.data.success){
        display && ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
        return ERROR_CODES_AND_MESSAGES.GENERIC_ERROR;
    }else{
        if(result.data && result.data.hasOwnProperty('code')){
            let error = ERROR_CODES_AND_MESSAGES[result.data.code] ? ERROR_CODES_AND_MESSAGES[result.data.code]: ERROR_CODES_AND_MESSAGES.GENERIC_ERROR
            display && ToastAndroid.show(error, ToastAndroid.LONG);
            return error;
        }else{
            display && ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            return ERROR_CODES_AND_MESSAGES.GENERIC_ERROR;
        }
    }
}

export function handleUnauthorizedCase(result, dispatch){
    if(result.data && result.data.hasOwnProperty('code') && ERROR_CODES_AND_MESSAGES[result.data.code] === ERROR_CODES_AND_MESSAGES.UNAUTHORIZED){
        logout();
        clearFetchHeaders();
        dispatch(clearTimer());
        dispatch(closeAllModal());
        dispatch({ type: ACTION_TYPE.CLEAR_DATA});
        return false;
    }else if(result.data && result.data.hasOwnProperty('code') && ERROR_CODES_AND_MESSAGES[result.data.code] === ERROR_CODES_AND_MESSAGES.SMS_VERIFICATION_EXPIRED){
        dispatch(clearTimer());
        return false;
    }
    return true;

}