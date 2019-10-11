/* Library Import */
import Config from 'react-native-config';
/* Sentry Import */
import {Sentry} from 'react-native-sentry';
/* Component Import */
import { goToPage } from '../../components/common/logout';
import { fetchAPISetup, fetchGetAPI } from '../../shared/fetch';
/* Constant Import */
import { ACTION_TYPE } from '../actionType';
import { LOGIN_TIMEOUT } from '../../shared/constants';
import { LOGIN_ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';
/*Action Imports*/
import { getAppVersion } from './appUpdateAction';
import { getFetchHeaders } from './fetchHeaderAction';

const LOGIN_URL = Config.LOGIN_URL;
const INIT_URL = Config.INIT_URL;
const REQUEST_OTP = Config.REQUEST_OTP;

/** Action dispatch to save the data in the store as initialToken
 *  @param  {String}     initialToken
 * 	@return {Object}    
 */
export function getInitialTokenSuccess(initialToken) {
    initialToken = initialToken.hasOwnProperty('headers') && initialToken.headers ? initialToken.headers : '';
    return { type: ACTION_TYPE.LOAD_INITIAL_TOKEN, initialToken};
}

export function updateAgentId(agentId) {
    return { type: ACTION_TYPE.LOAD_AGENT_ID, agentId};
}

/** Makes http API call to get the csrf-token
 *  Dispactches to save response in store on success
 *  @return {Promise} 
 */
export function getInitialToken() {
    return dispatch => {
        const url = INIT_URL;
        return fetchGetAPI(url).then(result => {
            dispatch(getInitialTokenSuccess(result));
            if(result && result.data && result.data.hasOwnProperty('code') && result.data.code === 'SUCCESS' && result.data.data && result.data.data.hasOwnProperty('externalUserId')){
                dispatch(updateAgentId(result.data.data.externalUserId));
                Sentry.setUserContext(result.data.data);
                dispatch(getAppVersion.call(this));
            }else{
                if(this.props.navigation.state.hasOwnProperty('routeName') && this.props.navigation.state.routeName !== 'Login'){
                    goToPage('Login');
                }
            } 
            return result;  
        }).catch(error => {
            Sentry.captureException(error);
            if(this.props.navigation.state.hasOwnProperty('routeName') && this.props.navigation.state.routeName !== 'Login'){
                goToPage('Login');
            }
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };
}

/** Makes http API call to login
 * 	Dispactches to save response in store on success
 * 	@param  {object}     login
 *  @param  {object}     headers
 * 	@return {Promise} 
 */
export function requestOTP(login){
    let {error} = this.state;
    return dispatch => {

        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = REQUEST_OTP;
        const headers = getFetchHeaders(false);
        return fetchAPISetup(url,'POST',login, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('code')){
                if(result.data.code === 'SUCCESS' && result.data.hasOwnProperty('data') && result.data.data.hasOwnProperty('token')){
                    error['apiError'] = '';
                    if(this.state.otpText !== 'Enter OTP'){
                        this.smsSubscription === null && this.smsListener();  
                    }else{
                        this.setState({loading: false});
                    }
                    this.setState({ 
                        error, 
                        step: 1, 
                        time: '01:00',
                        buttonDisabled: true,
                        timeOut: LOGIN_TIMEOUT,
                        otpToken: result.data.data.token 
                    }, () => {
                        this.timerCountDown();
                    });
                }else if(result.data.code === LOGIN_ERROR_CODES_AND_MESSAGES.UNAUTHORIZED){
                    retryLogin.call(this, login);
                }else{
                    error['apiError'] = LOGIN_ERROR_CODES_AND_MESSAGES[result.data.code]
                                        ?LOGIN_ERROR_CODES_AND_MESSAGES[result.data.code]
                                        :LOGIN_ERROR_CODES_AND_MESSAGES.GENERIC_ERROR;
                    this.setState({loading: false, error});
                }
            }else{
                error['apiError'] = LOGIN_ERROR_CODES_AND_MESSAGES.GENERIC_ERROR;
                this.setState({ loading: false, error});
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
            return result;
        }).catch(err => {
            error['apiError'] = LOGIN_ERROR_CODES_AND_MESSAGES.GENERIC_ERROR;
            this.setState({ loading: false, error});
            Sentry.captureException(err);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };

}

/** Makes http API call to login
 * 	Dispactches to save response in store on success
 * 	@param  {object}     login
 * 	@return {Promise} 
 */
export function appLogin(login) {
    let { error } = this.state;
    return dispatch => {
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const url = LOGIN_URL;
        const headers = getFetchHeaders();
        return fetchAPISetup(url,'POST',login, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('code')){
                if(result.data.code === 'SUCCESS'){
                    error['apiError'] = '';
                    this.setState({error});
                    if(result.data.data){
                        Sentry.setUserContext(result.data.data);
                    }
                    this.checkAppUpdate();
                    dispatch(updateAgentId(result.data.data.externalUserId));
                    dispatch({ type: ACTION_TYPE.END_API_CALL });
                    return result;
                }else{
                    error['apiError'] = LOGIN_ERROR_CODES_AND_MESSAGES[result.data.code]
                    ? LOGIN_ERROR_CODES_AND_MESSAGES[result.data.code]
                    :LOGIN_ERROR_CODES_AND_MESSAGES.GENERIC_ERROR;
                    if(error['apiError'] === LOGIN_ERROR_CODES_AND_MESSAGES.INVALID_OTP){
                        this.setState({ 
                            loading: false,  
                            otp: ['','','','',''], 
                            focus: [false, false, false, false, false], 
                            error
                        }, () =>{
                            this.handleOTPValidation();
                        });
                    }else{
                        this.resetLogin(error['apiError']);
                    }
                    
                    dispatch({ type: ACTION_TYPE.END_API_CALL });
                    return result;
                }
            }
        }).catch(err => {
            error['otp'] = LOGIN_ERROR_CODES_AND_MESSAGES.GENERIC_ERROR;
            this.setState({ 
                loading: false, 
                otp: ['','','','',''], 
                focus: [false, false, false, false, false], 
                error
            },()=>{
                this.handleOTPValidation();
            });
            Sentry.captureException(err);
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };
}

function retryLogin(login){
    this.props.getInitialToken.call(this).then(response =>{
        if(response.hasOwnProperty('headers') && response.headers){
            this.props.requestOTP.call(this, login);  
        }else{
            let {  error } = this.state;
            error['apiError'] = LOGIN_ERROR_CODES_AND_MESSAGES.GENERIC_ERROR;
            this.setState({ loading: false, error});
        }
    });
}