import { ACTION_TYPE } from '../actionType';

let initialState = {
    branding: [],
    qr: [],
    idProof: [],
    businessProof: []
};
function uploadReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.UPLOAD.UPDATE_BRANDING_IMAGES_LIST:
            return {...state, branding: action.brandingList.length > 0 ? [{headerName: action.headerName, images: action.brandingList}] : []};
        
        case ACTION_TYPE.UPLOAD.UPDATE_BRANDING_QR_IMAGES_LIST:
            return {...state, qr: action.qrList.length > 0 ? [{headerName: action.headerName, images: action.qrList}] : []};
        
        case ACTION_TYPE.UPLOAD.UPDATE_ID_PROOF_IMAGES_LIST:
            return {...state, idProof: action.idProofList || []};
        
        case ACTION_TYPE.UPLOAD.UPDATE_BUSINESS_PROOF_IMAGES_LIST:
            return {...state, businessProof: action.businessProofList || []};
    
        default:
            return state;
    }
}

export default uploadReducer;