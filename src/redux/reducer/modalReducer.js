import { ACTION_TYPE } from '../actionType';

let initialState = {
    openOTP: false,
    openGPS: false,
    openSMS: false,
    openImage: false,
    openAlert: false,
    openCamera: false,
    openSearch: false,
    openSessionExpired: false,
    openAddNotification: false,
    openMerchantDetails: false
}

export default function modalReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.MODAL.OTP.OPEN:
            return {...state, ...{openOTP: true}};
        
        case ACTION_TYPE.MODAL.OTP.CLOSE:
            return {...state, ...{openOTP: false}};
        
        case ACTION_TYPE.MODAL.ALERT.OPEN:
            return {...state, ...{openAlert: true}};

        case ACTION_TYPE.MODAL.ALERT.CLOSE:
            return {...state, ...{openAlert: false}};

        case ACTION_TYPE.MODAL.GPS_ERROR.OPEN:
            return {...state, ...{openGPS: true}};

        case ACTION_TYPE.MODAL.GPS_ERROR.CLOSE:
            return {...state, ...{openGPS: false}};

        case ACTION_TYPE.MODAL.SMS_LINKING.OPEN:
            return {...state, ...{openSMS: true}};

        case ACTION_TYPE.MODAL.SMS_LINKING.CLOSE:
            return {...state, ...{openSMS: false}};

        case ACTION_TYPE.MODAL.CAMERA_MODAL.OPEN:
            return {...state, ...{openCamera: true}};

        case ACTION_TYPE.MODAL.CAMERA_MODAL.CLOSE:
            return {...state, ...{openCamera: false}};

        case ACTION_TYPE.MODAL.SESSION_EXPIRED.OPEN:
            return {...state, ...{openSessionExpired: true}};
        
        case ACTION_TYPE.MODAL.SESSION_EXPIRED.CLOSE:
            return {...state, ...{openSessionExpired: false}}
        
        case ACTION_TYPE.MODAL.ADD_NOTIFICATION.OPEN:
            return {...state, ...{openAddNotification: true}};
        
        case ACTION_TYPE.MODAL.ADD_NOTIFICATION.CLOSE:
            return {...state, ...{openAddNotification: false}}
        
        case ACTION_TYPE.MODAL.MERCHANT_DETAILS.OPEN:
            return {...state, ...{openMerchantDetails: true}};
        
        case ACTION_TYPE.MODAL.MERCHANT_DETAILS.CLOSE:
            return {...state, ...{openMerchantDetails: false}}

        case ACTION_TYPE.MODAL.IMAGE.OPEN:
            return {...state, ...{openImage: true}};
        
        case ACTION_TYPE.MODAL.IMAGE.CLOSE:
            return {...state, ...{openImage: false}}
        
        case ACTION_TYPE.MODAL.SEARCH_MODAL.OPEN:
            return {...state, ...{openSearch: true}};

        case ACTION_TYPE.MODAL.SEARCH_MODAL.CLOSE:
            return {...state, ...{openSearch: false}};
        
        case ACTION_TYPE.MODAL.ALL_MODAL.OPEN:
            return {...state,
                ...{
                    openOTP: true,
                    openGPS: true,
                    openSMS: true,
                    openImage: true,
                    openAlert: true,
                    openCamera: true,
                    openSearch: true,
                    openSessionExpired: true,
                    openAddNotification: true,
                    openMerchantDetails: true
                }
            };
        
        case ACTION_TYPE.MODAL.ALL_MODAL.CLOSE:
            return {...state,
                ...{
                    openOTP: false,
                    openGPS: false,
                    openSMS: false,
                    openImage: false,
                    openAlert: false,
                    openCamera: false,
                    openSearch: false,
                    openSessionExpired: false,
                    openAddNotification: false,
                    openMerchantDetails: false
                }
            }
        default:
            return state;
    }
}
