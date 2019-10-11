
// /* Library Imports */
// import React from 'react';
// import { connect } from 'react-redux';
// import { Spinner } from 'native-base';
// import { CachedImage } from 'react-native-cached-image';
// import { Image, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
// import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
// /* Component Imports */
// import Header from '../components/header';
// import Button from '../components/common/button';
// /* Action Imports */
// import { getBankList } from '../redux/action/bankListAction';
// import { closeAllModal, closeSupportedBanksModal } from '../redux/action/modalAction';
// /* Constant Import */
// import { BANK_IMAGE_URL, NO_SUPPORTED_BANKS, RETRY_AGAIN, SERVER_ERROR } from '../shared/constants';
// import { BACKGROUND_COLOR, BORDER_COLOR, FONT_FAMILY, MEDIUM_FONT, PRIMARY_COLOR, REGULAR_FONT, TEXT_COLOR, WARM_GREY_COLOR } from '../shared/colors';
// /* Image Import */
// import noBank from '../assets/no_banks.png';

// class SupportedBanks extends React.PureComponent {
// 	constructor(props){
//         super(props);
//         this.state = {
//             error: ''
//         }
//         this.getBankList = this.getBankList.bind(this);
//         this._renderError = this._renderError.bind(this);
//     }
    
//     componentDidMount(){
//         this.getBankList();
//     }

//     /** 
//      * Call get get bank list and apply error to page
//      * incase of error
//      */
//     getBankList(){
//         this.state.error && this.setState({error: ''});
//         this.props.getBankList.call(this, this.props.bankList);
//     }
    
//     renderList = (item) => {
//         return(
//             <View key={item.ifscPrefix} style={styles.bankContent}>
//                 <CachedImage
//                     style={styles.image}
//                     source={{uri: BANK_IMAGE_URL + item.ifscPrefix + '.png'}}
//                 />
//                <View style={styles.bankContainer}>
//                     <Text style={styles.bankTextHeader}>{item.ifscPrefix}</Text>
//                     <Text style={styles.bankText}>{item.name}</Text>
//                </View>
//             </View>
//           ); 
//     };

//     renderTopList = (item) => {
//         if(item.topBank){
//             return(
//                 <View key={item.ifscPrefix} style={styles.topBankContent}>
//                     <CachedImage
//                         style={styles.topImage}
//                         resizeMode={"contain"}
//                         source={{uri: BANK_IMAGE_URL + item.ifscPrefix + '.png'}} 
//                     />
//                     <Text style={styles.topBankTextHeader}>{item.ifscPrefix}</Text>
//                     <Text style={styles.topBankText} ellipsizeMode='tail' numberOfLines={1}>{item.name}</Text>
//                 </View>
//             );
//         }else{
//             return null;
//         }

//     };

//     _renderError(){
//         if(this.state.error){
//             return (
//                 <View style={styles.noItemContainer1}>
//                     <View style={styles.noItemContainer}>
//                         <Image source={noBank} resizeMode={'contain'} style={styles.noBankImage}/> 
//                         <Text style={styles.noItemText}>{SERVER_ERROR}</Text>
                        
//                     </View>
//                     <Button
//                         loading={false}    
//                         complete={false}
//                         buttonDisabled={false}
//                         submit={this.getBankList}
//                     >
//                         {RETRY_AGAIN}
//                     </Button>
//                 </View>
//             );
//         }else{
//             return (
//                 <View style={styles.noItemContainer1}>
//                     <View style={styles.noItemContainer}>
//                         <Image source={noBank} resizeMode={'contain'}  style={styles.noBankImage}/> 
//                         <Text style={styles.noItemText}>{NO_SUPPORTED_BANKS}</Text>
//                     </View>
//                     <Button
//                         loading={false}    
//                         complete={false}
//                         buttonDisabled={false}
//                         submit={this.getBankList}
//                     >
//                         {RETRY_AGAIN}
//                     </Button>
//                 </View>
//             );
//         }
//     }

// 	render() {
// 		return (
//             <View>
//                 <Modal   
//                     animationType="fade"
//                     transparent={false}
//                     visible={this.props.openSupportedBanks}
//                     onRequestClose={this.props.closeSupportedBanksModal}
//                 >
//                     <View style={{flex:1, width: responsiveWidth(100), height: responsiveHeight(100)}}>
//                         <Header main="no" headerName="Supported Banks"  goBack={this.props.closeSupportedBanksModal} close={this.props.closeSupportedBanksModal}/> 
//                         {this.props.ajaxStatus.state === 'inprogress' 
//                             ?
//                                 <Spinner color={PRIMARY_COLOR} />
//                             :
//                                 <React.Fragment>
//                                     {this.props.bankList && this.props.bankList.length > 0 
//                                         ?
//                                             <ScrollView keyboardShouldPersistTaps={"always"} style={{flex:1, backgroundColor:'white'}}> 
//                                                 <View style={styles.bankHeader}>
//                                                     <Text style={styles.bankHeaderText}>Popular Banks</Text>
//                                                 </View>
//                                                 <View style={styles.topBankContainer}>
//                                                     {this.props.bankList.map(item =>{
//                                                          return this.renderTopList(item);
//                                                     })} 
//                                                 </View>
//                                                 <View style={styles.bankHeader}>
//                                                     <Text style={styles.bankHeaderText}>Other Banks</Text>
//                                                 </View>
//                                                 {this.props.bankList.map(item =>{
//                                                      return this.renderList(item);
//                                                 })} 
//                                             </ScrollView> 
                                    
//                                         :
//                                             this._renderError()
//                                     }
//                                 </React.Fragment>
//                             }
//                     </View>
//                 </Modal>
//             </View>
//         );
// 	}
// }

// /** 
//  *  Mapping the state to desired props for the component
//  */
// function mapStateToProps(state, ownProps) {
//     return {
//         ajaxStatus: state.ajaxStatus,
//         bankList: state.bankList.bankList,
//         initialToken: state.loginDetails.initialToken,
//         openSupportedBanks: state.modal.openSupportedBanks
//     };
// }

// export default connect(mapStateToProps, {
//     getBankList,
//     closeAllModal,
//     closeSupportedBanksModal
// })(SupportedBanks);

// const styles = StyleSheet.create({
//     bankContent:{
//         display: 'flex',
//         paddingTop: 12,
//         paddingLeft: 20,
//         paddingBottom: 11.5,
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderBottomWidth: 1,
//         width: responsiveWidth(100),
//         paddingRight: responsiveWidth(10),
//         borderBottomColor: BACKGROUND_COLOR
//     },
//     image: {
//         width:  32,
//         height: 32,
//     },
//     bankContainer:{
//         display: 'flex',
//         marginLeft: 21,
//         flexDirection: 'column'
//     },
//     bankTextHeader: {
//         flexWrap: 'wrap',
//         color: TEXT_COLOR,
//         fontFamily: FONT_FAMILY,
//         fontWeight: MEDIUM_FONT,
//         fontSize: 16
//     },
//     bankText:{
//         fontSize: 14,
//         flexWrap: 'wrap',
//         color: WARM_GREY_COLOR,
//         fontFamily: FONT_FAMILY,
//         fontWeight: REGULAR_FONT
//     },
//     noItemContainer:{
//         flexGrow: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'flex-start'
//     },
//     noItemContainer1:{
//         flex:1,
//         flexGrow: 1,
//         display: 'flex',
//         alignItems: 'center',
//         flexDirection: 'column',
//         justifyContent: 'flex-start'
//     },
//     noItemText:{
//         textAlign: 'center',
//         color: BORDER_COLOR,
//         fontWeight: MEDIUM_FONT,
//         fontFamily: FONT_FAMILY,
//         fontSize: responsiveFontSize(3),
//         marginHorizontal: responsiveWidth(10)
//     },
//     noBankImage:{
//         width: responsiveWidth(80),
//         height:responsiveHeight(50),
//         marginBottom: responsiveHeight(5)
//     },
//     topBankContainer:{
//         display: 'flex',
//         flexWrap: 'wrap',
//         flexDirection: 'row',   
//         alignItems: 'flex-start',
//         width: responsiveWidth(100)
//     },
//     topBankContent:{
//         height:121,
//         borderWidth: 1,
//         display: 'flex',
//         paddingTop: 27.5,
//         paddingBottom: 17,
//         alignItems: 'center',
//         flexDirection: 'column', 
//         width: responsiveWidth(33.3),
//         borderColor: BACKGROUND_COLOR,   
//         justifyContent: 'space-between'
//     },
//     topImage:{
//         width: 40,
//         height: 40
//     },
//     topBankTextHeader:{
//         fontSize: 14,
//         color: TEXT_COLOR,
//         textAlign: 'center',
//         fontWeight: MEDIUM_FONT,
//         fontFamily: FONT_FAMILY
//     },
//     topBankText:{
//         fontSize: 12,
//         color: '#868e96',
//         textAlign: 'center',
//         width: responsiveWidth(25),
//         fontWeight: REGULAR_FONT,
//         fontFamily: FONT_FAMILY
//     },
//     bankHeader:{
//         height: 44,
//         paddingLeft:17,
//         paddingTop: 16,
//         paddingBottom: 9,
//         backgroundColor: '#f5f5f5',
//         width: responsiveWidth(100)
//     },
//     bankHeaderText:{
//         fontSize: 16,
//         color: TEXT_COLOR,
//         fontWeight: MEDIUM_FONT,
//         fontFamily: FONT_FAMILY
//     }
// });