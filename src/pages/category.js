/* Library Imports */
import React from "react";
import { connect } from 'react-redux';
import { Container } from 'native-base';
import { View, Text, StyleSheet, ScrollView, BackHandler } from 'react-native';
/* Component Imports */
import Header from '../components/header';
import Timer from '../components/timer';
import Button from '../components/common/button';
import CategoryButton from '../components/common/categoryButton';
import { goToPage } from '../components/common/logout';
/* Action Import */
import { getCategory, getSuperCategory, updateCategoryStateProp } from '../redux/action/categoryAction';
import { loadCurrentMerchantDetails,  updateCurrentMerchantDetails } from '../redux/action/currentMerchantAction';
/* Constant Import */
import { TEXT_COLOR, MEDIUM_FONT, FONT_FAMILY } from '../shared/colors';
/* Style Import */
import commonStyles from '../style/style';

class Category extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedSuperCategoryValue: props.categoryDetails.superCategory || '',
            selectedSuperCategoryIndex: props.merchantDetails.superCategory || null,
            selectedCategoryValue: props.categoryDetails.category || '',
            selectedCategoryIndex: props.merchantDetails.category || null,
            selectedSubCategoryValue: props.categoryDetails.subCategory || '',
            selectedSubCategoryIndex: props.merchantDetails.subCategory || null,
        }
        this.updateSuperCategoryIndex = this.updateSuperCategoryIndex.bind(this);
        this.updateCategoryIndex = this.updateCategoryIndex.bind(this);
        this.updateSubCategoryIndex = this.updateSubCategoryIndex.bind(this);

        this.submitSuperCategory = this.submitSuperCategory.bind(this);
        this.submitCategory = this.submitCategory.bind(this);
        this.submitSubCategory = this.submitSubCategory.bind(this);

        this.updateMerchantDetails = this.updateMerchantDetails.bind(this);
        this.goBackHandler = this.goBackHandler.bind(this);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.goBackHandler);
        if(this.props.superCategory.length === 0){
            this.props.getSuperCategory();
        }
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.goBackHandler);
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.categoryState === 2 && nextProps.subCategory.length === 0 ) {
            this.props.updateCategoryStateProp(1);
            let { merchantDetails } = this.updateMerchantDetails(true);
            if(this.props.editFlow){
                this.props.updateCurrentMerchantDetails.call(this, merchantDetails, this.props.merchantId);
            }else{
                goToPage('AddAddress');    
            }
            return false;
        }
        return true;
    }

    goBackHandler(){
        if(this.props.categoryState === 0){
            goToPage('AddMerchant');
        } 
        else if(this.props.categoryState === 1){
            this.props.updateCategoryStateProp(0);
            this.setState({
                selectedCategoryIndex: '',
                selectedCategoryValue: ''
            });
        } 
        else if(this.props.categoryState === 2){
            this.props.updateCategoryStateProp(1);
            this.setState({
                selectedSubCategoryIndex: '',
                selectedSubCategoryValue: ''
            });
        }
        return true;
    }

    updateMerchantDetails(noSubCategory = false){
        let { merchantDetails, categoryDetails } = this.props; 
        merchantDetails.superCategory = this.state.selectedSuperCategoryIndex;
        merchantDetails.category = this.state.selectedCategoryIndex;
        merchantDetails.subCategory = noSubCategory ? null : this.state.selectedSubCategoryIndex ? this.state.selectedSubCategoryIndex : null;

        categoryDetails.superCategory = this.state.selectedSuperCategoryValue;
        categoryDetails.category = this.state.selectedCategoryValue;
        categoryDetails.subCategory = this.state.selectedSubCategoryValue || 'N/A';
        if(!this.props.editFlow){
            this.props.loadCurrentMerchantDetails(merchantDetails, categoryDetails);
        }
        return {merchantDetails, categoryDetails};
    }

    updateSuperCategoryIndex(selectedIndex, value) {
        this.setState({
            selectedSuperCategoryValue: value,
            selectedSuperCategoryIndex: selectedIndex
        });
    }

    updateCategoryIndex(selectedIndex, value) {
        this.setState({
            selectedCategoryValue: value,
            selectedCategoryIndex: selectedIndex
        });
    }

    updateSubCategoryIndex(selectedIndex, value) {
        this.setState({
            selectedSubCategoryValue: value,
            selectedSubCategoryIndex: selectedIndex
        });
    }

    submitSuperCategory() {
        this.props.getCategory.call(this, 
            'Category', 
            this.state.selectedSuperCategoryIndex
        );
    }

    submitCategory() {
        this.props.getCategory.call(this, 
            'SubCategory', 
            this.state.selectedCategoryIndex
        );   
    }

    subCategoryExists(values) {
        if(values === null || values.length === 0){
            return false;
        }
        return true;
    }

    submitSubCategory() {  
        if(this.props.editFlow){
            let { merchantDetails } = this.updateMerchantDetails();
            this.props.updateCurrentMerchantDetails.call(this, merchantDetails, this.props.merchantId);
        }else{
            this.updateMerchantDetails();
            goToPage('AddAddress');
        }
    }

    renderCategory(value, selectedIndex, selectorText){
        return(
            <React.Fragment>
                <ScrollView contentContainerStyle={{flexGrow:1, paddingBottom: 70}}>
                    <View style={styles.viewContainer}>
                        <View style={styles.textView}>
                            <Text style={styles.selectCategoryText}>
                                {selectorText}
                            </Text>
                        </View>
                        <CategoryButton
                            categoryValues={value}
                            selectedIndex={selectedIndex}
                            updateIndex={this.props.categoryState === 0 ? this.updateSuperCategoryIndex : 
                                this.props.categoryState === 1 ? this.updateCategoryIndex : this.updateSubCategoryIndex}>
                        </CategoryButton>
                    </View>
                    </ScrollView>
                <Button
                    complete={false}
                    loading={this.props.ajaxStatus.state === 'inprogress'}
                    buttonDisabled={!selectedIndex ? true : false}
                    submit={this.props.categoryState === 0 ? this.submitSuperCategory : 
                        this.props.categoryState === 1 ? this.submitCategory :  this.submitSubCategory}
                >
                    <Text>NEXT</Text>
                </Button>
            </React.Fragment>
        )
    }

    render() {
        return(
            <Container style={commonStyles.contentBackground}>
                <Header 
                    main="no" 
                    headerName={this.props.categoryState === 0 ? "Category" : this.props.categoryState === 1 ? 
                        this.state.selectedSuperCategoryValue + " Type" :  this.state.selectedCategoryValue + ' Type'}
                    goBack={this.goBackHandler}    
                    close={this.goBackHandler}
                    timerStart={this.props.timerStart}
                    />
                    {/* {this.props.timerStart && <Timer />} */}
                    {this.props.categoryState === 0 && this.props.superCategory.length > 0 && 
                        this.renderCategory(this.props.superCategory, this.state.selectedSuperCategoryIndex, ' Select a Category')
                    }
                    {this.props.categoryState === 1 && this.props.category.length > 0 && 
                        this.renderCategory(this.props.category, this.state.selectedCategoryIndex, 'Select ' + this.state.selectedSuperCategoryValue + ' Type')
                    }
                    {this.props.categoryState === 2 && this.props.subCategory.length > 0 && 
                        this.subCategoryExists(this.props.subCategory) ?
                            this.renderCategory(this.props.subCategory, this.state.selectedSubCategoryIndex, 'Select '+this.state.selectedSuperCategoryValue+ ' > '+ this.state.selectedCategoryValue+' Type') :
                            this.submitSubCategory
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
        category: state.categories.category,
        subCategory: state.categories.subCategory,
        timerStart: state.timerDetails.timerStart,
        categoryState: state.categories.categoryState,
        superCategory: state.categories.superCategory,
        editFlow: state.currentMerchantDetails.editFlow,
        merchantId: state.currentMerchantDetails.merchantId,
        merchantDetails: state.currentMerchantDetails.merchantDetails,   
        categoryDetails: state.currentMerchantDetails.categoryDetails,
	};
}

/** 
 *  Mapping the props for the desired dispatch actions
 */
const mapDispatchToProps = { 
    getCategory,
    getSuperCategory,
    updateCategoryStateProp, 
    loadCurrentMerchantDetails,
    updateCurrentMerchantDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);

const styles = StyleSheet.create({
    viewContainer: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 8,
        marginRight: 8
    },
    textView: {
        marginLeft: 8,
        marginBottom: 8
    },
    selectCategoryText: {
        color: TEXT_COLOR,
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: MEDIUM_FONT
    }
});
