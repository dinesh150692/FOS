import { ACTION_TYPE } from '../actionType';

let initialState = {
    categoryState: 0,
    superCategory: [],
    category: [],
    subCategory: []
}

export default function categoryReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.UPDATE_CATEGORY_STATE: 
            return { ...state, categoryState: action.categoryState}  

        case ACTION_TYPE.LOAD_SUPER_CATEGORY:
            if(action.superCategory.superCategory.length > 0){
                action.superCategory.superCategory.sort(function(a,b){
                    return (a.value < b.value) ? -1 : (a.value > b.value) ? 1 : 0;
                });
            }
            return { ...state, ...action.superCategory}
        
        case ACTION_TYPE.LOAD_CATEGORY: 
            if(action.category.category.length > 0){
                action.category.category.sort(function(a,b){
                    return (a.value < b.value) ? -1 : (a.value > b.value) ? 1 : 0;
                });
            }
            return { ...state, ...action.category}
        
        case ACTION_TYPE.LOAD_SUB_CATEGORY: 
            if(action.subCategory.subCategory.length > 0){
                action.subCategory.subCategory.sort(function(a,b){
                    return (a.value < b.value) ? -1 : (a.value > b.value) ? 1 : 0;
                });
            }
            return { ...state, ...action.subCategory}
        
        case ACTION_TYPE.CLEAR_CATEGORY_AND_SUB_CATEGORY: 
            return { ...state, category: [], subCategory: [], categoryState: 0}   

        default:
            return state;
    }
  }
  