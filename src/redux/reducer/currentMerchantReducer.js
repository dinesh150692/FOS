import { ACTION_TYPE } from '../actionType';

let initialState = {
    merchantId: '',
    merchantDetails: {
        email: '',
        phoneNumber: '',
        merchantName:'',
        businessName: '',
        subCategory: '',
        category: '',
        superCategory: ''
    },
    categoryDetails: {
        subCategory: '',
        category: '',
        superCategory: ''
    },
    bankDetails:{},
    addressDetails:{},
    onboardingStage: '',
    uploadedStates:{
        QR_CODE: false,
        ID_PROOF: false,
        BRAND_IMAGE: false,
        BUSINESS_DOCUMENT: false,
    },
    editFlow: false
};

export default function currentMerchantDetailsReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.UPDATE_MERCHANT_ID:
            return {...state, merchantId: action.id};

        case ACTION_TYPE.UPDATE_ONBOARDING_STAGE:
            return {...state, onboardingStage: action.onboardingStage};

        case ACTION_TYPE.UPDATE_MERCHANT_ADDRESS_DETAILS:
            return {...state, ...{addressDetails: action.addressDetails}};
        
        case ACTION_TYPE.UPDATE_MERCHANT_DETAILS:
            return {...state, ...{merchantDetails: action.merchantDetails}, ...{categoryDetails : action.categoryValues}}
    
        case ACTION_TYPE.UPDATE_MERCHANT_BANK_DETAILS:
            return {...state, ...{bankDetails: action.bankDetails}}
        
        case ACTION_TYPE.CLEAR_MERCHANT_DETAILS: 
            return {...state, ...initialState} 
        
        case ACTION_TYPE.UPDATE_EDIT_FLOW_TYPE:
            return {...state, editFlow: action.edit}
        
        case ACTION_TYPE.UPDATE_UPLOADED_STATES:
            return {...state, uploadedStates: {...state.uploadedStates, ...action.uploadedStates}}
        
            default:
            return state;
    }
}
  