import { ACTION_TYPE } from '../actionType';

let initialState = ''

export default function appUpdateReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.LOAD_APP_VERSION:
        return action.appVersion;
        default:
            return state;
    }
  }
  