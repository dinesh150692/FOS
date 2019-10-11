
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { ToastAndroid } from 'react-native';
/* Action Import */
import { ACTION_TYPE } from '../actionType';
import { closeGPSModal, openGPSModal } from './modalAction';
/* Constant Import */
import { LOCATION_ERROR } from '../../shared/constants';

export function updateLocationData(lat, long) {
    return {type: ACTION_TYPE.UPDATE_LOCATION_DATA, lat, long}
}

export function clearLocationData() {
    return {type: ACTION_TYPE.CLEAR_LOCATION_DATA}
}

export function getLocationData() {
    return dispatch => {
        Geolocation.getCurrentPosition((position) => {
            dispatch(updateLocationData(position.coords.latitude, position.coords.longitude))
        },function(error) {
            if(error.message.code == 3){
                ToastAndroid.show(LOCATION_ERROR, ToastAndroid.SHORT);
                dispatch(getLocationData());
            }else if(error.message.code == 2){
                dispatch(enableLocation());
            }
        },{enableHighAccuracy: true, timeout: 15000, maximumAge: 10000});     
    }
}

export function enableLocation(){
    return dispatch => {
        dispatch(clearLocationData());
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
        .then(data => {
            if(data === "enabled" || data === "already-enabled"){
                dispatch(getLocationData());
                dispatch(closeGPSModal());
            }
        }).catch(err => {
            if(err.code){
                dispatch(openGPSModal());
            }
        });   
    }
}