import { ACTION_TYPE } from '../actionType';

let initialState = ''

export default function pageTypeReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.UPDATE_PAGE_TYPE:
            return action.pageType;
        
        case ACTION_TYPE.CLEAR_PAGE_TYPE:
            return initialState;
        
        default:
            return state;
    }
  }
  