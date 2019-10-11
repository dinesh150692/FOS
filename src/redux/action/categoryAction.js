/* Library Imports */
import Config from 'react-native-config';
import { ToastAndroid } from 'react-native';
/* Component Imports */
import { fetchGetAPI } from '../../shared/fetch';
import { handleGenericError, handleUnauthorizedCase } from '../../components/common/errorHandler';
/* Constant Imports */
import { ACTION_TYPE } from '../actionType';
import {  ERROR_CODES_AND_MESSAGES } from '../../shared/errorCodes';
/* Action Imports */
import { getFetchHeaders } from './fetchHeaderAction';
const SUPER_CATEGORY_URL = Config.SUPER_CATEGORY_URL;
const SUB_CATEGORY_URL = Config.SUB_CATEGORY_URL;



function textFormatter(text){
    if(!text){
        return '';
    }
    text = text.replace(/_/gi, ' ').toLowerCase().split(' ');
    for (let i = 0; i < text.length; i++) {
      text[i] = text[i].charAt(0).toUpperCase() + text[i].substring(1);     
      }
    text = text.join(' ');
    return text;
}

/** Action dispatch to clear the data in the store
 * 	@return {Object}    
 */
export function clearCategoryDetails() {
    return { type: ACTION_TYPE.CLEAR_CATEGORY_AND_SUB_CATEGORY };
}

/** Action dispatch to update the data in the store as category state
 *  @param  {String}  categoryState
 * 	@return {Object}    
 * categoryState 
 * 0 - Super Category  
 * 1 - Category
 * 2 - Sub Category
 */
export function updateCategoryStateProp(categoryState) {
    return { type: ACTION_TYPE.UPDATE_CATEGORY_STATE, categoryState };
}

/** Action dispatch to save the data in the store as super category
 *  @param  {Object}  superCategory
 * 	@return {Object}    
 */
export function updateSuperCategoryDetails(superCategory) {
    for (let i  = 0; i < superCategory.superCategory.length ; i++) {
        superCategory.superCategory[i].value = textFormatter(superCategory.superCategory[i].value);
    }
    return { type: ACTION_TYPE.LOAD_SUPER_CATEGORY, superCategory };
}

/** Action dispatch to save the data in the store as category
 *  @param  {Object}    category
 * 	@return {Object}    
 */
export function updateCategoryDetailsAPI(category) {
    for (let i  = 0; i < category.category.length ; i++) {
        category.category[i].value = textFormatter(category.category[i].value);
    }
    
    return { type: ACTION_TYPE.LOAD_CATEGORY, category};
}

/** Action dispatch to save the data in the store as sub category
 *  @param  {Object}     subCategory
 * 	@return {Object}    
 */
export function updateSubCategoryDetailsAPI(subCategory) {
   
    for (let i  = 0; i < subCategory.subCategory.length ; i++) {
        subCategory.subCategory[i].value = textFormatter(subCategory.subCategory[i].value);
    }
    
    return { type: ACTION_TYPE.LOAD_SUB_CATEGORY, subCategory };
}

/** Makes http API call to get the super categories
 * 	Dispactches to save response in store on success
 * 	@return {Promise} 
 */
export function getSuperCategory() {
    return dispatch => {
        const url = SUPER_CATEGORY_URL;
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const headers = getFetchHeaders();
        return fetchGetAPI(url, null, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){
                if(result.data.data.length > 0){
                    dispatch(updateSuperCategoryDetails({superCategory: result.data.data}));
                }
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    let error = handleGenericError(result, false);
                    if(error){
                        ToastAndroid.show(ERROR_CODES_AND_MESSAGES.SUPER_CATEGORY_ERROR, ToastAndroid.LONG)
                    }
                    dispatch(updateSuperCategoryDetails({superCategory: []}));    
                }
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };
}

/** Makes http API call to get the sub categories
 * 	Dispactches to save response in store on success
 * 	@return {Promise} 
 */
export function getCategory(type, categoryID) {
    return (dispatch) => {
        const url = SUB_CATEGORY_URL + categoryID;
        dispatch({ type: ACTION_TYPE.BEGIN_AJAX_CALL });
        const headers = getFetchHeaders();
        return fetchGetAPI(url, null, headers).then(result => {
            if(result && result.data && result.data.hasOwnProperty('success') && result.data.success){ 
                if(result.data.data.children.length > 0){
                    if(type === 'Category'){
                        dispatch(updateCategoryDetailsAPI({category: result.data.data.children}));
                        dispatch(updateCategoryStateProp(1));
                    }else{
                        dispatch(updateSubCategoryDetailsAPI({subCategory: result.data.data.children}));
                        dispatch(updateCategoryStateProp(2));
                    }    
                }else{
                    if(type === 'Category'){
                        dispatch(updateCategoryDetailsAPI({category: []}));
                        dispatch(updateCategoryStateProp(1));
                    }else{
                        dispatch(updateSubCategoryDetailsAPI({subCategory: []}));
                        dispatch(updateCategoryStateProp(2));
                    }
                }
            }else{
                if(handleUnauthorizedCase(result, dispatch)){
                    let error = handleGenericError(result, false);
                    if(type === 'Category'){
                        error && ToastAndroid.show(ERROR_CODES_AND_MESSAGES.CATEGORY_ERROR, ToastAndroid.LONG);
                        dispatch(updateCategoryDetailsAPI({category: []}));
                        dispatch(updateCategoryStateProp(1));
                    }else{
                        error && ToastAndroid.show(ERROR_CODES_AND_MESSAGES.SUB_CATEGORY_ERROR, ToastAndroid.LONG);
                        dispatch(updateSubCategoryDetailsAPI({subCategory: []}));
                        dispatch(updateCategoryStateProp(2));
                    }
                }
                
            }
            dispatch({ type: ACTION_TYPE.END_API_CALL });
        }).catch(error => {
            dispatch({ type: ACTION_TYPE.AJAX_CALL_ERROR });
        });
    };
}


