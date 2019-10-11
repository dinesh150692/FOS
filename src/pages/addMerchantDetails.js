/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import { Container } from 'native-base';
import { BackHandler, Keyboard, View } from 'react-native';
/* Component Imports*/
import Timer from '../components/timer';
import Header from '../components/header';
import Input from '../components/common/input';
import Button from '../components/common/button';
import { goToPage } from '../components/common/logout';
import AlertModal from '../components/common/alertModal';
/* Action Import */
import { resetInitValue } from '../redux/action/timerAction';
import { closeAlertModal, openAlertModal } from '../redux/action//modalAction';
import {  updateCategoryStateProp } from '../redux/action/categoryAction';
import { checkMerchantExists, loadCurrentMerchantDetails } from '../redux/action/currentMerchantAction';
/* Constant Import */
import { BUTTON_PROCEED, CLOSE_BUTTON, MOBILE_REGEX, NAME_REGEX, NO_EMAIL } from '../shared/constants';
/* Style Import */
import commonStyles from '../style/style';
const INVALID_PHONE_NUMBER = 'Enter a valid mobile number';

class AddMerchantDetails extends React.PureComponent {
    constructor(props) {
        super(props);
        this.button = null;
        this.state = {
            phoneNumber: this.props.merchantDetails.phoneNumber || '',
            merchantName: this.props.merchantDetails.merchantName || '',
            businessName: this.props.merchantDetails.businessName || '',
            error:{
                merchantName: '',
                businessName: '',
                phoneNumber: ''
            },
            buttonDisabled: true,
            focus: [false, false, false]
        }
        this.ref = [null, null, null, null];  
        this.handleRef = this.handleRef.bind(this);
        this.handleFocus = this.handleFocus.bind(this);        
        this.submitDetails = this.submitDetails.bind(this)
        this.goBackHandler = this.goBackHandler.bind(this);
        this.onSubmitEditing = this.onSubmitEditing.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.checkMerchantExists = this.checkMerchantExists.bind(this);
        this.handleInputValidation = this.handleInputValidation.bind(this);
        this.handleButtonValidation = this.handleButtonValidation.bind(this);
    }

    componentDidMount(){
        this.handleButtonValidation();
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }
    
    goBackHandler(){
        Keyboard.dismiss();
        let { businessName, merchantName, phoneNumber} = this.state;
        if(this.props.editFlow){
            goToPage('ReviewDetails');
            return true;
        }else if(merchantName !== '' || businessName !== '' || phoneNumber !== ''){
           this.props.openAlertModal();
           return true;
        }else{
            this.props.resetInitValue(false);
            goToPage('MerchantList');
            return true;
        }

    }

    /** Gets fired on click of submit details and 
	 * 	updates the merchant details to the current merchant
	 */
    submitDetails(){
        Keyboard.dismiss();
        if(this.handleButtonValidation()){
            return;
        }
        let merchantDetails = {
            ...this.props.merchantDetails,
            merchantName: this.state.merchantName,
            businessName: this.state.businessName,
            phoneNumber: this.state.phoneNumber,
            email: NO_EMAIL
        }
        this.props.updateCategoryStateProp(0);
        this.props.loadCurrentMerchantDetails(merchantDetails, this.props.categoryDetails);
        goToPage('Category');
    }

    /** Gets fired on input change in all field and
	 * 	Updates the value based on type in state object
     *	@param {String} value
     *  @param {String} type
	 */
    handleValueChange(value, type){
        switch(type){
            case 'Shop Name':
                this.setState({ merchantName: value},()=>{ this.handleButtonValidation()});
                break;
            case 'Business Name':
                this.setState({businessName: value},()=>{ this.handleButtonValidation()});
                break;
            case 'Phone Number':
                this.setState({phoneNumber: value, 
                        error:{
                            merchantName: '',
                            businessName: '',
                            phoneNumber: ''
                        },
                    }, ()=>{ 
                    if(value.length === 10) {
                        this.handleInputValidation('Phone Number');
                    }
                    this.handleButtonValidation()
                });
                break;
            default:
                this.handleButtonValidation();
                break;
        }
    }


    /** Gets fired on submit click of user and
     *  focus user to the next input based on the id value
	 *	@param {String} id
	 */
    onSubmitEditing(id){
        let {focus } = this.state;
        let index = focus.indexOf(true);
        if(index >= 0){
            focus[index] = false;
        }
        if(id+1 <= 2){
            this.ref[id+1].focus();
            focus[id+1] = true;    
        }   
        this.setState({focus});
    }

    /** Gets fired on page load with the input reference
     *	@param {String} id
     *	@param {Event} reference
	 */
    handleRef(id, reference){
        this.ref[id] = reference;
    }

    /** Gets fired on focus of input and
     *  updates the focus value in state object
     *  @param {Number} id
	 */
    handleFocus(id){
        let {focus} = this.state;
        let index = focus.indexOf(true);
        if(index >= 0 && index !== id){
            focus[index] = false;
            index >= 0 && index <= 2 && this.ref[index].blur();
        }
        focus[id] = true;
        this.setState({focus});   
    }
    
    /** Gets fired on every state input blur or dropdown selection
	 * 	Updates the button state based on validation
     */
    handleInputValidation(type = ''){
        let { businessName, merchantName, phoneNumber, error} = this.state;
        
        switch(type){
            case 'Shop Name':
                if(merchantName !== ''){
                    error['merchantName'] = '';
                }else{
                    error['merchantName'] = 'Enter Shop Name';
                }
                break;
            case 'Business Name':
                if(businessName !== ''){
                    error['businessName'] = '';
                }else{
                    error['businessName'] = 'Enter Business Name';
                }
                break;
            case 'Phone Number':
                if(!MOBILE_REGEX.test(phoneNumber)){ 
                    error['phoneNumber']='Enter a valid phone number';
                } else {
                    error['phoneNumber'] = '';
                }
                break;
            default:
                this.handleButtonValidation();
                break;
        }
        this.setState({error: {...error}});
    };

    /** Gets fired on every state input value change or dropdown selection
	 * 	Updates the button state based on validation
     */
    handleButtonValidation(){
       
       let { businessName, merchantName, phoneNumber, buttonDisabled, error} = this.state;
       if(businessName && 
            merchantName &&
            MOBILE_REGEX.test(phoneNumber) &&
            (error.phoneNumber !== INVALID_PHONE_NUMBER)
        ){
            buttonDisabled ? this.setState({buttonDisabled: false}) : null;
            return false;
        }else{
            !buttonDisabled ? this.setState({buttonDisabled : true}): null;
            return true;
        }
    }

    /** Gets fired on every valid phone number submit or blur
     */
    checkMerchantExists(){
        Keyboard.dismiss();
        let {phoneNumber} = this.state;
        if(this.handleButtonValidation()){
            return;
        }
        this.props.checkMerchantExists.call(this, phoneNumber);
    }

    render(){
        return (
            <Container style={commonStyles.contentBackground}>
                <Header main="no" headerName="Add New Merchant"  goBack={this.goBackHandler} close={this.goBackHandler}
                    timerStart={this.props.timerStart}
                />
                {/* { this.props.timerStart && <Timer/>} */}
                <View>
                     <Input 
                        id={0}
                        keyType="next" 
                        type="default" 
                        regex={NAME_REGEX}
                        fieldName="Shop Name"
                        handleRef={this.handleRef}
                        onFocus={this.handleFocus}
                        focus={this.state.focus[0]}
                        value={this.state.merchantName}
                        onSubmit={this.onSubmitEditing}
                        onBlur={this.handleInputValidation}
                        error={this.state.error.merchantName}
                        handleChange={this.handleValueChange}    
                    />
                    <Input 
                        id={1}
                        keyType="next"
                        type="default" 
                        regex={NAME_REGEX}
                        fieldName="Business Name" 
                        handleRef={this.handleRef}
                        onFocus={this.handleFocus}
                        focus={this.state.focus[1]}
                        value={this.state.businessName}
                        onSubmit={this.onSubmitEditing}
                        onBlur={this.handleInputValidation}
                        error={this.state.error.businessName}
                        handleChange={this.handleValueChange}
                    />
                    <Input 
                        id={2}
                        keyType="done"
                        type="numeric" 
                        maxLength={10} 
                        regex={/[^\d]/gi}
                        fieldName="Phone Number"
                        handleRef={this.handleRef} 
                        onFocus={this.handleFocus}
                        focus={this.state.focus[2]}
                        editable={this.props.editFlow}
                        value={this.state.phoneNumber}
                        onSubmit={this.onSubmitEditing}
                        onBlur={this.handleInputValidation}
                        error={this.state.error.phoneNumber}
                        handleChange={this.handleValueChange}
                    />
                </View>
                <Button
                    complete={false}
                    submit={this.props.editFlow ? this.submitDetails : this.checkMerchantExists}
                    buttonDisabled={this.state.buttonDisabled}
                    loading={this.props.ajaxStatus.state === 'inprogress'} 
                >
                    {BUTTON_PROCEED}
                </Button>
                {this.props.openAlert &&
                    <AlertModal 
                        button2Text={"EXIT"}
                        button1Text={"CANCEL"}
                        text={CLOSE_BUTTON.TEXT}
                        header={CLOSE_BUTTON.HEADER}
                        displayCloseButton={false}
                        button1Function={this.props.closeAlertModal}
                        button2Function={()=>{
                            this.props.closeAlertModal();
                            this.props.resetInitValue(false)
                            goToPage('MerchantList')
                        }}
                    />
                }
            </Container>        
        );
    } 
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        ajaxStatus: state.ajaxStatus,
        openAlert:  state.modal.openAlert,
        timerStart: state.timerDetails.timerStart,
        editFlow: state.currentMerchantDetails.editFlow,
        merchantId: state.currentMerchantDetails.merchantId,
        merchantDetails: state.currentMerchantDetails.merchantDetails,
        categoryDetails: state.currentMerchantDetails.categoryDetails
	};
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = { 
    openAlertModal,
    resetInitValue,
    closeAlertModal,
    checkMerchantExists,
    updateCategoryStateProp,
    loadCurrentMerchantDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMerchantDetails);