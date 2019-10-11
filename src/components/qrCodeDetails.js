/* Library Imports */
import React from "react";
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
/* Component Import */
import AddNotification from './addNotification';
/* Custom Action Import */
import { addNotification, removeNotification } from '../redux/action/notificationAction';
import { closeAllModal, openAddNotificationModal, openCameraModal } from '../redux/action/modalAction';
/* Constants Import */
import { QRCODE } from '../shared/constants';
import { BACKGROUND_WHITE_COLOR, FONT_FAMILY, MEDIUM_FONT, PRIMARY_COLOR, TEXT_COLOR, UNDERLINE_COLOR, WARM_GREY_COLOR } from '../shared/colors';
/* Custom Logo Import */
import qrImage from '../assets/qr.png';
import addNew from '../assets/add_button.png';
import deleteImage from '../assets/delete.png';
class QRCodeDetails extends React.PureComponent {
	constructor(props){
        super(props);
        this.state = {
            loading: false,
            itemClicked: '',
            notificationList: [],
            openNotification: false
        }
        this.addNewItem = this.addNewItem.bind(this);
        this.updateNumber = this.updateNumber.bind(this);
        this.deleteNumber = this.deleteNumber.bind(this);
        this.getData = this.getData.bind(this);
    }
    

    /** Gets the mobile and return the headers and data
	 *  @param {String} mobile
     *  @param {String} id
     *  @return {Array} 
     */
    getData(mobile, id){
        let data = {
            "mode": "SMS",
            "phoneNumber": mobile              
        }
        if(id){
            data["id"] = id;
        }
        return data;
    }

    /** Gets fired on click of update number to  notification list
	 * 	and update it to the reducer
     *  @param {String} mobile
     */
    updateNumber(mobile){
        let { qrCode } = this.props;
        this.setState({loading: true});
        let item = this.getData(mobile, null);
        //call API to save the notification, on success update the list
        this.props.addNotification.call(this, QRCODE, item, qrCode);
    }

    /** Gets fired on click of delete notification
	 * 	and update it to the reducer
     *  @param {Number} index
     *  @param {Number} itemIndex
     */
    deleteNumber(index, itemIndex){
        let {qrCode} = this.props;
        let notificationList = qrCode[index].notificationList;
        qrCode[index].notificationList = notificationList;
        let item = this.getData(notificationList[itemIndex].phoneNumber, notificationList[itemIndex].id);
        //call API to remove the notification, on success update the list
        this.props.removeNotification.call(this, QRCODE, item, qrCode, index, itemIndex, notificationList);
    }

    /** Gets fired on click of adding new notification and
	 * 	updates item clicked to state and opens the notification modal
     *  @param {String} index
     */
    addNewItem(index){
        let notificationList = [];
        if(this.props.qrCode[index].hasOwnProperty('notificationList')){
            notificationList = this.props.qrCode[index].notificationList;
        }
        this.setState({itemClicked: Number(index), openNotification: true, notificationList: notificationList});
        this.props.openAddNotificationModal();
    }

    /** Gets fired on clicking close in the notification modal
	 */
    openCloseNotification(){
        this.setState({ openNotification: !this.state.openNotification});
    }

    render() {
        return (
            <View>
                { this.props.qrCode && this.props.qrCode.length > 0  && this.props.qrCode.map((item, index) => {
                    return (
                        <View key={item.name+index} style={styles.qrPosContainer}>
                            <Image source={qrImage} resizeMode={'contain'} style={styles.qrPosImage}/>
                            <View style={styles.qrPosContentContainer}>
                                <View style={styles.qrPosHeaderContainer}>
                                    <Text style={styles.qrPosHeader}>{item.name}</Text>
                                    <TouchableOpacity
                                        delayLongPress={4000}  
                                        activeOpacity={0.14}
                                        onPress={() => {this.addNewItem(index)}}
                                    >
                                        <Icon 
                                            android="md-person-add" ios="md-person-add" 
                                            style={{fontSize: 25, color: 'rgba(103, 58, 183, 0.72)'}}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.notificationSentTo}>Notification sent to</Text>
                                <View>
                                    {item.notificationList.length > 0 && item.notificationList.map((list, itemIndex) => {
                                        return ( 
                                            list.enabled &&
                                            <View key={list.id} style={styles.notificationItem}>
                                                <Text style={styles.phoneNumber}>{list.phoneNumber}</Text>
                                                <TouchableOpacity delayLongPress={4000} activeOpacity={0.14} onPress={() => {this.deleteNumber(index,itemIndex)}}>
                                                    <Image source={deleteImage} resizeMode={'contain'} style={styles.addAnotherImage} />    
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        </View>  
                    ) 

                })}
                <TouchableOpacity 
                    delayLongPress={4000} 
                    activeOpacity={0.14} 
                    style={styles.addAnother} 
                    onPress={this.props.openCameraModal}
                    disabled={this.props.ajaxStatus.state === 'inprogress'}
                >
                    <Image style={styles.addAnotherImage} resizeMode={'contain'}  source={addNew}/>
                    <Text style={styles.addAnotherText}>{this.props.qrCode.length === 0 ? 'ADD NEW QR CODE' : 'ADD ANOTHER QR CODE'}</Text>
                </TouchableOpacity>
                {this.props.openAddNotification && this.state.openNotification &&
                    <AddNotification 
                        loading={this.state.loading}
                        updateNumber={this.updateNumber}
                        notificationList={this.state.notificationList}
                    />
                }
            </View>
        );
	}
}

/** 
 *  Mapping the state to desired props for the component
 */
function mapStateToProps(state, ownProps) {
    return {
        ajaxStatus: state.ajaxStatus,
        qrCode: state.currentMerchantDeviceDetails.qrCode,
        merchantId: state.currentMerchantDetails.merchantId,
        openAddNotification: state.modal.openAddNotification
    };
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = {
    closeAllModal,
    openCameraModal, 
    addNotification, 
    removeNotification, 
    openAddNotificationModal
};

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeDetails);

const styles = StyleSheet.create({
    notificationItem: {
        paddingTop: 11,
        display: 'flex',
        paddingBottom: 9,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        width: responsiveWidth(87),
        justifyContent: 'space-between',
        paddingRight: responsiveWidth(5),
        borderBottomColor: UNDERLINE_COLOR
    },
    phoneNumber:{
        fontSize: 14,
        color: TEXT_COLOR,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY
    },
    qrPosContainer:{
        marginTop: 8,
        paddingTop: 20,
        paddingBottom: 4,
        paddingLeft:17,
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: responsiveWidth(100),
        justifyContent: 'flex-start',
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    qrPosImage:{
        width: 18, 
        height: 18,
        marginTop: 3
    },
    qrPosContentContainer:{
        marginLeft: 9,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    qrPosHeaderContainer:{
        display: 'flex',
        marginRight: 17,
        marginBottom: 13,
        alignItems: 'center',
        flexDirection: 'row',
        width: responsiveWidth(85),
        justifyContent: 'space-between'
    },
    qrPosHeader:{
        fontSize: 16,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT
    },
    editIcon:{
        fontSize: 17.6,
        paddingLeft: 5,
        color: 'rgba(108, 58, 183, 0.3)'
    },
    notificationSentTo:{
        fontSize: 12,
        textAlign: 'left',
        color: WARM_GREY_COLOR,
        fontFamily: FONT_FAMILY
    },
    addAnother:{
        marginTop: 21,
        marginLeft: 17,
        display: 'flex',
        marginBottom: 21,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    addAnotherImage:{
        width: 22,
        height: 22
    },
    addAnotherText:{
        fontSize: 14,
        marginLeft: 10,
        color: PRIMARY_COLOR,
        fontWeight: MEDIUM_FONT,
        fontFamily: FONT_FAMILY
    }
});
