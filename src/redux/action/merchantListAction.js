/* Library Import */
import Config from 'react-native-config';
import { ToastAndroid } from 'react-native';
/* Component Import */
import { fetchGetAPI } from '../../shared/fetch';
import { handleGenericError, handleUnauthorizedCase } from '../../components/common/errorHandler';
/* Action Import */
import { getFetchHeaders } from './fetchHeaderAction';
/* Constant Import */
import { ACTION_TYPE } from '../actionType';
import {  ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';
/* Sentry Import */
import {Sentry} from 'react-native-sentry';

const MERCHANT_ONBARDING_URL = Config.MERCHANT_ONBARDING_URL;
/** Action dispatch to save the data in the store as merchant list
 *  @param  {Array}     list
 * 	@return {Object}    
 */
export function loadMerchantList(merchantList) {
    return { type: ACTION_TYPE.LOAD_MERCHANT_LIST, merchantList };
}

/** Action dispatch to save the data in the store as merchant count detail
 *  @param  {Object}     merchantCount
 * 	@return {Object}    
 */
export function updateMerchantOnboardedCount(merchantCount) {
    return { type: ACTION_TYPE.UPDATE_MERCHANT_ONBOARDED_COUNT, merchantCount };
}

/** Action dispatch to save the clear the timer
 * 	@return {Object}
 */
export function clearMerchantListing() {
    return { type: ACTION_TYPE.CLEAR_TIMER };
}


/** Action dispatch to save the update in the store as search merchant list
 *  @param  {String} phoneNumber
 * 	@return {Object}    
 */
export function updateSearchList(phoneNumber) {
    return { type: ACTION_TYPE.UPDATE_MERCHANT_SEARCH_LIST,  phoneNumber};
}

/** Makes http API call to get the merchant list for the agent
 * 	Dispactches to save response in store on success
 * 	@return {Promise} 
 */
export function getMerchantList() {
    return dispatch => {
        const url = MERCHANT_ONBARDING_URL + 'merchants';
        const headers = getFetchHeaders(false);
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        console.log("getMerchantList --> response -->headers ",headers, url);
        return fetchGetAPI(url, null, headers).then(result => {
            // console.log("getMerchantList --> response -->",result);
            if(result && result.hasOwnProperty('data') && result.data && result.data.success){
                if(result.data.data.length > 0){
                    dispatch(loadMerchantList(result.data.data));
                }else{
                    dispatch(loadMerchantList([]));
                }
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    error = handleGenericError(result, false);
                    this.setState({error: error});  
                    dispatch(loadMerchantList([]));                  
                }
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            dispatch(loadMerchantList([]));
            Sentry.captureException(error);
            this.setState({error: ERROR_CODES_AND_MESSAGES.GENERIC_ERROR});
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };
}

// /** Makes http API call to get the merchant list for the agent
//  * 	Dispactches to save response in store on success
//  * 	@return {Promise} 
//  */
// export function searchMerchant(phoneNumber) {
//     return dispatch => {
//         const url = MERCHANT_ONBARDING_URL + 'merchants/search?query=' + phoneNumber;
//         const headers = getFetchHeaders();
//         dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
//         return fetchGetAPI(url, null, headers).then(result => {
//             if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){
//                 if(result.data.data.constructor === Array && result.data.data.length > 0){
//                     dispatch(loadMerchantList(result.data.data));
//                     dispatch({ type: ACTION_TYPE.END_API_CALL });
//                 }else{
//                     ToastAndroid.show(ERROR_CODES_AND_MESSAGES.NO_MERCHANT_FOUND, ToastAndroid.LONG);
//                     dispatch({ type: ACTION_TYPE.END_API_CALL });
//                 }
//             }else {
//                 handleGeneralError.call(this, result);
//                 dispatch({ type: ACTION_TYPE.END_API_CALL });

//             }
//         }).catch(error => {
//             bugsnag.notify(error);
//             dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
//             ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
//         });
//     };
// }

/** Makes http API call to get the merchant count for the agent
 * 	Dispactches to save response in store on success
 * 	@return {Promise} 
 */
export function getMerchantOnboardedCount() {
    return dispatch => {
        const url = MERCHANT_ONBARDING_URL + 'merchants/count?stage=ACTIVE';
        const headers = getFetchHeaders(false);
        console.log("getMerchantList --> response -->headers ",headers, url);
        return fetchGetAPI(url, null, headers).then(result => {
            console.log(result);
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){
                dispatch(updateMerchantOnboardedCount(result.data.data));
            }else {
                if(handleUnauthorizedCase(result, dispatch)){
                    handleGenericError(result);
                    dispatch(updateMerchantOnboardedCount({today: 0,
                        lastMonth: 0,
                        currentMonth: 0
                    }));
                }
            }
        }).catch(error => {
            Sentry.captureException(error);
            dispatch(updateMerchantOnboardedCount({today: 0,
                lastMonth: 0,
                currentMonth: 0
            }));
            ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
        });
    };
}