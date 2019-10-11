module.exports = Object.freeze({
    MOBILE_REGEX : /^[5-9]{1}[0-9]{9}$/,
    OTP_REGEX : /([\d]{5}) is your one time password to proceed on PhonePe./,
    NUMBER_REGEX : /^[0-9\b]+$/,
    EMAIL_REGEX  : /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    PINCODE_REGEX : /^[1-9]{1}[0-9]{5}$/,
    QRCODE_REGEX : /pa=(.*)@ybl/,
    NAME_REGEX: /[^\w\s-&'.]/gi,
    ADDRESS_REGEX: /[^\w\s.#,-]/gi,
    BANK_IMAGE_URL: 'https://imgstatic.phonepe.com/images/banks/96/96/',
    BARCODE_TYPES : ['EAN_13', 'CODE_128', 'CODE_39', 'CODE_49', 'CODE_93', 'EAN_8'],
    NO_EMAIL: 'noemail@phonepe.com',
    LOGIN_BUTTON: 'PROCEED',
    RETRY_AGAIN: 'RETRY AGAIN',
    RESEND_OTP: 'RESEND PASSCODE',
    BUTTON_PROCEED: 'PROCEED',
    TIME_TEXT: 'TIME REMAINING ',
    GENERATE_OTP: 'GENERATE PASSCODE',
    REGENERATE_OTP: 'REGENERATE PASSCODE',
    COMPLETE_MERCHANT_ONBOARDING: 'COMPLETE MERCHANT ONBOARDING',
    INVALID_PASSWORD: 'Invalid username or password',
    BUTTON_SUBMIT_REQUEST_OTP: 'SUBMIT & REQUEST PASSCODE',
    TIME_OUT: 600,
    OTP_TIME_OUT: 60,
    LOGIN_TIMEOUT: 60,
    OTP_ERROR: 'Passcode could not be sent. Try again later',
    NO_MERCHANT:{
      NO_MERCHANT_HEADER: 'Welcome to PhonePe Ace!', 
      NO_MERCHANT_HEADER1: 'Start by adding merchants',
      ADD_MORE_MERCHANTS: 'Add more merchants',
      NO_SEARCH_MERCHANT: 'No merchants found for the phone number',
      NO_MERCHANT_LIST: 'Please click on the + icon to add a new merchant and start onboarding them.',
    },
    SERVER_ERROR: 'SERVER_ERROR',
    NO_SUPPORTED_BANKS: 'No Banks Found',
    BANK_LINKING:{
      REFRESH: 'REFRESH',
      LINK_ACCOUNT: 'LINK ACCOUNT',
      LINKING_SUCCESSFUL: 'LINKING SUCCESSFUL',
      NO_BANK_FOUND: 'No bank account found',
      NO_LINK_FOUND: 'Please ask merchant to send the linking sms to 917899460333 as LINK <BANK CODE> to link account.',
      NO_BANK_FOUND_TEXT: 'No banks are linked to this merchant phone number.'
    },
    CLOSE_ACCOUNT_ALERT:{
      HEADER: 'CLOSE ACCOUNT',
      TEXT: 'By closing the account, this merchant cannot be onboarded later. Are you sure you want to continue?',
      BUTTON_TEXT1: "CANCEL",
      BUTTON_TEXT2: "OK"
    },
    SESSION_EXPIRED:{
      HEADER: 'Session Expired',
      TEXT: 'Your session has expired. Regenerate passcode to continue.'
    },
    NOTIFICATION:{
      HEADER: 'Add Number',
      TEXT: 'Add a number to receive transaction notification',
      BUTTON: 'ADD NUMBER',
      VERIFY: 'SEND PASSCODE'
    },
    OTP:{
      HEADER: 'Enter Passcode',
      TEXT1: 'Passcode sent to ',
      TEXT2: 'Please enter the passcode.',
      TIME_TEXT: 'Time Remaining'
    },
    SMS:{
      HEADER: 'Select a Bank',
      TOP_HEADER: 'SMS Linking',
      TEXT: 'Please select the merchant’s bank to send the linking sms to him and ask him to send it to 917899460333.',
      BUTTON_TEXT: 'SEND BANK LINK SMS'
    },
    ONBOARDING_STAGES:{
      CREATED: 'DETAILS CAPTURED',
      BRANDING_ADDED  : 'BRANDING ADDED',
      ACCOUNT_LINKED: 'BANK LINKED',
      MAPPED: 'QR ASSIGNED',
      // BRANDING: 'BRANDING',
      QR_DOC_ADDED: 'QR DOCUMENT ADDED',
      // ID_PROOD: 'ID_PROOF',
      // BUSINESS_PROOF: 'BUSINESS_PROOF',
      TESTED: 'TESTED',
      ACTIVE: 'ACTIVE',
      DROPPED: 'DROPPED',
      MIGRATED: 'MIGRATED'
    },

    CAMERA_RETAKE: 'RETAKE',
    QRCODE: 'QR_CODE',
    NOTIFICATION_DELETED: 'Notification deleted successfully',
    LOCATION_ERROR: 'Error while capturing location, retrying again',
    LOCATION_DISABLED: 'Cannot proceed without location access, retry again',
    ENABLE_GPS: 'TURN ON GPS',
    GPS_TURNED_OFF:'GPS turned off',
    NO_NETWORK_FOUND: {
      HEADER_TEXT: 'No network found',
      TEXT_LINE1: 'Aww, it looks like your network is down.',
      TEXT_LINE2: 'Please try again!',
      REFRESH_BUTTON: 'REFRESH'  },
    LOCATION_TEXT: 'Please allow us to access your GPS location to detect the accurate address.',
    APP_UPDATE: {
      URL: 'https://www.phonepe.com/ace/upgrade.html',
      TEXT: 'Updated version of the app is available. Please update the app to continue',
      HEADER: 'Updated App Version Available'
    },
    CLOSE_BUTTON: {
      TEXT: 'All unsaved changes will be lost if you leave this page.',
      HEADER: 'Are you sure you want to exit?'
    },
    CLOSE_BUTTON_REVIEW_DETAIL: {
        TEXT: 'You have to take passcode again to open the merchant details.',
        HEADER: 'Are you sure you want to exit?'
    },
    EXIT_BUTTON: {
      TEXT: 'Are you sure you want to logout?',
      HEADER: 'Logout Alert'
    },
    INVALID_QRCODE: 'Invalid QR. Please scan a different QR Code',
    NO_BRANDING:{
      NO_BRANDING_HEADER: 'Take 3 or more photos of the', 
      NO_BRANDING_HEADER1: 'merchant\'s shop',
      NO_BRANDING_TEXT: 'Click on the camera button to take and upload photos of the store\'s billboard.'
    },
    BRANDING:{
      BRANDING_SCREEN_HEADER: 'Shop Image',
      BRANDING_HEADER: "Store's Billboard",
      BRANDING_BUTTON: 'PROCEED TO QR DOCUMENTATION',
      BRANDING_ADD_IMAGE_TEXT: 'ADD ANOTHER IMAGE',
      BRANDING_EMPTY_IMAGE_TEXT: 'ADD NEW IMAGE',
      BRANDING_IMAGE_COUNT: 3
    },
    NO_BRANDING_QR:{
      NO_BRANDING_HEADER: 'Take photos of the QR', 
      NO_BRANDING_HEADER1: 'code sticker',
      NO_BRANDING_TEXT: 'Click on the camera button to take and upload photos of the QR code sticker displayed in the merchant\'s store.'
    },
    BRANDING_QR:{
      BRANDING_SCREEN_HEADER: 'QR Branding',
      BRANDING_HEADER: 'QR Code & Branding',
      BRANDING_BUTTON: 'PROCEED',
      BRANDING_ADD_IMAGE_TEXT: 'ADD ANOTHER IMAGE',
      BRANDING_EMPTY_IMAGE_TEXT: 'ADD NEW IMAGE'
    },
    ID_PROOF:{
      BRANDING_SELECT_PROOF: 'Select ID Proof Type',
      BRANDING_ADD_IMAGE_TEXT: 'ADD ANOTHER IMAGE',
      BRANDING_BUTTON: 'PROCEED TO BUSINESS ID PROOF',
      BRANDING_SCREEN_HEADER: 'Documentation : ID Proof',
      BRANDING_EMPTY_IMAGE_TEXT: 'ADD NEW IMAGE'
    },
    BUSINESS_PROOF:{
      BRANDING_BUTTON: 'PROCEED',
      BRANDING_ADD_IMAGE_TEXT: 'ADD ANOTHER IMAGE',
      BRANDING_SELECT_PROOF: 'Select Business Proof Type',
      BRANDING_SCREEN_HEADER: 'Documentation : Business Proof',
      BRANDING_EMPTY_IMAGE_TEXT: 'ADD NEW IMAGE'
    },
    BUSINESS_PROOF_TYPES:{
      GST_CERTIFICATE: 'GST Certificate',
      MUNICIPAL_CORPORATION_CERTIFICATE: 'Municipal Corporation Certificate',
      RENTAL_AGREEMENT: 'Rental Agreement',
      SHOP_ESTABLISHMENT: 'Shop & Establishment',
      TAX_DEALER_INVOICE: 'Tax/Dealer Invoice',
      UTILITY_BILL: 'Utility Bill',
      ID_PROOF: 'ID Proof',
      OTHER: 'Other'
    },
    ID_PROOF_TYPES:{
      DRIVER_LICENSE: 'Driver\'s License',
      PANCARD: 'Pan Card',
      PASSPORT: 'Passport',
      OTHER: 'Other'
    },
    DOCUMENTS_TYPE:{
      BRAND_IMAGE: 'BRAND_IMAGE',
      QR_IMAGE: 'QR_CODE',
      ID_PROOF: 'ID_PROOF',
      BUSINESS_DOCUMENT: 'BUSINESS_DOCUMENT',
    },
    BUTTON_TEXT:{
      CREATED: 'PROCEED TO SHOP IMAGES',
      BRANDING_ADDED: 'PROCEED TO LINK BANK ACCCOUNT',
      ACCOUNT_LINKED: 'PROCEED TO SCAN QR',
      MAPPED: 'PROCEED TO QR DOCUMENTATION',
      QR_DOC_ADDED: 'COMPLETE MERCHANT ONBOARDING',
    },
    PAGE_NAVIGATION_TYPES:{
      BRANDING: 'BRANDING',
      QR: 'QR',
      ID_PROOF: 'IDPROOF',
      BUSINESS_PROOF: 'BUSINESSPROOF'
    },
    MERCHANT_SUCCESSFULLY_ONBOARDED: 'MERCHANT SUCCESSFULLY ONBOARDED'
  });
    