/* Library Import */
import Config from 'react-native-config';
import { Alert, Linking, ToastAndroid } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
/* Sentry Import */
import {Sentry} from 'react-native-sentry';
/* Component Import */
import { fetchGetAPI } from '../../shared/fetch';
import { goToPage } from '../../components/common/logout';
import { handleGenericError } from '../../components/common/errorHandler';
/* Constant Import */
import { ACTION_TYPE } from '../actionType';
import { APP_UPDATE } from '../../shared/constants';
import { ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';
import { version } from '../../../package.json';
import { getFetchHeaders } from './fetchHeaderAction';

const APP_VERSION_URL = Config.MERCHANT_ONBARDING_URL;

/** Action dispatch to save the data in the store as initialToken
 *  @param  {Object}     appVersion
 * 	@return {Object}    
 */
export function getAppVersionResult(appVersion) {
    return { type: ACTION_TYPE.LOAD_APP_VERSION, appVersion };
}

/** Makes http API call to get the AppVersion
 * 	Dispatches to save response in store on success
 * 	@return {Promise} 
 */
export function getAppVersion() {
    return dispatch => {
        const url = APP_VERSION_URL + 'versions/' + version;
        const headers = getFetchHeaders();
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        return fetchGetAPI(url,null,headers).then(result => {
            dispatch(getAppVersionResult(result.data));
            if(result && result.data && result.data.success){
                if(result.data.data.updateRequired){
                    SplashScreen.hide();
                    this.setState({loading: false, buttonDisabled: true, appUpdate: true});
                    Alert.alert(
                        APP_UPDATE.HEADER,
                        APP_UPDATE.TEXT,
                        [
                            {
                                text: 'Update', onPress: () => {
                                    Linking.openURL(result.data.data.updateLink)
                                }
                            }
                        ],
                        { cancelable: false }
                    )
                }else{
                    dispatch({ type: ACTION_TYPE.END_API_CALL });
                    return goToPage('MerchantList');
                }
            }else{
                let error = handleGenericError(result, false);
                if(this.props.navigation.state.hasOwnProperty('routeName') && this.props.navigation.state.routeName === 'Login'){
                    this.resetLogin(error);
                }else{
                    goToPage('Login');
                }
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            if(this.props.navigation.state.hasOwnProperty('routeName') && this.props.navigation.state.routeName !== 'Login'){
                goToPage('Login');
            }
            Sentry.captureException(error);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
            ToastAndroid.show(ERROR_CODES_AND_MESSAGES.GENERIC_ERROR, ToastAndroid.LONG);
        });
    };

}
