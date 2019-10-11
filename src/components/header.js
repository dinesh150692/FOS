/* Library Imports */
import React from "react";
import { Icon } from 'native-base';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
/* Constant Imports  */
import { CLEAR_ICON_COLOR, CLOSE_ICON_COLOR, FONT_FAMILY, HEADER_TEXT_COLOR, MEDIUM_FONT, PRIMARY_COLOR, REGULAR_FONT, STATUS_BAR_COLOR, TEXT_COLOR } from '../shared/colors';

export default class Header extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    
    _renderMainHeader(){
        return (
            <View style={styles.headerItem}>
                <Text style={styles.headerTitle}>{this.props.headerName}</Text>
                <TouchableOpacity 
                    delayLongPress={4000} 
                    activeOpacity={0.14} 
                    onPress={this.props.onSearchClick}
                    hitSlop={{top: 10, bottom: 10, left: 20, right: 10}}
                >
                    <Icon  ios='md-search' android="md-search" style={styles.headerSearch} />
                </TouchableOpacity>
            </View>
		);
    }

    _renderGoBackHeader(){
        return(
           <View style={styles.headerItem}>
                <View style={styles.headerItem1}>
                    <TouchableOpacity
                        delayLongPress={4000}  
                        activeOpacity={0.14} 
                        onPress={this.props.goBack}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 15}}
                    >
                        <Icon name="arrow-back"  style={styles.headergoBack}/>
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, styles.headerTitle1]}>{this.props.headerName}</Text>
                </View> 
                <View>
                    <TouchableOpacity
                        delayLongPress={4000}  
                        activeOpacity={0.14} 
                        onPress={this.props.close}
                        hitSlop={{top: 10, bottom: 10, left: 15, right: 15}}
                    >
                        <Icon ios='md-close' android="md-close" style={styles.closeIcon}/>
                    </TouchableOpacity>
                </View>
           </View>
        );
    }

    render(){
		return (
			<View>
                <StatusBar
                    backgroundColor={STATUS_BAR_COLOR}
                    barStyle="light-content"
                />
                <View style={styles.header}>
                    {this.props.main === 'yes' && this._renderMainHeader()}
				    {this.props.main === 'no' && this._renderGoBackHeader()}
                </View>
                {this.props.timerStart && <View style={styles.timerContainer}/>}
            </View>
		);
	}
}

const styles = StyleSheet.create({
    header: {
        top: 0,
        left: 0,
        height: 56,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: responsiveWidth(100),
        backgroundColor: PRIMARY_COLOR
    },
    headerItem:{
        width: '100%',
        display: 'flex',
        paddingLeft: 15,
        paddingRight: 17,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerItem1:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTitle: {
        fontSize: 20,
        width: responsiveWidth(100) - 80,
	    color: HEADER_TEXT_COLOR,
        fontFamily: FONT_FAMILY,
        fontWeight: REGULAR_FONT
    },
    headerTitle1:{
        marginLeft: 20
    },
    headerSearch: {
        fontSize: 20,
        color: HEADER_TEXT_COLOR,
        fontWeight: MEDIUM_FONT,
	    fontFamily: FONT_FAMILY
    },
    headergoBack: {
        fontSize: 20,
        color: HEADER_TEXT_COLOR
    },
    closeIcon:{
        fontSize: 26,
        color: CLOSE_ICON_COLOR
    },
    timerContainer:{
        height: 30,
        width: responsiveWidth(100),
        backgroundColor: 'transparent'
    },
});
