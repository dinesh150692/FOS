/* Library Imports */
import Config from 'react-native-config';
import { ToastAndroid } from 'react-native';
/* Sentry Import */
import {Sentry} from "react-native-sentry";
/* Component Imports */
import { fetchAPISetup } from '../../shared/fetch';
import { goToPage } from '../../components/common/logout';
import { handleGenericError, handleUnauthorizedCase } from '../../components/common/errorHandler';
/* Action Imports */
import { closeAddNotificationModal } from './modalAction';
import { getFetchHeaders } from './fetchHeaderAction';
import { loadCurrentMerchantOnboardingStage } from './currentMerchantAction';
/* Constant Imports */
import { ACTION_TYPE } from '../actionType';
import { NOTIFICATION_DELETED, QRCODE } from '../../shared/constants';
import { ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';


const NOTIFICATION_URL = Config.MERCHANT_ONBARDING_URL;

/** Action dispatch to save the data in the store as notification list
 *  @param  {Object}  numberItem
 * 	@return {Object}    
 */
export function addToNotificationList(item, type) {
    if(type === QRCODE){
        return { type: ACTION_TYPE.ADD_NOTIFICATION_FOR_QRCODE, item };
    }
}

/** Action dispatch to remove the data in the store from notification list
 *  @param  {Object}  numberItem
 * 	@return {Object}    
 */
export function removeFromNotificationList(item, type) {
     if(type === QRCODE){
        return ({ type: ACTION_TYPE.REMOVE_NOTIFICATION_FOR_QRCODE, item});
    }
}

/** Makes http API call to add a notification
 * 	Dispatches to save response in store on success
 * 	@return {Promise} 
 */
export function addNotification(type, data, item){
    return dispatch => {
        let itemName = item[this.state.itemClicked].name;
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = NOTIFICATION_URL + type + '/' + itemName + '/notification';
        const headers = getFetchHeaders();
        return fetchAPISetup(url,'POST',data, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success && result.data.data.hasOwnProperty('enabled') && result.data.data.enabled){
                item[this.state.itemClicked].notificationList.push(result.data.data);
                dispatch(addToNotificationList(item, type));
                dispatch(closeAddNotificationModal());
                this.setState({loading: false, openNotification: false});
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    handleGenericError(result);
                    this.setState({loading: false});
                }
            } 
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            Sentry.captureException(error);
            this.setState({ loading: false, error: ERROR_CODES_AND_MESSAGES.GENERIC_ERROR});    
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };

}

/** Makes http API call to remove a notification
 * 	Dispatches to save response in store on success
 * 	@return {Promise} 
 */
export function removeNotification(type, data, item, index, itemIndex, notificationList){
    return dispatch => {
        let itemName = item[index].name;
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = NOTIFICATION_URL + type + '/' + itemName + '/notification/deactivate';
        const headers = getFetchHeaders();
        return fetchAPISetup(url, 'PUT', data, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){
              notificationList.splice(itemIndex ,1);
              item[index].notificationList = notificationList;
              dispatch(removeFromNotificationList(item, type)); 
              ToastAndroid.show(NOTIFICATION_DELETED, ToastAndroid.LONG); 
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    handleGenericError(result);
                }
            } 
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            Sentry.captureException(error);
            ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };
}


/** Action dispatch to add a new qrcode/pos with phone number
 *  @param  {Object}  numberItem
 * 	@return {Object}    
 */
export function addToQRPOS(type, item) {
    if(type === QRCODE){
       return ({ type: ACTION_TYPE.ADD_NEW_QRCODE, item});
   }
}

/** Makes http API call to add a qr/pos
 * 	Dispatches to save response in store on success
 * 	@return {Promise} 
 */
export function addNewQRPOS(type, data, requestData, item){
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = NOTIFICATION_URL + type + '/' + data + '/assign';
        const headers = getFetchHeaders();
        return fetchAPISetup(url,'POST', requestData, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){
                item = this.processResult(data, item, result.data.data);
                dispatch(loadCurrentMerchantOnboardingStage('MAPPED'));
                dispatch(addToQRPOS(type, item));
                goToPage('AddQRPOS');
            }else {
                if(handleUnauthorizedCase(result, dispatch)){
                    error = handleGenericError(result);
                    if(error && ERROR_CODES_AND_MESSAGES[result.data.code] !== ERROR_CODES_AND_MESSAGES.UNAUTHORIZED){
                        goToPage('AddQRPOS');                    
                    }
                }
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            Sentry.captureException(error);
            goToPage('AddQRPOS');
            ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };

}
