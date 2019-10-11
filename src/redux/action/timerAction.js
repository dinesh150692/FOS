import { ACTION_TYPE } from '../actionType';

/** Action dispatch to update the data in the store as timer count
 *  @param  {Object} timer
 * 	@return {Object}    
 */
export function updateTimer(timerDetails) {
    return { type: ACTION_TYPE.UPDATE_TIMER, timerDetails };
}

/** Action dispatch to clear the success onboarding timer
 * 	@return {Object}    
 */
export function clearSuccessTimer() {
    return { type: ACTION_TYPE.CLEAR_SUCCESS_TIMER };
}

/** Action dispatch to start the success onboarding timer
 * 	@return {Object}    
 */
export function startSuccessTimer() {
    return { type: ACTION_TYPE.START_SUCCESS_TIMER };
}


/** Action dispatch to save the data in the store as timer count
 *  @param  {Object} timer
 * 	@return {Object}    
 */
export function initTimer() {
    return { type: ACTION_TYPE.INIT_TIMER };
}

/** Action dispatch to save the clear the timer
 * 	@return {Object}    
 */
export function clearTimer() {
    return { type: ACTION_TYPE.CLEAR_TIMER };
}


/** Action dispatch to start the timer
 * 	@return {Object}    
 */
export function startTimer() {
    return { type: ACTION_TYPE.START_TIMER };
}

/** Action dispatch to reset the init timer value
 * 	@return {Object}    
 */
export function resetInitValue(value){
    return { type: ACTION_TYPE.INIT_VALUE, value};
}