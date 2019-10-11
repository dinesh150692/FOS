import { ACTION_TYPE } from '../actionType';

function ajaxStatusReducer(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPE.BEGIN_AJAX_CALL: 
            return {...state, state: 'inprogress', status: true}
        
        case ACTION_TYPE.END_API_CALL: 
            return {...state, state: 'completed', status: true}
        
        case ACTION_TYPE.AJAX_CALL_ERROR:
            return {...state, state: 'error', status: false}

        default:
            return state;
    }
}

export default ajaxStatusReducer;