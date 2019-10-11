/* Library Imports */
import { ToastAndroid } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
/* Constant Imports */
import { ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';

let _navigator;

export function logout(showError = true){
    if(showError){
        ToastAndroid.show(ERROR_CODES_AND_MESSAGES.SESSION_EXPIRED, ToastAndroid.LONG);
    }
    goToPage('Login')
}

export function goToPage(page){
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: page })],
    });
    _navigator.dispatch(resetAction);
    return true;
}

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

export function navigate(routeName) {

    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: routeName })],
    });
    _navigator.dispatch(resetAction);
    return true;
}

export default {
    setTopLevelNavigator,
};