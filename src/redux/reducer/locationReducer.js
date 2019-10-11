import { ACTION_TYPE } from '../actionType';
let initialState = {
    lat : '',
    long: ''
}

export default function locationReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.UPDATE_LOCATION_DATA:
            return {...state, lat: action.lat, long: action.long}
        
        case ACTION_TYPE.CLEAR_LOCATION_DATA:
            return {...state, lat: '', long: ''}
        
        default:
            return state;
    }
  }
  