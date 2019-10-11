import { ACTION_TYPE } from '../actionType';

let initialState = ''

export default function devicePrintReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.LOAD_DEVICE_PRINT:
            return action.devicePrint;
        default:
            return state;
    }
  }
  