module.exports = Object.freeze({
    LOGIN_ERROR_CODES_AND_MESSAGES:{
        GENERIC_ERROR: 'Aww! Server Error, Retry Again',
        UNAUTHORIZED: 'UNAUTHORIZED',
        USER_NOT_REGISTERED: "Phone number is not registered",
        UNABLE_TO_SEND_OTP : 'OTP cannot be sent. Please try after sometime',
        INVALID_OTP: "Invalid OTP. Please re-enter valid OTP",
        OTP_EXPIRED: "OTP has expired",
        USER_BANNED: "Banned to send/verify OTP. Please login after 10 minutes",
        ATTEMPTS_EXHAUSTED: "Max attempts to verify OTP has reached. Please login again",
        ALREADY_VERIFIED: "This OTP is already verified. Please login again"
    },
    ERROR_CODES_AND_MESSAGES:{
        //General Error Codes
        INTERNAL_SERVER_ERROR: 'Aww! Server Error, Retry Again',
        GENERIC_ERROR: 'Aww! Server Error, Retry Again',
        SERVER_ERROR: 'Aww! Server Error, Retry Again',
        INTERNAL_ERROR: "Something went wrong",
        ERROR: 'Aww! Server Error, Retry Again',
        BAD_REQUEST: 'Aww! Server Error, Retry Again',
        COMMUNICATION_ERROR: "Something went wrong, Retry Again",
        UNAUTHORIZED: 'UNAUTHORIZED',
        NETWORK_ERROR: 'Network Request Failed, Retry Again',
        SESSION_EXPIRED: 'Your session has expired. Login again to continue',

        //Merchant Passcode Error Codes
        OTP_EXPIRED: "Passcode has expired",
        UNABLE_TO_SEND_OTP : 'Passcode cannot be sent. Please try after sometime',
        INVALID_OTP: "Invalid passcode. Please re-enter valid passcode",
        BANNED: "Banned to send/verify passcode. Please try after sometime",
        ATTEMPTS_EXHAUSTED: "Max attempts to verify passcode has reached",
        ALREADY_VERIFIED: "This passcode is already verified",
    
        //Merchant Error Codes
        INVALID_AGENT_ID: "Invalid agent Id",
        MERCHANT_AGENT_MISMATCH: "Merchant does not belong to this agent",
        DUPLICATE_PHONE_NUMBER: "A merchant exists with the above phone number. Please try again with another number",
        INVALID_MERCHANT_ID: "Merchant Id not recognized",
        SMS_VERIFICATION_EXPIRED: "Timer ended",
        INVALID_ONBOARDING_STAGE: "Invalid onboarding stage",
        INVALID_VERSION: "App version not recognized",
        USER_NOT_REGISTERED: "User is not registered",
        SELF_ONBOARDING: "Agent cannot onboard himself as a merchant",
        INVALID_MAPPED_OBJECT_TYPE: "Mapped object type other than QR",
        INVALID_NOTIFICATION_CHANNEL: "Notification channel other than SMS",
        USER_BLACKLISTED: "Phone number is blacklisted",
        NO_MERCHANT_FOUND: "No Merchant/s found for the phone number",

        //Error codes for pincode
        PINCODE_EMPTY_ERROR: "Pincode is invalid",

        //Error Codes for category api
        SUPER_CATEGORY_ERROR: "Error fetching super categories, Retry Again",
        CATEGORY_ERROR: "Error fetching categories, Retry Again",
        SUB_CATEGORY_ERROR: "Error fetching sub categories, Retry Again",

        //Error Codes for QR Codes
        INVALID_QRCODE_ID: 'Invalid QR Code',
        QR_ALREADY_ASSIGNED: 'QR Code is already assigned',
        INVALID_QR_CODE: 'Invalid QR Code',

        //Error Codes for Notification Receivers
        NOTIFICATION_RECEIVER_ALREADY_EXISTS: 'Phone number already exists in notification list',

        //Error Code on Images
        LAST_IMAGE_DELETE_NOT_ALLOWED: 'Single image deletion not allowed',

        //Error Code for FRAUD
        FRAUD_MERCHANT_CREATION: 'For security reasons, we can\'t create this merchant now. Please try after 48 hours',
        FRAUD_ACCOUNT_MAPPING: 'This account is already mapped to a merchant. Please use a different account',
        FRAUD_DETECTED: 'For security reasons, This operation can\'t be performed. Please try after 48 hours',

    }
});
