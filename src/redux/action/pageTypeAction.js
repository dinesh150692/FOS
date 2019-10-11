import { ACTION_TYPE } from '../actionType';

/** Action dispatch to save the data in the store as page type
 *  @param  {String}     pageType
 * 	@return {Object}    
 */
export function updatePageType(pageType) {
    return { type: ACTION_TYPE.UPDATE_PAGE_TYPE, pageType };
}


/** Action dispatch to save the data in the store as page type
 * 	@return {Object}    
 */
export function clearPageType() {
    return { type: ACTION_TYPE.CLEAR_PAGE_TYPE };
}