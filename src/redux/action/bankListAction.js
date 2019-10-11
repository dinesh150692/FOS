/* Library Imports */
import Config from 'react-native-config';
import { AsyncStorage } from 'react-native';
/* Sentry Import */
import {Sentry} from 'react-native-sentry';
/* Component Imports */
import { fetchGetAPI } from '../../shared/fetch';
import { handleGenericError, handleUnauthorizedCase } from '../../components/common/errorHandler';
/* Constant Imports */
import { ACTION_TYPE } from '../actionType';

const MERCHANT_ONBARDING_URL = Config.MERCHANT_ONBARDING_URL;
const SUPPORT_BANK_URL = Config.SUPPORT_BANK_URL;

/** Action dispatch to save the data in the store as banklist
 *  @param  {Array}    bankList
 * 	@return {Object}    
 */
export function updateBankList(bankList) {
    try {
        AsyncStorage.setItem('supportedBanks', JSON.stringify(bankList));
    } catch (error) {
    }
    return { type: ACTION_TYPE.UPDATE_BANK_LIST, bankList};
}

/** Action dispatch to save the data in the store as search bank list
 *  @param  {String}    name
 * 	@return {Object}    
 */
export function updateSearchBankList(name) {
    return { type: ACTION_TYPE.UPDATE_SEARCH_BANK_LIST, name};
}

/** 
 *  Find the max updated at value and return it
 * 	@return {Number}    
 */
function findMax(bankList) {
    let max = 0;
    for (let i = 0, len=bankList.length; i < len; i++) {
      let v = bankList[i].updatedAt;
      max = (v > max) ? v : max;
    }
    return max;
}


/** Makes http API call to get the supported banks
 * 	Dispactches to save response in store on success
 * 	@return {Promise} 
 */
export function getBankList(oldbankList) {
    oldbankList = oldbankList.length > 0 ? oldbankList : [];
    let updatedAt = findMax(oldbankList);
    return dispatch => {
        const url = MERCHANT_ONBARDING_URL + SUPPORT_BANK_URL + updatedAt;
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        return fetchGetAPI(url).then(result => {
            if(result && result.data && result.data.hasOwnProperty('data') && result.data.data.length > 0){
                dispatch(updateBankList(oldbankList.concat(result.data.data)))
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    let error = handleGenericError(result, false);
                    this.setState({error});
                    dispatch(updateBankList(oldbankList))
                }
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
            return result;
        }).catch(error => {
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
            Sentry.captureException(error);
        });
    };

}




