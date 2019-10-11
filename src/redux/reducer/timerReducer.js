import { ACTION_TYPE } from '../actionType';
import { TIME_OUT } from '../../shared/constants';

let initialState = {
    time:'',
    timeOut: TIME_OUT,
    timerStart: false,
    successTimer: false
}

export default function timerReducer(state = initialState, action) {
    let minute = parseInt((TIME_OUT) / 60);
    let second = parseInt((TIME_OUT)% 60);
    switch (action.type) {
        case ACTION_TYPE.START_TIMER: 
            return {...state, timeOut: TIME_OUT, time: minute + ':' + second, timerStart: true}
        
        case ACTION_TYPE.INIT_TIMER:
            minute = parseInt((state.timeOut) / 60);
            second = parseInt((state.timeOut)% 60);  
            if(second < 10){
                second = '0' + second;
            }      
            if(minute < 10){
                minute = '0' + minute;
            }
            return {...state, timeOut:  state.timeOut, time: minute + ':' + second}	
        
        case ACTION_TYPE.UPDATE_TIMER:
            return {...action.timerDetails}
        
        case ACTION_TYPE.CLEAR_TIMER:
            return {...state, timeOut: 0, time: '0:00', timerStart: false}
            
        case ACTION_TYPE.INIT_VALUE:
            return {...state, timeOut: TIME_OUT, time: minute + ':' + second, timerStart: action.value}
        
        case ACTION_TYPE.START_SUCCESS_TIMER: 
            return {...state, successTimer: true};
        
        case ACTION_TYPE.CLEAR_SUCCESS_TIMER: 
            return {...state, successTimer: false};

        case ACTION_TYPE.CLEAR_DATA:
            return initialState;

        default:
            return state;
    }
  }
  