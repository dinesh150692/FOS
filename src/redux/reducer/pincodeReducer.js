import { ACTION_TYPE } from '../actionType';

let initialState = {
    list: []
}

export default function pincodeReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.UPDATE_PINCODE_DETAILS: 
           return {list: action.details};
        default:
            return state;
    }
  }
  