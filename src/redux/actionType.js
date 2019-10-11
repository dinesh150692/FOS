module.exports = Object.freeze({
    ACTION_TYPE: {
        MODAL:{
            OTP: {
               OPEN: 'OPEN_OTP',
               CLOSE: 'CLOSE_OTP'
            },
            ALERT: {
                OPEN: 'OPEN_ALERT',
                CLOSE: 'CLOSE_ALERT'
            },
            GPS_ERROR: {
                OPEN: 'OPEN_GPS_ERROR',
                CLOSE: 'CLOSE_GPS_ERROR'
            },
            ALL_MODAL: {
                OPEN: 'OPEN_ALL_MODAL',
                CLOSE: 'CLOSE_ALL_MODAL'
            },
            IMAGE: {
                OPEN: 'OPEN_IMAGE_MODAL',
                CLOSE: 'CLOSE_IMAGE_MODAL'
            },
            SMS_LINKING: {
                OPEN: 'OPEN_SMS_LINKING',
                CLOSE: 'CLOSE_SMS_LINKING'
            },
            CAMERA_MODAL: {
                OPEN: 'OPEN_CAMERA_MODAL',
                CLOSE: 'CLOSE_CAMERA_MODAL'
            },
            SUPPORTED_BANKS: {
                OPEN: 'OPEN_SUPPORTED_BANKS',
                CLOSE: 'CLOSE_SUPPORTED_BANKS'
            },
            SESSION_EXPIRED: {
                OPEN: 'OPEN_SESSION_EXPIRED',
                CLOSE: 'CLOSE_SESSION_EXPIRED'
            },
            ADD_NOTIFICATION: {
                OPEN: 'OPEN_ADD_NOTIFICATION',
                CLOSE: 'CLOSE_ADD_NOTIFICATION'
            },
            MERCHANT_DETAILS: {
                OPEN: 'OPEN_MERCHANT_DETAILS',
                CLOSE: 'CLOSE_MERCHANT_DETAILS'
            },
            SEARCH_MODAL:{
                OPEN: 'OPEN_SEARCH_MODAL',
                CLOSE: 'CLOSE_SEARCH_MODAL'
            }
        },
        CLEAR_DATA: 'CLEAR_DATA',
        //Action Types for Timers
        INIT_TIMER: 'INIT_TIMER',
        INIT_VALUE: 'INIT_VALUE',
        CLEAR_TIMER: 'CLEAR_TIMER',
        START_TIMER: 'START_TIMER',
        UPDATE_TIMER: 'UPDATE_TIMER',
        START_SUCCESS_TIMER: 'START_SUCCESS_TIMER',
        CLEAR_SUCCESS_TIMER: 'CLEAR_SUCCESS_TIMER',

        //Action Types for Login and intial setup
        LOAD_AGENT_ID: 'LOAD_AGENT_ID',
        LOAD_APP_VERSION: 'LOAD_APP_VERSION',
        LOAD_DEVICE_PRINT: 'LOAD_DEVICE_PRINT',
        LOAD_INITIAL_TOKEN: 'LOAD_INITIAL_TOKEN',

        //Action Types for Loader
        BEGIN_AJAX_CALL: 'BEGIN_AJAX_CALL',
        AJAX_CALL_ERROR: 'AJAX_CALL_ERROR',
        END_API_CALL: 'END_API_CALL',
        
        //Action Types for otp token
        CLEAR_OTP_TOKEN: 'CLEAR_OTP_TOKEN',
        UPDATE_OTP_TOKEN: 'UPDATE_OTP_TOKEN',
        
        //Action Types for Merchant Details
        UPDATE_MERCHANT_ID: 'UPDATE_MERCHANT_ID',
        CLEAR_MERCHANT_DETAILS: 'CLEAR_MERCHANT_DETAILS',
        UPDATE_PINCODE_DETAILS: 'UPDATE_PINCODE_DETAILS',
        UPDATE_ONBOARDING_STAGE: 'UPDATE_ONBOARDING_STAGE',
        UPDATE_MERCHANT_DETAILS: 'UPDATE_MERCHANT_DETAILS',
        UPDATE_MERCHANT_BANK_DETAILS: 'UPDATE_MERCHANT_BANK_DETAILS',
        UPDATE_MERCHANT_ADDRESS_DETAILS: 'UPDATE_MERCHANT_ADDRESS_DETAILS',
        UPDATE_UPLOADED_STATES: 'UPDATE_UPLOADED_STATES',
        
        //Action Types for Merchant Listing and bank list
        UPDATE_BANK_LIST: 'UPDATE_BANK_LIST',
        UPDATE_SEARCH_BANK_LIST: 'UPDATE_SEARCH_BANK_LIST',
        LOAD_MERCHANT_LIST: 'LOAD_MERCHANT_LIST',
        UPDATE_EDIT_FLOW_TYPE: 'UPDATE_EDIT_FLOW_TYPE',
        LOAD_BANK_LINKED_LIST: 'LOAD_BANK_LINKED_LIST',
        UPDATE_MERCHANT_SEARCH_LIST: 'UPDATE_MERCHANT_SEARCH_LIST',
        UPDATE_MERCHANT_ONBOARDED_COUNT: 'UPDATE_MERCHANT_ONBOARDED_COUNT',
        UPDATE_LOCATION_DATA: 'UPDATE_LOCATION_DATA',
        CLEAR_LOCATION_DATA: 'CLEAR_LOCATION_DATA',
        
        //Action Types for Categories
        UPDATE_CATEGORY_STATE: 'UPDATE_CATEGORY_STATE',
        LOAD_CATEGORY: 'LOAD_CATEGORY',
        LOAD_SUB_CATEGORY: 'LOAD_SUB_CATEGORY',
        LOAD_SUPER_CATEGORY: 'LOAD_SUPER_CATEGORY',
        CLEAR_CATEGORY_AND_SUB_CATEGORY: 'CLEAR_CATEGORY_AND_SUB_CATEGORY',

        //Action Types for Notification
        ADD_NEW_QRCODE: 'ADD_NEW_QRCODE',
        CLEAR_NOTIFICATION_DETAILS: 'CLEAR_NOTIFICATION_DETAILS',
        ADD_NOTIFICATION_FOR_QRCODE: 'ADD_NOTIFICATION_FOR_QRCODE',        
        REMOVE_NOTIFICATION_FOR_QRCODE: 'REMOVE_NOTIFICATION_FOR_QRCODE',
        
        //Action Types for Images
        UPLOAD:{
            UPDATE_BRANDING_IMAGES_LIST: 'UPDATE_BRANDING_IMAGES_LIST',
            UPDATE_ID_PROOF_IMAGES_LIST: 'UPDATE_ID_PROOF_IMAGES_LIST',
            UPDATE_BRANDING_QR_IMAGES_LIST: 'UPDATE_BRANDING_QR_IMAGES_LIST',
            UPDATE_BUSINESS_PROOF_IMAGES_LIST: 'UPDATE_BUSINESS_PROOF_IMAGES_LIST'
        },

        //Action Types for Page type update
        UPDATE_PAGE_TYPE: 'UPDATE_PAGE_TYPE',
        CLEAR_PAGE_TYPE: 'CLEAR_PAGE_TYPE',
    }
});
    