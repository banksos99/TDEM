import React, { Component } from 'react';

import {
    Text,
    View,
    TouchableOpacity,
    Image,
    BackHandler
} from 'react-native';

import Colors from "./../SharedObject/Colors"
import { styles } from "./../SharedObject/MainStyles"
import moment from 'moment'
import firebase from 'react-native-firebase';
import SharedPreference from "./../SharedObject/SharedPreference"

export default class LeaveQuotaActivity extends Component {

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            item: this.props.navigation.getParam("item", ""),
            dataResponse: this.props.navigation.getParam("dataResponse", ""),
            selectYear: this.props.navigation.getParam("selectYear", "")
        };
        this.checkParameter()
        firebase.analytics().setCurrentScreen(SharedPreference.FUNCTIONID_LEAVE_QUOTA)

    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.onBack()
        return true;
    }


    checkParameter() {
        const format = 'DD/MM/YYYY'
        let original = this.state.item

        if (original.time_year == null) {
            const copy = {
                ...original, time_year: '-'
            };
            original = copy
        }

        if (original.time_serviceyear == null) {
            const copy = {
                ...original, time_serviceyear: '-'
            };
            original = copy
        }

        if (original.eff_from_date) {
            const effectDate = moment(original.eff_from_date).format(format);
            const copy = {
                ...original, eff_from_date: effectDate
            };
            original = copy
        }

        if (original.eff_to_date) {
            const effectDate = moment(original.eff_to_date).format(format);
            const copy = {
                ...original, eff_to_date: effectDate
            };
            original = copy
        }

        if (original.leave_regulation == null) {
            const copy = {
                ...original, leave_regulation: '-'
            };
            original = copy
        }

        this.state.item = original
        console.log("itemitemitem : ", this.state.item)
    }

    onBack() {
        this.props.navigation.navigate('LeavequotaList',
            {
                dataResponse: this.state.dataResponse,
                selectYear: this.state.selectYear
            });
    }
    render() {
        return (
            <View style={styles.container} >
                <View style={styles.navContainer}>
                    <TouchableOpacity style={styles.navLeftContainer} onPress={(this.onBack.bind(this))}>
                        <Image
                            style={styles.navBackButton}
                            source={require('./../resource/images/Back.png')}
                        />
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={styles.navTitleText}>{this.state.item.leave_desc_en}</Text>
                    <View style={styles.navRightContainer}>
                    </View>
                </View>
                <View style={styles.leaveQuotaDetailContainer}>
                    {/* container */}
                    <View style={styles.leaveQuotaContainer}>

                        <View style={styles.leaveQuotaDetailItemTopContainer}>
                            <Text style={styles.leaveQuotaDetailItemTopTitleText}>Used</Text>
                            <View style={styles.leaveQuotaDetailItemTopCircleContainer} >
                                <Text style={styles.leaveQuotaDetailItemTopCircleText}>{this.state.item.used}</Text>
                            </View>
                            <Text style={styles.leaveQuotaDetailItemTopDescText}>{this.state.item.unit}</Text>
                        </View>

                        <View style={styles.leaveQuotaDetailItemTopContainer}>
                            <Text style={styles.leaveQuotaDetailItemTopTitleText}>Remain</Text>
                            <View style={[styles.leaveQuotaDetailItemTopCircleContainer, { backgroundColor: Colors.leaveCircleBlue }]} >
                                <Text style={styles.leaveQuotaDetailItemTopCircleText}>{this.state.item.remain_quota}</Text>
                            </View>
                            <Text style={styles.leaveQuotaDetailItemTopDescText}>{this.state.item.unit}</Text>
                        </View>

                        <View style={styles.leaveQuotaDetailItemTopContainer}>
                            <Text style={styles.leaveQuotaDetailItemTopTitleText}>Quota</Text>
                            <View style={[styles.leaveQuotaDetailItemTopCircleContainer, {
                                backgroundColor:
                                    Colors.leaveCircleGreen
                            }]} >
                                <Text style={styles.leaveQuotaDetailItemTopCircleText}>{this.state.item.quota}</Text>
                            </View>
                            <Text style={styles.leaveQuotaDetailItemTopDescText}>{this.state.item.unit}</Text>
                        </View>
                    </View >


                    <View style={[styles.leaveQuotaDetailContentContainer]}>
                        <View style={styles.leaveQuotaDetailContentTextContainer}>
                            <View style={styles.leaveQuotaDetailContentTextInsideContainer}>
                                <Text style={styles.leaveQuotaContentTitleText}>Time/Year</Text>
                                <Text style={styles.leaveQuotaContentDescText}>{this.state.item.time_year}</Text>
                            </View>
                        </View>
                        <View style={styles.leaveQuotaDetailContentTextContainer}>
                            <View style={styles.leaveQuotaDetailContentTextInsideContainer}>
                                <Text style={styles.leaveQuotaContentTitleText}>Time/Service</Text>
                                <Text style={styles.leaveQuotaContentDescText}>{this.state.item.time_serviceyear}</Text>
                            </View>
                        </View>
                        <View style={styles.leaveQuotaDetailContentTextContainer}>
                            <View style={styles.leaveQuotaDetailContentTextInsideContainer}>
                                <Text style={styles.leaveQuotaContentTitleText}>Effective</Text>
                            </View>
                        </View>

                        <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} >
                            <Text style={styles.leaveQuotaContentGrayText}>From   </Text>
                            <Text style={styles.leaveQuotaContentRedText}>{this.state.item.eff_from_date}</Text>
                            <Text style={styles.leaveQuotaContentGrayText}>  To  </Text>
                            <Text style={styles.leaveQuotaContentRedText}>{this.state.item.eff_to_date}</Text>
                        </View>

                    </View >
                    <View style={[styles.leaveQuotaDetailContentContainer, { flex: 1, paddingLeft: 10, paddingRight: 10, paddingTop: 15 }]}>
                        <Text style={styles.leaveQuotaContentGrayText}>Regulation   </Text>
                        <Text style={styles.leaveQuotaDescText}>{this.state.item.leave_regulation}</Text>
                    </View >
                </View>
            </View >
        );
    }
}