/* Library Imports */
import React from "react";
import { Icon } from 'native-base';
import { Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
/* Constant Import */
import { BACKGROUND_WHITE_COLOR, BORDER_COLOR, ERROR_COLOR, FONT_FAMILY, LABEL_COLOR, PRIMARY_COLOR, TEXT_COLOR, UNDERLINE_COLOR } from '../../shared/colors';

export default class DropDown extends React.PureComponent {
    constructor(props) {
        super(props);
        this.renderAddressItem = this.renderAddressItem.bind(this);
        this.renderMerchantItem = this.renderMerchantItem.bind(this);
    }

    /** Gets fired on every state/city/locality props changes and
	 * 	renders the item
     */
    renderAddressItem = (item, index) => {
        return(
            <View key={item+index} onStartShouldSetResponder={(event)=>{return true;}}>
                <TouchableHighlight  
                    delayLongPress={4000}                            
                    underlayColor={'rgba(189,189,189,0.14)'} 
                    onPress={() => {
                        this.props.fScroll.setNativeProps({ scrollEnabled: true })
                        this.props.handleChange(item)
                    }}>
                    <Text style={this.props.currentValue === item ? styles.itemFocus : styles.item }>{item}</Text>
                </TouchableHighlight>
            </View>
        );
    }

    /** Gets fired on every super/sub/category props changes and
	 * 	renders the item
     */
    renderMerchantItem = (item, index) => {
        return(
            <View key={item.categoryNodeId+index} onStartShouldSetResponder={(event)=>{return true;}}>
                <TouchableHighlight  
                    delayLongPress={4000}
                    underlayColor={'rgba(189,189,189,0.14)'} 
                    onPress={() => {
                        this.props.fScroll.setNativeProps({ scrollEnabled: true })
                        this.props.handleChange(item.value, index, this.props.dropdownItemList)
                    }}>
                    <Text style={this.props.currentItemValue === item.value ? styles.itemFocus : styles.item }>{item.value}</Text>
                </TouchableHighlight>
            </View>
        );
    }

    render(){
        const { id, focus, fieldName, error, currentValue, currentItemValue, handleFocus, _panResponder, fScroll, dropdownItemList, renderType } = this.props;
        return ( 
            <React.Fragment>
                <View style={styles.inputItem}>
                    <Text style={ focus ? styles.labelTextFocus: styles.labelText }>{fieldName}</Text>    
                    <TouchableHighlight 
                        delayLongPress={4000}
                        underlayColor={BORDER_COLOR} 
                        onPress={()=> handleFocus(id, null)} 
                        disabled={dropdownItemList.length === 0}
                        style={focus ? styles.inputFocus : styles.input}>
                        <React.Fragment>
                            <Text style={currentValue ? [styles.buttonTextFocus] : [styles.buttonText]}>
                                {currentItemValue}
                            </Text>
                            <Icon 
                                android={focus ?  'md-arrow-dropup' : 'md-arrow-dropdown'} 
                                ios={focus ?  'md-arrow-dropup' : 'md-arrow-dropdown'}
                                style={{fontSize: responsiveFontSize(3), color: focus ? PRIMARY_COLOR : BORDER_COLOR, marginRight: responsiveWidth(2)}}/>
                        </React.Fragment>
                    </TouchableHighlight>
                    {error.length > 0 && <Text style={styles.error}>{error}</Text>}
                </View>
                {focus &&  dropdownItemList.length > 0 &&
                    <View style={styles.pickerStyle}>
                        <ScrollView 
                            {..._panResponder.panHandlers}
                            keyboardShouldPersistTaps={"always"} 
                            onScrollEndDrag={() => fScroll.setNativeProps({ scrollEnabled: true })} >
                                {
                                    dropdownItemList.map((item,index)=> {
                                        return renderType === 'Merchant' 
                                            ? this.renderMerchantItem(item, index)
                                            : this.renderAddressItem(item, index)
                                    })
                                }        
                        </ScrollView>
                    </View>
                }
            </React.Fragment>
        );
    } 
}

const styles = StyleSheet.create({
    inputItem:{
        marginTop: 21
    },
    pickerStyle:{
        borderColor: PRIMARY_COLOR,
        flex: 1,
        borderWidth: 2, 
        marginTop: responsiveHeight(1), 
        width: responsiveWidth(80),
        marginLeft: responsiveWidth(10),
        maxHeight: responsiveHeight(25),
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 1.0)',
                shadowOpacity: 0.54,
                shadowOffset: { width: 0, height: 2 },
            },
            android: {
                elevation: 2,
            },
        }),
    },
    labelText:{
        fontSize: 14,
        marginBottom: 8,
        color: LABEL_COLOR,
        fontFamily: FONT_FAMILY,
        marginHorizontal: responsiveWidth(10)
    },
    labelTextFocus:{
        fontSize: 14,
        marginBottom: 8,
        color: PRIMARY_COLOR,
        fontFamily: FONT_FAMILY,
        marginHorizontal: responsiveWidth(10),
    },
    buttonText:{
        fontSize: 16, 
        marginBottom: 0,
        color: LABEL_COLOR,
        fontFamily: FONT_FAMILY
    },
    buttonTextFocus:{
        fontSize: 16, 
        marginBottom: 0,
        color: TEXT_COLOR,
        fontFamily: FONT_FAMILY        
    },
    error:{
        fontSize: 12,
        color: ERROR_COLOR,
        fontFamily: FONT_FAMILY,
        marginBottom: responsiveHeight(1),
        marginHorizontal: responsiveWidth(10)
    },
    input:{
        height: 40,
        borderWidth: 1,
        display: 'flex',
        borderRadius: 2,
        paddingLeft: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: BORDER_COLOR,
        width: responsiveWidth(80),
        justifyContent: 'space-between',
        marginHorizontal: responsiveWidth(10)
        
    },
    inputFocus:{
        height: 40,
        borderWidth: 1,
        display: 'flex',
        borderRadius: 2,
        paddingLeft: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: PRIMARY_COLOR,
        width: responsiveWidth(80),
        justifyContent: 'space-between',
        marginHorizontal: responsiveWidth(10)
    },
    item:{
        height: 52,
        fontSize: 14,
        paddingTop: 16,
        paddingLeft: 16,
        paddingBottom: 5,
        color: TEXT_COLOR,
        borderBottomWidth: 1,
        fontFamily: FONT_FAMILY, 
        borderBottomColor: UNDERLINE_COLOR,
        backgroundColor: BACKGROUND_WHITE_COLOR
    },
    itemFocus:{
        height: 52,
        fontSize: 14,
        paddingTop: 16,
        paddingLeft: 16,
        paddingBottom: 8,
        color: TEXT_COLOR,
        borderBottomWidth: 1,
        fontFamily: FONT_FAMILY, 
        backgroundColor: 'rgba(103, 58, 183, 0.2)',
        borderBottomColor: UNDERLINE_COLOR
    }
});