import { ACTION_TYPE } from '../actionType';

let initialState = {
    qrCode: []
};

export default function notificationReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.ADD_NOTIFICATION_FOR_QRCODE:
        case ACTION_TYPE.REMOVE_NOTIFICATION_FOR_QRCODE:
        case ACTION_TYPE.ADD_NEW_QRCODE:
            return {...state, qrCode :[ ...action.item]};
        
        case ACTION_TYPE.CLEAR_NOTIFICATION_DETAILS:
            return { ...state, qrCode: []}
                
        default:
            return state;
    }
}