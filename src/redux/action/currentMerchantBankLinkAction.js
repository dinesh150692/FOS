/* Library Import */
import Config from 'react-native-config';
import { ToastAndroid } from 'react-native';
/* Component Import */
import { fetchAPISetup, fetchGetAPI } from '../../shared/fetch';
import { goToPage } from '../../components/common/logout';
import { handleGenericError, handleUnauthorizedCase } from '../../components/common/errorHandler';
/* Sentry Import */
import {Sentry} from 'react-native-sentry';
/* Constant Import */
import { ACTION_TYPE } from '../actionType';
import { ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';
/* Action Import */
import { getFetchHeaders } from './fetchHeaderAction';

const MERCHANT_ONBARDING_URL = Config.MERCHANT_ONBARDING_URL;
const SEND_LINK_SMS = Config.SEND_LINK_SMS;

/** Action dispatch to save the data in the store as bank list
 *  @param  {Array} bankLinkList  
 * 	@return {Object}    
 */
export function loadLinkedBankList(bankLinkList) {
    return { type: ACTION_TYPE.LOAD_BANK_LINKED_LIST, bankLinkList };
}

/** Makes http API call to get the csrf-token
 * 	Dispactches to save response in store on success
 * 	@return {Promise} 
 */
export function getLinkedBankList(merchantId) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = MERCHANT_ONBARDING_URL + 'merchants/' + merchantId + '/accounts';
        const headers = getFetchHeaders();
        return fetchGetAPI(url, null, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success ){
                if(result.data.data.length > 0){
                    dispatch(loadLinkedBankList(result.data.data));
                    if(result.data.data.length === 1){
                        this.setState({linkedBank: result.data.data[0].accountId});
                    }
                }else{
                    dispatch(loadLinkedBankList([]));
                }
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    error = handleGenericError(result, false);
                    this.setState({error});
                    dispatch(loadLinkedBankList([]));
                    if(result.data.hasOwnProperty('code') && result.data.code === "USER_NOT_REGISTERED"){
                        this.setState({error: 'USER_NOT_REGISTERED'});
                    }
                }
            }
            setTimeout(() => {
                dispatch({ type: ACTION_TYPE.END_API_CALL });  
            }, 300);       
        }).catch(error => {
            dispatch(loadLinkedBankList([]));
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
            Sentry.captureException(error);
            this.setState({error: ERROR_CODES_AND_MESSAGES.GENERIC_ERROR});
        });
    };

}


/** Makes http API call to get the csrf-token
 * 	Dispactches to save response in store on success
 * 	@return {Promise} 
 */
export function linkBankAccount(merchantId, bankDetails) {
    return dispatch => {
        if(bankDetails.hasOwnProperty('accountId') && bankDetails.accountId){
            const url = MERCHANT_ONBARDING_URL + 'merchants/' + merchantId + '/accounts/' + bankDetails.accountId + '/migrate';
            const headers = getFetchHeaders();
            return fetchAPISetup(url, 'POST', {}, headers).then(result => {
                if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){
                    this.setState({loading: false, success: true});
                    setTimeout(() => {
                        goToPage('ReviewDetails');
                    }, 1000);
                }else{
                    if(handleUnauthorizedCase(result, dispatch)){
                        handleGenericError(result);
                        this.setState({loading: false});
                    }
                }   
            }).catch(error => {
                Sentry.captureException(error);
                this.setState({loading: false});
                ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            });
        }
    };
}


/** Makes http API call to get the csrf-token
 * 	Dispactches to save response in store on success
 * 	@return {Promise} 
 */
export function sendLinkSMS(details) {
    return dispatch => {
        const url = MERCHANT_ONBARDING_URL + SEND_LINK_SMS;
        const headers = getFetchHeaders();
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        return fetchAPISetup(url, 'POST', details, headers).then(result => {
            console.log('sendLinkSMS', result);
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){
                dispatch({type: ACTION_TYPE.MODAL.SMS_LINKING.CLOSE});
                goToPage('LinkingBank');
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    handleGenericError(result);
                }
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });    
        }).catch(error => {
            Sentry.captureException(error);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
            ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
        });
    };
}