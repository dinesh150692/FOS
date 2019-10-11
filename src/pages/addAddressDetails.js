/* Library Import */
import React from "react";
import { connect } from 'react-redux';
import { Container } from 'native-base';
import { BackHandler, Keyboard, PanResponder, ScrollView } from 'react-native';
/* Component Import */
// import Timer from '../components/timer';
import Header from '../components/header';
import Input from '../components/common/input';
import Button from '../components/common/button';
import DropDown from '../components/common/dropdown';
import { goToPage } from '../components/common/logout';
import AlertModal from '../components/common/alertModal';
import OTPVerification from '../components/otpVerification';
import GPSError from '../components/gpsError';
/* Action Import */
import { sendOTP } from '../redux/action/otpAction';
import { enableLocation } from '../redux/action/locationAction';
import { getPincodeDetails } from '../redux/action/pincodeAction';
import { resetInitValue, startTimer } from '../redux/action/timerAction';
import { createNewMerchant, loadCurrentAddressDetails, updateCurrentMerchantAddressDetails } from '../redux/action/currentMerchantAction';
import { closeAlertModal, closeAllModal, openAlertModal } from '../redux/action/modalAction';
/* Constant Import */
import { ADDRESS_REGEX, BUTTON_PROCEED, BUTTON_SUBMIT_REQUEST_OTP, CLOSE_BUTTON, PINCODE_REGEX } from '../shared/constants';
/* Style Import */
import commonStyles from '../style/style';

class AddAddressDetails extends React.PureComponent {
    constructor(props) {
        super(props);
        this.button = null;
        this.state = {
            error:{
                building: '',
                street: '',
                locality: '',
                city: '',
                state: '',
                pinCode:'',
            },
            buttonText: '',
            smsVerified: false,
            buttonDisabled: true,
            loadingPincode: false,
            cityList: [],
            stateList: [],
            localityList: [],
            city: this.props.addressDetails.city || '',
            state: this.props.addressDetails.state || '',
            street: this.props.addressDetails.street || '',
            pinCode: this.props.addressDetails.pinCode || '',
            locality: this.props.addressDetails.locality || '',
            building: this.props.addressDetails.building || '',
            focus: [false, false, false, false, false, false]
        }
        this.ref = [null, null, null];
        this.sendOTP = this.sendOTP.bind(this);
        this.handleRef = this.handleRef.bind(this);
        this.buttonText = this.buttonText.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.closeHandler = this.closeHandler.bind(this);
        this.goBackHandler = this.goBackHandler.bind(this);
        this.submitEditing = this.submitEditing.bind(this);
        this.submitDetails = this.submitDetails.bind(this);
        this.getStateDetails = this.getStateDetails.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.updateSMSVerified = this.updateSMSVerified.bind(this);
        this.handleLocalityChange = this.handleLocalityChange.bind(this);
        this.handleInputValidation = this.handleInputValidation.bind(this);
        this.handleButtonValidation = this.handleButtonValidation.bind(this);
    }

    componentDidMount(){
        this.buttonText();
        this.props.enableLocation();
        if(!this.props.editFlow){
            this.handleButtonValidation();
        }
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: (evt,gestureState) => {
                return Math.abs(gestureState.dy) > 2 ;  // can adjust this num
            },
            onPanResponderGrant: (e, gestureState) => {
                this.fScroll.setNativeProps({ scrollEnabled: false })
            },
            onPanResponderMove: () => { },
            onPanResponderTerminationRequest: () => true,
        });
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
    }  

    componentWillUnmount(){
        this.props.closeAllModal();
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }

    goBackHandler(){
        Keyboard.dismiss();
        if(!this.props.editFlow){
            let addressDetails = {
                building: this.state.building,
                locality: this.state.locality,
                street: this.state.street,
                city: this.state.city,
                state: this.state.state,
                pinCode: this.state.pinCode
            }
            this.props.loadCurrentAddressDetails(addressDetails);
            goToPage('Category');
        }else{

            goToPage('AddAddress');
        }
        return true;
    }

    closeHandler(){
        let { building, state, pinCode, street } = this.state;
        
        if(building !== '' || state !== '' || pinCode !== '' || street !== '' ){
            this.props.openAlertModal();
        }else{
            this.props.resetInitValue(false);
            return goToPage('MerchantList');
        }
    }


    /** Updates the button based on the state otp verified or
	 *  request otp
	 */
    buttonText(){
        if(this.state.smsVerified){
            this.setState({buttonText: BUTTON_PROCEED}, () => {
            //Automatically calling the submit button
            this.submitDetails();
            });
        }else if(this.props.editFlow || this.props.timerStart){
            this.setState({buttonText: BUTTON_PROCEED});
        }else{
            this.setState({ buttonText: BUTTON_SUBMIT_REQUEST_OTP });
        }
    }

    /** Gets fired on sms verified and 
	 * 	updates state sms Verified
	 */
    updateSMSVerified(){
        this.props.startTimer();
        setTimeout(() => {
            this.setState({smsVerified: true , buttonDisabled: false}, () => {
                this.buttonText();
            });                
        }, 1000);
    }

    /** Gets fired on  click of submit details and 
	 * 	updates the details to the current merchant
	 */
    submitDetails(){
        if(this.handleButtonValidation()){
            return;
        }
        
        //Call the Send otp api incase of sms verified is not true
        if(!this.state.smsVerified && this.state.buttonText === BUTTON_SUBMIT_REQUEST_OTP){
            this.sendOTP();
            return;
        }

        let addressDetails = {
            building: this.state.building,
            locality: this.state.locality,
            street: this.state.street,
            city: this.state.city,
            state: this.state.state,
            pinCode: this.state.pinCode
        };
        
        let details = {
            ...this.props.merchantDetails,
            address: addressDetails,
            latitude: this.props.lat,
            longitude: this.props.long
        };
        // if(details.subCategory == null || details.subCategory == ''){
        //     details.subCategory = 'N/A';
        // }

        if(!this.state.buttonDisabled && this.props.editFlow){
            this.props.updateCurrentMerchantAddressDetails.call(this, addressDetails, this.props.merchantId);
        }else if(!this.state.buttonDisabled){
            this.props.createNewMerchant.call(this, details, addressDetails);
        }

        
    }

    /** Gets fired on new pincode details ia available from api
     * and updates the state list
	 *	@param {Array} details
     */
    getStateDetails(details){
        let stateDetails = {};
        details.map(item =>{
            stateDetails[item.state] = item.state;
        });
        let array  = Object.keys(stateDetails);
        if(array.length > 0){ 
            array.length === 1 
            ?   this.setState({stateList: [...array]},() => this.handleStateChange(array[0]))
            :   this.setState({ stateList: [...array], state: '', city: '', locality: '' });
        }else{
            this.setState({ stateList: [], state: '', city: '', locality: ''});
        }
    }

     /** Gets fired on input change in all field and
	 * 	Updates the value based on type in state object
     *	@param {String} value
     *  @param {String} type
	 */
    handleValueChange(value, type){
        switch(type){
            case 'Building':
            this.setState({ building: value});
                break;
            case 'Street':
                this.setState({street: value});
                break;
            case 'Pincode':
                this.setState({pinCode: value}); 
                if(PINCODE_REGEX.test(value)){                        
                    let { focus } = this.state;
                    focus[2] = false;
                    this.setState({focus});
                    this.ref[2].blur();
                }                   
                break;
            default:
                break;
        }
    }

    /** Gets fired on submit click of user and
     *  focus user to the next input based on the id value
	 *	@param {String} id
	 */
    submitEditing(id){
        let {focus } = this.state;
        let index = focus.indexOf(true);
        if(index >= 0){
            focus[index] = false;
        }

        if(id + 1 < this.ref.length){
            focus[id+1] = true;
            this.ref[id+1].focus();
        }else if(id === 2){
            this.ref[2].blur();
        }
        this.setState({focus: [...focus]});
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
	 */
    handleFocus(id){
        let {focus } = this.state;
        let index = focus.indexOf(true);     
        if(index >= 0 && index !== id){
            focus[index] = false;
            index >= 0 && index <= 2 && this.ref[index].blur();
        }
        focus[id] = true;
        this.setState({focus: [...focus]});
    }

    /** Gets fired on input on state field and
	 * 	Updates the state value or error in state object
     *	@param {String} value
	 */
    handleStateChange(value){
        let { error, focus } = this.state;
        
        focus[3] = false;
        if(value){
            error['state'] = ''
            let cityList = this.props.pincodeDetails.list.map(item => {
                if(item.state === value && item.district){
                    return item.district;
                }
            });
            cityList = Array.from(new Set(cityList));
            cityList = cityList.filter(item => item !== undefined);
            if(cityList && cityList.length === 1){
                this.setState({cityList: [...cityList]}, () => {this.handleCityChange(cityList[0])});
            }else{
                this.setState({cityList: [...cityList]});
            }
        }else{
            error['state']='Select a valid state';
        }
        this.setState({
            city: '',
            focus: [...focus],
            state: value,
            locality: '', 
            error: {...error}
        },() =>{
            this.handleInputValidation();
        });
    }

    /** Gets fired on input on city field and
	 * 	Updates the city value or error in state object
     *	@param {String} value
 	 */
    handleCityChange(value){
        let { error, focus } = this.state;
        
        focus[4] = false;
        if(value){
            error['city'] = ''
            let localityList = this.props.pincodeDetails.list.map((item) => {
                if(item.district === value && item.locality){
                    return item.locality;
                }
            });
            localityList = Array.from(new Set(localityList));
            localityList = localityList.filter(item => item !== undefined)
            if(localityList && localityList.length === 1){
                this.setState({localityList: [...localityList]},() => {this.handleLocalityChange(localityList[0])});
            }else{
                this.setState({localityList: [...localityList]});
            }
        }else{
            error['city']='Select a valid city';
        }
        this.setState({
            city: value,
            focus: [...focus],
            locality: '', 
            error: {...error}
        },() =>{
            this.handleInputValidation();
        });
    }

    /** Gets fired on input on locality field and
	 * 	Updates the locality value or error in state object
     *	@param {String} value
 	 */
    handleLocalityChange(value){
        let { error, focus } = this.state;
        // console.log('city value', value);
        focus[5] = false;
        if(value){
            error['locality'] = ''
        }else{
            error['locality']='Select a valid city';
        }
        this.setState({
            locality: value,
            focus: [...focus],
            error: {...error}
        },() =>{
            this.handleInputValidation();
        });
    }
 
     /** Gets fired on every state input blur
	 * 	Updates the button state based on validation
     */
    handleInputValidation(type = ''){
        let { building, pinCode, street, error } = this.state;
        
        switch(type){
            case 'Building':
                if(building !== ''){
                    error['building'] = '';
                }else{
                    error['building'] = 'Enter Building Name/Number';
                }
                break;
            case 'Street':
                if(street !== ''){
                    error['street'] = '';
                }else{
                    error['street'] = 'Enter street name';
                }
                break;
            case 'Pincode':
                if(PINCODE_REGEX.test(pinCode)){
                    error['pinCode'] = '';
                    this.setState({loadingPincode: true});
                    this.fScroll.scrollToEnd({animated: true});
                    this.props.getPincodeDetails.call(this, pinCode);
                }else{
                    error['pinCode'] = 'Enter a valid pincode';
                }
                break;
            default:
                this.handleButtonValidation();
                break;
        }
        this.setState({error: error}, () => {
            this.handleButtonValidation()
        });       
    }

    handleButtonValidation(){
        let { building, state, city, pinCode, locality, street } = this.state;
        let {lat, long } = this.props;
        if(building && 
            lat && 
            long && 
            state && 
            city && 
            pinCode && 
            locality && 
            street)
        {
            this.setState({buttonDisabled : false});
            return false;
        }else{
            if(!this.state.buttonDisabled){
                this.setState({buttonDisabled: true});
                return true;
            }
        }
    }
  
    /** 
     *  Close the send otp api and on success reponse close the modal and
     *  open the otp verification
     *  for further action
     */
    sendOTP(){
        this.props.sendOTP.call(this, {phoneNumber: this.props.merchantDetails.phoneNumber});
    }

    render(){
        return ( 
            <Container style={commonStyles.contentBackground}>
                <Header main="no" headerName="Add Address"  goBack={this.goBackHandler} close={this.closeHandler}
                    timerStart={this.props.timerStart}
                />
                <ScrollView ref={(e) => { this.fScroll = e }}  style={{flex:1}} 
                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                        if(this.state.focus[3] || this.state.focus[4] || this.state.focus[5]) {
                            this.fScroll.scrollToEnd({animated: true})
                        }
                    }}
                    keyboardShouldPersistTaps={"always"} 
                    contentContainerStyle={{flexGrow:2, paddingBottom: 70}}
                >
                    <Input 
                        id={0}
                        keyType="next"
                        type="default" 
                        fieldName="Building" 
                        regex={ADDRESS_REGEX}
                        handleRef={this.handleRef}
                        onFocus={this.handleFocus}
                        focus={this.state.focus[0]}
                        value={this.state.building}
                        onSubmit={this.submitEditing}
                        error={this.state.error.building}
                        onBlur={this.handleInputValidation}
                        handleChange={this.handleValueChange}  
                    />
                    <Input 
                        id={1}
                        fieldName="Street"
                        keyType="next" 
                        type="default" 
                        regex={ADDRESS_REGEX}
                        value={this.state.street}
                        handleRef={this.handleRef}
                        onFocus={this.handleFocus}
                        focus={this.state.focus[1]}
                        onSubmit={this.submitEditing}
                        error={this.state.error.street}
                        onBlur={this.handleInputValidation}
                        handleChange={this.handleValueChange}
                    />
                    <Input 
                        id={2}
                        fieldName="Pincode" 
                        keyType="done"
                        type="numeric" 
                        maxLength={6}
                        regex={/[^\d]/gi}
                        handleRef={this.handleRef}
                        value={this.state.pinCode}
                        onFocus={this.handleFocus}
                        focus={this.state.focus[2]}
                        onSubmit={this.submitEditing}
                        error={this.state.error.pinCode}
                        onBlur={this.handleInputValidation}
                        handleChange={this.handleValueChange}
                    />
                    <DropDown
                        id={3}
                        fieldName={'State'}
                        renderType={'Address'}
                        fScroll={this.fScroll}
                        focus={this.state.focus[3]}
                        currentValue={this.state.state}
                        error={this.state.error.state }
                        handleFocus={this.handleFocus}
                        _panResponder={this._panResponder}
                        handleChange={this.handleStateChange}
                        dropdownItemList={this.state.stateList}
                        currentItemValue={this.state.state.length > 0 
                            ? this.state.state 
                            : 'Select State...'
                        }
                    />
                    <DropDown
                        id={4}
                        fieldName={'City'}
                        renderType={'Address'}
                        fScroll={this.fScroll}
                        focus={this.state.focus[4]}
                        currentValue={this.state.city}
                        error={this.state.error.city }
                        handleFocus={this.handleFocus}
                        _panResponder={this._panResponder}
                        handleChange={this.handleCityChange}
                        dropdownItemList={this.state.cityList}
                        currentItemValue={this.state.city.length > 0 
                            ? this.state.city 
                            : 'Select City...'
                        }    
                    />
                    <DropDown
                        id={5}
                        fieldName={'Locality'}
                        renderType={'Address'}
                        fScroll={this.fScroll}
                        focus={this.state.focus[5]}
                        currentValue={this.state.locality}
                        error={this.state.error.locality }
                        handleFocus={this.handleFocus}
                        _panResponder={this._panResponder}
                        handleChange={this.handleLocalityChange}
                        dropdownItemList={this.state.localityList}
                        currentItemValue={this.state.locality.length > 0 
                            ? this.state.locality 
                            : 'Select Locality...'
                        }
                    />               
                </ScrollView>
                <Button
                    complete={false}
                    submit={this.submitDetails}
                    buttonDisabled={this.state.buttonDisabled}
                    loading={
                        !this.props.openOTP && this.props.ajaxStatus.state === 'inprogress' 
                        || this.state.loadingPincode 
                        || this.props.editFlow && this.props.ajaxStatus.state === 'inprogress'
                    }
                >
                    {this.state.buttonText}
                </Button>
                {this.props.openAlert && 
                    <AlertModal 
                        button2Text={"EXIT"}
                        button1Text={"CANCEL"}
                        text={CLOSE_BUTTON.TEXT}
                        displayCloseButton={false}
                        header={CLOSE_BUTTON.HEADER}
                        button1Function={this.props.closeAlertModal}
                        button2Function={()=>{
                            this.props.closeAlertModal();
                            this.props.resetInitValue(false);
                            return goToPage('MerchantList');
                        }}
                    />
                }
                {this.props.openOTP && !this.props.openSessionExpired &&
                    <OTPVerification
                        onSuccess={this.updateSMSVerified}
                    />
                }
                 {this.props.openGPS &&<GPSError enableLocation={this.props.enableLocation}/>}
            </Container>
        );
    } 
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        lat: state.location.lat,
        long: state.location.long,
        ajaxStatus: state.ajaxStatus,
        openGPS: state.modal.openGPS,
        openOTP: state.modal.openOTP,
        openAlert: state.modal.openAlert,
        pincodeDetails: state.pincodeDetails,
        timerStart: state.timerDetails.timerStart,
        editFlow: state.currentMerchantDetails.editFlow,
        merchantId: state.currentMerchantDetails.merchantId,
        openSessionExpired: state.modal.openSessionExpired,
        addressDetails: state.currentMerchantDetails.addressDetails,
        merchantDetails: state.currentMerchantDetails.merchantDetails       
    };
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = { 
    sendOTP,
    startTimer,
    closeAllModal,
    enableLocation,
    resetInitValue,
    openAlertModal,
    closeAlertModal,
    createNewMerchant, 
    getPincodeDetails,  
    loadCurrentAddressDetails, 
    updateCurrentMerchantAddressDetails
};

export default connect(mapStateToProps,mapDispatchToProps)(AddAddressDetails);

