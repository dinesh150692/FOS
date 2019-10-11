/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import { AsyncStorage } from 'react-native';
/* Action Import */
import { getInitialToken } from '../redux/action/loginAction';
import { getDevicePrint } from '../redux/action/devicePrintAction';
import { updateBankList } from '../redux/action/bankListAction';
import { loadMerchantList } from '../redux/action/merchantListAction';
class SplashScreen extends React.PureComponent {
    constructor(props){
        super(props);
    }
    
    componentDidMount(){
        this.props.getInitialToken.call(this);
        this.props.getDevicePrint();
        this.props.loadMerchantList([]);
        AsyncStorage.getItem('supportedBanks').then((value) => {
            if(value !== null){
                let bankList = JSON.parse(value);
                if(bankList && bankList.length > 0 ){
                    this.props.updateBankList(bankList);
                }  
            }else{
                this.props.updateBankList([]);
            }     
            // AsyncStorage.clear();
        });
    }

    render(){
        return null;
    }
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = { 
    updateBankList,
    getDevicePrint,
    getInitialToken,
    loadMerchantList
};

export default connect(null, mapDispatchToProps)(SplashScreen);
