import { ACTION_TYPE } from '../actionType';

let initialState = {
    bankList: [],
    bankIfscMap: {},
    bankSearchList: []
}

function bankListReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.UPDATE_BANK_LIST: 
            let bankIfscMap = {};
            action.bankList.forEach(element => {
                bankIfscMap[element.ifscPrefix] = element.name;
            });
            return {...state, bankList: action.bankList, bankSearchList: action.bankList, bankIfscMap: bankIfscMap} 
        case ACTION_TYPE.UPDATE_SEARCH_BANK_LIST: 
            if(!action.name){
                return  {...state, bankSearchList: state.bankList}
            }else{    
                let bankSearchList = state.bankList.filter(element => {
                    return (contains(element.name, action.name) || contains(element.ifscPrefix, action.name));
                });
                return  {...state, bankSearchList: bankSearchList}            
            }
        default:
            return state;
    }
}

function contains(text, searchText) {

    return text.toLowerCase().includes(searchText.toLowerCase());
}

export default bankListReducer;