import { ACTION_TYPE } from '../actionType';

let initialState = {token: ''}

export default function OTPReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.UPDATE_OTP_TOKEN: 
            return {...state, token: action.token}
        case ACTION_TYPE.CLEAR_OTP_TOKEN:
            return {...state, token: ""}
        default:
            return state;
    }
  }
  