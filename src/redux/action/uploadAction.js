import Config from 'react-native-config';
import {ACTION_TYPE} from '../actionType';
import {getFetchHeaders} from './fetchHeaderAction';
import {fetchGetAPI, fetchAPISetup, fetchAPIFileUpload} from '../../shared/fetch';
import {handleGenericError, handleUnauthorizedCase} from '../../components/common/errorHandler';
import {DOCUMENTS_TYPE, BUSINESS_PROOF_TYPES, ID_PROOF_TYPES} from '../../shared/constants';
import {goToPage} from "../../components/common/logout";
import {AsyncStorage} from "react-native";

const MERCHANT_ONBARDING_URL = Config.MERCHANT_ONBARDING_URL;
const DOC_LIST_URL = Config.DOC_LIST_URL;
const DOC_URL = Config.DOC_URL;
const DOC_UPLOAD_URL = Config.DOC_UPLOAD_URL;

function groupProofData(list, proofsType = null) {
    var group_to_values = list.reduce(function (obj, item) {
        obj[item.type] = obj[item.type] || [];
        obj[item.type].push(item);
        return obj;
    }, {});
    return Object.keys(group_to_values).map(function (key) {
        return {headerName: proofsType ? proofsType[key] : key, images: group_to_values[key]};
    });
}

/** Action dispatch to save the data in the store as branding images list
 *  @param  {Array}  brandinglist
 *    @return {Object}
 */
export function updateBrandingImagesList(brandingList, headerName) {
    return {type: ACTION_TYPE.UPLOAD.UPDATE_BRANDING_IMAGES_LIST, brandingList, headerName};
}

/** Action dispatch to save the data in the store as qr images list
 *  @param  {Array}  qrlist
 *    @return {Object}
 */
export function updateQRImagesList(qrList, headerName) {
    return {type: ACTION_TYPE.UPLOAD.UPDATE_BRANDING_QR_IMAGES_LIST, qrList, headerName};
}

/** Action dispatch to save the data in the store as id proof images list
 *  @param  {Object}  idProofList
 *    @return {Object}
 */
export function updateIDProofImagesList(idProofList) {
    return {
        type: ACTION_TYPE.UPLOAD.UPDATE_ID_PROOF_IMAGES_LIST,
        idProofList: groupProofData(idProofList, ID_PROOF_TYPES)
    };
}

/** Action dispatch to save the data in the store as business proof images list
 *  @param  {Object}  businessProofList
 *    @return {Object}
 */
export function updateBusinessProofImagesList(businessProofList) {
    return {
        type: ACTION_TYPE.UPLOAD.UPDATE_BUSINESS_PROOF_IMAGES_LIST,
        businessProofList: groupProofData(businessProofList, BUSINESS_PROOF_TYPES)
    };
}

/** Makes http API call to get the Document list for the Merchant
 *    Dispactches to save response in store on success
 *    @return {Promise}
 */
export function getDocumentList(merchantID, category, headers) {
    return dispatch => {
        const url = MERCHANT_ONBARDING_URL + DOC_LIST_URL + merchantID + '?category=' + category;
        dispatch({type: ACTION_TYPE.BEGIN_AJAX_CALL});
        return fetchGetAPI(url, null, headers).then(result => {
            // console.log("getDocumentList --> result", result);
            if (result && result.hasOwnProperty('data') && result.data.data && result.data.success) {
                if (category == DOCUMENTS_TYPE.BRAND_IMAGE) {
                    dispatch(updateBrandingImagesList(result.data.data, 'Shop Image'));
                }
                else if (category == DOCUMENTS_TYPE.QR_IMAGE) {
                    dispatch(updateQRImagesList(result.data.data, 'QR Branding Image'));
                }
                else if (category == DOCUMENTS_TYPE.ID_PROOF) {
                    dispatch(updateIDProofImagesList(result.data.data));
                }
                else if (category == DOCUMENTS_TYPE.BUSINESS_DOCUMENT) {
                    dispatch(updateBusinessProofImagesList(result.data.data));
                }
            } else {
                if (handleUnauthorizedCase.call(this, result, dispatch)) {
                    error = handleGenericError(result);
                }
            }
            dispatch({type: ACTION_TYPE.END_API_CALL});
        }).catch(error => {
            dispatch({type: ACTION_TYPE.AJAX_CALL_ERROR});
            throw (error);
        });
    };
}

/** Makes http API call to upload document
 *    @return {Promise}
 */
export function uploadDocuments(fileData, merchantID, category, type, headers, didDocUploaded, stageUpdate=true) {
    return dispatch => {
        dispatch({type: ACTION_TYPE.BEGIN_AJAX_CALL});
        const url = MERCHANT_ONBARDING_URL + DOC_UPLOAD_URL;
        let details = {
            category: category,
            type: type,
            merchantId: merchantID,
            stageUpdate: stageUpdate.toString()
        };

        if(stageUpdate) {
            delete details[stageUpdate];
        }
        return fetchAPIFileUpload(fileData, url, 'POST', details, headers).then(result => {
            if (result && result.data && result.data.hasOwnProperty('success') && result.data.success) {
                // console.log('Result -->',result);
                // dispatch(getDocumentList(merchantID, category, headers));
                if (result.data.data.length > 0) {
                    let key = result.data.data[0] +  merchantID + category;
                    saveImageURI(result.data.data[0], merchantID, category, fileData.uri, () => {
                        if (didDocUploaded) didDocUploaded();
                    });
                }
            } else {
                if (handleUnauthorizedCase.call(this, result, dispatch)) {
                    error = handleGenericError(result);
                }
            }
            dispatch({type: ACTION_TYPE.END_API_CALL});
            return null;
        }).catch(error => {
            // bugsnag.notify(error);
            // ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            dispatch({type: ACTION_TYPE.AJAX_CALL_ERROR});
        });
    };
}

/** Makes http API call to upload document
 *    @return {Promise}
 */
export function deleteDocuments(fileId, merchantID, category, headers) {
    return dispatch => {
        dispatch({type: ACTION_TYPE.BEGIN_AJAX_CALL});
        const url = MERCHANT_ONBARDING_URL + DOC_URL + fileId + '?merchantId=' + merchantID;
        return fetchAPISetup(url, 'DELETE', {}, headers).then(result => {
            if (result && result.data && result.data.hasOwnProperty('success') && result.data.success) {
                dispatch(getDocumentList(merchantID, category, headers));
            } else {
                if (handleUnauthorizedCase.call(this, result, dispatch)) {
                    error = handleGenericError(result);
                }
            }
            dispatch({type: ACTION_TYPE.END_API_CALL});
            return null;
        }).catch(error => {
            // bugsnag.notify(error);
            // ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            dispatch({type: ACTION_TYPE.AJAX_CALL_ERROR});
        });
    };
}

export function getImagesList() {
    return dispatch => {
        const url = MERCHANT_ONBARDING_URL + 'images';
        const headers = getFetchHeaders();
        dispatch({type: ACTION_TYPE.BEGIN_AJAX_CALL});
        return fetchGetAPI(url, null, headers).then(result => {
            dispatch({type: ACTION_TYPE.END_API_CALL});
            return result;
        }).catch(error => {
            dispatch({type: ACTION_TYPE.AJAX_CALL_ERROR});
            throw (error);
        });
    };
}


/** Action to save Image URI to AsyncStorage for uploaded image
 *  @param  {String} fileID, merchantID, category, imageURI
 *    @return {Bool}
 */

function saveImageURI(fileID, merchantID, category, imageURI, didValueRead) {

    let key = fileID + merchantID + category;
    AsyncStorage.setItem(key, imageURI, didValueRead);
}


