import { ACTION_TYPE } from '../actionType';
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = new Date();

let initialState = {
    merchantList: [],
    searchMerchantList: [],
    merchantCountDetails:{
        today: 0,
        lastMonth: 0,
        currentMonth: 0,
        todayName: d.getDate(),
        lastMonthName: month[d.getMonth()-1],
        currentMonthName: month[d.getMonth()]
    }
};

function merchantListReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.LOAD_MERCHANT_LIST:
            if(action.hasOwnProperty('merchantList') && action.merchantList && action.merchantList.length > 0){
                action.merchantList.sort(function(a,b){return b.updatedAt - a.updatedAt});
                return  {...state, merchantList: action.merchantList, searchMerchantList: action.merchantList}
            }else{
                return  {...state, merchantList: [], searchMerchantList: []}
            }
        case ACTION_TYPE.UPDATE_MERCHANT_SEARCH_LIST:
            let searchMerchantList = [];
            if(!action.phoneNumber){
                return  {...state, searchMerchantList: state.merchantList}
            }else{
                searchMerchantList = state.merchantList.filter(element => element.phoneNumber.includes(action.phoneNumber));
                return  {...state, searchMerchantList: searchMerchantList}            
            }
        case ACTION_TYPE.UPDATE_MERCHANT_ONBOARDED_COUNT:
            return {...state,  merchantCountDetails: {...state.merchantCountDetails, ...action.merchantCount}}
        case ACTION_TYPE.CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}

export default merchantListReducer;