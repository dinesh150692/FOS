import { ACTION_TYPE } from '../actionType';

let initialState = {
    initialToken : '',
    agentId: ''
}

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.LOAD_INITIAL_TOKEN:
            return {...state, ...{initialToken: action.initialToken}};
        case ACTION_TYPE.LOAD_AGENT_ID:
        return {...state, ...{agentId: action.agentId}};
        // case ACTION_TYPE.CLEAR_DATA:
        //     return initialState
        default:
            return state;
    }
  }
  