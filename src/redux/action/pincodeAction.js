/* Library Import */
import Config from 'react-native-config';
import { ToastAndroid } from 'react-native';

/* Component Import */
import { fetchGetAPI } from '../../shared/fetch';
import { handleGenericError, handleUnauthorizedCase } from '../../components/common/errorHandler';

/* Constant Import */
import { ACTION_TYPE } from '../actionType';
import { ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';

/* Constant Import */
import { getFetchHeaders } from './fetchHeaderAction';
/* Sentry Import */
import {Sentry} from 'react-native-sentry';

const PINCODE_URL = Config.PINCODE_URL;

/** Action dispatch to update the data in the store as pincode details list
 *  @param  {Object} timer
 * 	@return {Object}    
 */
export function updatePincodeDetails(details) {
    return { type: ACTION_TYPE.UPDATE_PINCODE_DETAILS, details };
}

/** Makes http API call to get a merchant and
 * 	Dispatches to save response and data in store on success
 * 	@param  {object}     login
 * 	@return {Promise} 
 */
export function getPincodeDetails(pincode) {
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = PINCODE_URL+ pincode;
        const headers = getFetchHeaders();
        return fetchGetAPI(url, null, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('pincodeDetails') && result.data.pincodeDetails){
                if(result.data.pincodeDetails.length === 0){
                    dispatch(updatePincodeDetails([]));
                    ToastAndroid.show(ERROR_CODES_AND_MESSAGES.PINCODE_EMPTY_ERROR, ToastAndroid.LONG);
                    this.setState({loadingPincode: false, cityList: [], stateList: [], localityList: [], state: '', city: '', locality: ''});
                }else{
                    dispatch(updatePincodeDetails(result.data.pincodeDetails));
                    this.setState({loadingPincode: false}, () => {
                        this.getStateDetails(result.data.pincodeDetails);
                    });
                }
            }else {
                if(handleUnauthorizedCase(result, dispatch)){
                    handleGenericError(result);
                    dispatch(updatePincodeDetails([]));
                    this.setState({loadingPincode: false, cityList: [], stateList: [], localityList: [], state: '', city: '', locality: ''});
                }
            }        
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            Sentry.captureException(error);
            ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
            dispatch(updatePincodeDetails([]));
            this.setState({loadingPincode: false, cityList: [], stateList: [], localityList: [], state: '', city: '', locality: ''});
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };
}