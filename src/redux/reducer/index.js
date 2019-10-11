/* Library Imports */
import { combineReducers } from 'redux';

/* Custom Reducer Imports */
import OTPReducer from './otpReducer';
import loginReducer from './loginReducer';
import timerReducer from './timerReducer';
import modalReducer from './modalReducer';
import ajaxStatusReducer from './ajaxReducer';
import pincodeReducer from './pincodeReducer';
import pageTypeReducer from './pageTypeReducer';
import bankListReducer from './bankListReducer';
import categoryReducer from './categoryReducer';
import appUpdateReducer from './appUpdateReducer';
import devicePrintReducer from './devicePrintReducer';
import merchantListReducer from './merchantListReducer';
import notificationReducer from './notificationReducer';
import currentMerchantReducer from './currentMerchantReducer';
import currentMerchantBankReducer from './currentMerchantBankReducer';
import imageListReducer from './uploadReducer';
import locationReducer from './locationReducer';

export default combineReducers({
    otp: OTPReducer,
    modal:modalReducer,
    location: locationReducer,
    pageType: pageTypeReducer,
    bankList: bankListReducer,
    loginDetails: loginReducer,
    timerDetails: timerReducer,
    categories: categoryReducer,
    imageList: imageListReducer,
    appUpdate : appUpdateReducer,
    ajaxStatus : ajaxStatusReducer,
    pincodeDetails: pincodeReducer,
    devicePrint :devicePrintReducer,
    merchantList: merchantListReducer,
    currentMerchantDetails: currentMerchantReducer,
    currentMerchantDeviceDetails: notificationReducer,
    currentMerchantbankLinkedList : currentMerchantBankReducer
});