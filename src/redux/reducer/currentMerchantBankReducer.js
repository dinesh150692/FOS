import { ACTION_TYPE } from '../actionType';

let initialState = [];

export default function currentMerchantBankReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.LOAD_BANK_LINKED_LIST:
            return action.bankLinkList;
        default:
            return state;
    }
}
  