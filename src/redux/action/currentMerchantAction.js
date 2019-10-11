/* Library Import */
import Config from 'react-native-config';
import { ToastAndroid } from 'react-native';
/* Sentry Import */
import {Sentry} from 'react-native-sentry';
/* Component Import */
import { fetchAPISetup, fetchGetAPI } from '../../shared/fetch';
import { goToPage } from '../../components/common/logout';
import { handleGenericError, handleUnauthorizedCase } from '../../components/common/errorHandler';
/* Constant Import */
import { ACTION_TYPE } from '../actionType';
import { NO_EMAIL, PAGE_NAVIGATION_TYPES, } from '../../shared/constants';
import { ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';
/* Action Import */
import {  getFetchHeaders } from './fetchHeaderAction';
import { updatePageType } from './pageTypeAction';

const MERCHANT_ONBARDING_URL = Config.MERCHANT_ONBARDING_URL;

function textFormatter(text){
    if(!text){
        return '';
    }
    text = text.replace(/_/gi, ' ').toLowerCase().split(' ');
    for (let i = 0; i < text.length; i++) {
      text[i] = text[i].charAt(0).toUpperCase() + text[i].substring(1);
    }
    text = text.join(' ');
    return text;
}


/** Action dispatch to save the id in the store as merchant id details
 *  @param  {Number} id  
 * 	@return {Object}    
 */
export function loadCurrentMerchantId(id) {
    return { type: ACTION_TYPE.UPDATE_MERCHANT_ID, id};
}

/** Action dispatch to save the onboarding in the store as
 * onboarding stage details
 *  @param  {String} onboardingStage
 * 	@return {Object}
 */
export function loadCurrentMerchantOnboardingStage(onboardingStage) {
    return { type: ACTION_TYPE.UPDATE_ONBOARDING_STAGE, onboardingStage};
}

/** Action dispatch to save the data in the store as merchant address details
 *  @param  {Object} addressDetails  
 * 	@return {Object}    
 */
export function loadCurrentAddressDetails(addressDetails) {
    return { type: ACTION_TYPE.UPDATE_MERCHANT_ADDRESS_DETAILS, addressDetails };
}

/** Action dispatch to that edit flow is happening
 *  @param  {Boolean} edit  
 */
export function updateEditFlowType(edit) {
    return { type: ACTION_TYPE.UPDATE_EDIT_FLOW_TYPE, edit };
}

/** Action dispatch to save the data in the store as merchant details
 *  @param  {Object} merchantDetails
 * 	@return {Object}    
 */
export function loadCurrentMerchantDetails(merchantDetails, categoryValues) {
    return { type: ACTION_TYPE.UPDATE_MERCHANT_DETAILS, merchantDetails, categoryValues };
}

/** Action dispatch to save the data in the store as merchant bank details
 *  @param  {Object} bankDetails
 * 	@return {Object}    
 */
export function loadCurrentMerchantBankDetails(bankDetails) {
    return { type: ACTION_TYPE.UPDATE_MERCHANT_BANK_DETAILS, bankDetails };
}


/** Action dispatch to save the data in the store as uploaded states
 *  @param  {Object} uploadedStates
 * 	@return {Object}
 */
export function updateUploadedStates(uploadedStates) {
    return { type: ACTION_TYPE.UPDATE_UPLOADED_STATES, uploadedStates };
}

/** Action dispatch to clear the data in the store
 */
export function clearMerchantDetails() {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.CLEAR_MERCHANT_DETAILS });
        dispatch({ type: ACTION_TYPE.CLEAR_NOTIFICATION_DETAILS});
    }
}

/** Makes http API call to create a merchant and
 * 	return the result
 * 	@param  {object}   details
 *  @param  {object}   header
 * 	@return {Promise} 
 */
export function createNewMerchant(details, addressDetails) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = MERCHANT_ONBARDING_URL + 'merchants';
        const headers = getFetchHeaders();
        return fetchAPISetup(url,'POST', details, headers).then(result => {
            if(result && result.data && result.data.success && result.data.data.hasOwnProperty('merchantId')){
                dispatch(updatePageType(PAGE_NAVIGATION_TYPES.BRANDING));
                dispatch(loadCurrentMerchantId(result.data.data.merchantId));
                dispatch(loadCurrentAddressDetails(addressDetails));
                dispatch(updatePageType(PAGE_NAVIGATION_TYPES.BRANDING));
                goToPage('Branding');
            }else {
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

/** Makes http API call to activate a merchant and
 * 	return the result
 * 	@param  {object}   details
 *  @param  {object}   header
 * 	@return {Promise} 
 */
export function activateMerchant(merchantId) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = MERCHANT_ONBARDING_URL + 'merchants/' + merchantId + '/activate';
        const headers = getFetchHeaders();
        return fetchAPISetup(url,'PUT', {}, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){
                this.props.startSuccessTimer();
                this.setState({loading: false});
                this.props.resetInitValue(false);
                goToPage("MerchantList")
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    handleGenericError(result);
                    this.setState({loading: false});   
                }
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
            return result;
        }).catch(error => {
            Sentry.captureException(error);
            ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };

}

/** Makes http API call to drop a merchant and
 * 	return the result
 * 	@param  {object}   details
 *  @param  {object}   header
 * 	@return {Promise} 
 */
export function dropMerchant(merchantId) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = MERCHANT_ONBARDING_URL + 'merchants/' + merchantId + '/drop';
        const headers = getFetchHeaders();
        return fetchAPISetup(url,'PUT', {}, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){
                goToPage('MerchantList');
            }else {
                if(handleUnauthorizedCase(result, dispatch)){
                    handleGenericError(result);
                    this.setState({loading: false});
                }
            }   
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            Sentry.captureException(error);
            this.setState({loading: false});
            ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };

}

/** Makes http API call to update a merchant address details and
 * 	return the result
 * 	@param  {object}   address
 *  @param  {string}   merchantId
 *  @param  {object}   header
 * 	@return {Promise} 
 */
export function updateCurrentMerchantAddressDetails(address, merchantId) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = MERCHANT_ONBARDING_URL + 'merchants/' + merchantId + '/address';
        const headers = getFetchHeaders();
        return fetchAPISetup(url,'PUT', address, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){
                goToPage('ReviewDetails')
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

/** Makes http API call to get a merchant and
 * 	Dispatches to save result and data in store on success
 * 	@param  {object}     login
 * 	@return {Promise} 
 */
export function getMerchantDetails(merchantId) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = MERCHANT_ONBARDING_URL+ 'merchants/' + merchantId;
        const headers = getFetchHeaders();
        return fetchGetAPI(url, null, headers).then(result => {
            if(result && result.data && result.data.success && result.data.data.hasOwnProperty('merchantId')){
                processMerchantDetails.call(this, dispatch, result.data.data);
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    handleGenericError(result);
                    goToPage('MerchantList')
                }
                dispatch({ type: ACTION_TYPE.END_API_CALL });
            }
        }).catch(error => {
            Sentry.captureException(error);
            goToPage('MerchantList')
            ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };

}

/** Makes http API call to get available merchant branding
 * 	Dispatches to save result and data in store on success
 * 	@param  {object}     login
 * 	@return {Promise}
 */
export function getMerchantBranding(merchantId) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = MERCHANT_ONBARDING_URL+ 'documents/summary/' + merchantId;
        const headers = getFetchHeaders();
        return fetchGetAPI(url, null, headers).then(result => {
            if(result && result.data && result.data.success){
                dispatch(updateUploadedStates(result.data.data));
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    handleGenericError(result);
                    goToPage('MerchantList')
                }
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            Sentry.captureException(error);
            goToPage('MerchantList')
            ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };

}

/** 
 *  Makes http API call to check merchant exists or not  and
 * 	return the result
 * 	@param  {object}     login
 * 	@return {Promise} 
 */
export function checkMerchantExists(phoneNumber) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = MERCHANT_ONBARDING_URL+ 'merchants/phone/' + phoneNumber;
        const headers = getFetchHeaders();
        return fetchGetAPI(url, null, headers).then(result => {
            if(result && result.data && result.data.data && result.data.data.hasOwnProperty('merchantExists')){
                if(result.data.data.merchantExists){
                    ToastAndroid.show(ERROR_CODES_AND_MESSAGES.DUPLICATE_PHONE_NUMBER, ToastAndroid.LONG);
                }else{
                    this.submitDetails();
                }
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

/** Makes http API call to update a merchant address details and
 * 	return the result
 * 	@param  {object}   merchantDetails
 *  @param  {string}   merchantId
 *  @param  {object}   header
 * 	@return {Promise}
 */
export function updateCurrentMerchantDetails(merchantDetails, merchantId) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = MERCHANT_ONBARDING_URL + 'merchants/' + merchantId;
        const headers = getFetchHeaders();
        return fetchAPISetup(url,'PUT', merchantDetails, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){
                goToPage('ReviewDetails')
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    handleGenericError(result);
                }
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            Sentry.captureException(error);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
            ToastAndroid.show(ERROR_MESSAGES.SERVER_ERROR, ToastAndroid.LONG);
        });
    };
}

export function processMerchantDetails(dispatch, result){
    if(result.hasOwnProperty('merchantId')){
        let merchantId = result.merchantId;
        let onboardingStage = result.onboardingStage;
        let merchantDetails = {
            merchantName: result.merchantName,
            businessName: result.businessName,
            phoneNumber: result.phoneNumber,
            email: result.email.replace(NO_EMAIL, ""),
            category: result.categoryId || null,
            subCategory: result.subCategoryId || null,
            superCategory: result.superCategoryId || null,
        }
        let categoryValues = {
            superCategory: textFormatter(result.superCategory),
            category: textFormatter(result.category),
            subCategory: textFormatter(result.subCategory)
        }

        dispatch(loadCurrentMerchantDetails(merchantDetails, categoryValues));
        dispatch(loadCurrentMerchantId(merchantId));
        dispatch(loadCurrentMerchantOnboardingStage(onboardingStage));

        if(result.hasOwnProperty('address') && Object.keys(result.address).length > 0 ){
            dispatch(loadCurrentAddressDetails(result.address));
        }

        if(result.hasOwnProperty('bankAccount') && Object.keys(result.bankAccount).length > 0 ){
            dispatch(loadCurrentMerchantBankDetails(result.bankAccount));
        }

        if(result.hasOwnProperty('qrCodes') && result.qrCodes.length > 0){
            let item = [];
            result.qrCodes.map(element => {
                let device = {};
                // device.name = 'upi://pay?pa='+ element.qrCodeId +'@ybl&pn=PhonePeMerchant&cu=INR&et=Base64&ep=eyJ0eXBlIjoiUVJfSURfQ09OVEVYVCIsInFyQ29kZUlkIjoiUTYwOTM5MjQzMSJ9';
                device.name = element.qrCodeId;
                device.notificationList = element.mapping.notificationReceiver;
                item.push(device);
            });
            dispatch({type: ACTION_TYPE.ADD_NEW_QRCODE, item});
        }
        if(onboardingStage == 'MAPPED' || onboardingStage == 'QR_DOC_ADDED'){
            dispatch(getMerchantBranding(merchantId));
        }else{
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }
        this.buttonText();
    }
}