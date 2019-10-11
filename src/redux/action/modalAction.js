import { ACTION_TYPE } from '../actionType';

/** Action dispatch to save the data in the store as modal open/ close
 * 	@return {Object}    
 */
export function openOTPModal() {
    return { type: ACTION_TYPE.MODAL.OTP.OPEN};
}

export function closeOTPModal() {
    return { type: ACTION_TYPE.MODAL.OTP.CLOSE};
}

export function openGPSModal() {
    return { type: ACTION_TYPE.MODAL.GPS_ERROR.OPEN};
}

export function closeGPSModal() {
    return { type: ACTION_TYPE.MODAL.GPS_ERROR.CLOSE};
}

export function openSMSModal() {
    return { type: ACTION_TYPE.MODAL.SMS_LINKING.OPEN};
}

export function closeSMSModal() {
    return { type: ACTION_TYPE.MODAL.SMS_LINKING.CLOSE};
}

export function openAlertModal() {
    return { type: ACTION_TYPE.MODAL.ALERT.OPEN};
}

export function closeAlertModal() {
    return { type: ACTION_TYPE.MODAL.ALERT.CLOSE};
}

export function openCameraModal() {
    return { type: ACTION_TYPE.MODAL.CAMERA_MODAL.OPEN};
}

export function closeCameraModal() {
    return { type: ACTION_TYPE.MODAL.CAMERA_MODAL.CLOSE};
}


export function openSessionExpiredModal() {
    return { type: ACTION_TYPE.MODAL.SESSION_EXPIRED.OPEN};
}

export function closeSessionExpiredModal() {
    return { type: ACTION_TYPE.MODAL.SESSION_EXPIRED.CLOSE};
}

export function openAddNotificationModal() {
    return { type: ACTION_TYPE.MODAL.ADD_NOTIFICATION.OPEN};
}

export function closeAddNotificationModal() {
    return { type: ACTION_TYPE.MODAL.ADD_NOTIFICATION.CLOSE};
}

export function openMerchantDetailsModal(){
    return { type: ACTION_TYPE.MODAL.MERCHANT_DETAILS.OPEN};
}

export function closeMerchantDetailsModal() {
    return { type: ACTION_TYPE.MODAL.MERCHANT_DETAILS.CLOSE};
}

export function openImageModal(){
    return { type: ACTION_TYPE.MODAL.IMAGE.OPEN};
}

export function closeImageModal() {
    return { type: ACTION_TYPE.MODAL.IMAGE.CLOSE};
}

export function openSearchModal() {
    return { type: ACTION_TYPE.MODAL.SEARCH_MODAL.OPEN};
}

export function closeSearchModal() {
    return { type: ACTION_TYPE.MODAL.SEARCH_MODAL.CLOSE};
}

export function closeAllModal(){
    return { type: ACTION_TYPE.MODAL.ALL_MODAL.CLOSE};
}

export function openAllModal(){
    return { type: ACTION_TYPE.MODAL.ALL_MODAL.OPEN};
}