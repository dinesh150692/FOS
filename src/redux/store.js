/* Library Imports */
import ReduxThunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';

/* Reducer Imports */
import rootReducer from './reducer';
import logger from 'redux-logger';

export default function configureStore(initialState) {

    if (__DEV__) {
        return createStore(
            rootReducer, initialState,
            composeWithDevTools(
                applyMiddleware(ReduxThunk, logger)
            )
        );
    }
    else {
        return createStore(
            rootReducer, initialState,
            composeWithDevTools(
                applyMiddleware(ReduxThunk)
            )
        );
    }
}