import React, { Component } from 'react';

import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native';

import { styles } from "./../SharedObject/MainStyles"
import Colors from "./../SharedObject/Colors"

const font_medium = 'Prompt-Medium';

export default class LeaveQuotaActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stories: [],
            isFetching: false,
            dataSource: this.props.navigation.getParam("dataResponse", ""),
            selectYear: this.props.navigation.getParam("selectYear", new Date().getFullYear()),
        };
        console.log("LeaveQuotaActivity ==>> customData : ", this.state.dataSource)
    }

    onBack() {
        this.props.navigation.navigate('HomeScreen');
    }

    renderEmpty() {
        return (<View style={{
            height: 50, justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={{ fontFamily: font_medium }}>No result</Text>
        </View>)
    }

    leaveQuotaListview() {
        console.log(" this.state.dataSource  : ", this.state.dataSource.code)
        if (this.state.dataSource.code == '404') {
            return (<View style={{
                height: 50, justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{ fontFamily: font_medium }}>No result</Text>
            </View>)
        }
            

        let dataArray = this.state.dataSource.data.years
        console.log("dataArray : ", dataArray)
        let yearArray = []

        if(!dataArray){
            this.renderEmpty()
        }

        if (dataArray.length == 0) {
            this.renderEmpty()
        }

        for (let index = 0; index < dataArray.length; index++) {
            const element = dataArray[index];
            if (element.year == this.state.selectYear) {
                yearArray = element.items
            }
        }

        return (
            <ScrollView style={styles.leavequotaBackground}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={yearArray}
                    renderItem={({ item }) => (
                        <TouchableOpacity key={item.id} style={styles.button}
                            onPress={() => {
                                this.props.navigation.navigate('LeavequotaDetail', {
                                    item: item,
                                    dataResponse: this.state.dataSource,
                                    selectYear: this.state.selectYear
                                });
                            }}
                            keyExtractor={(item, index) => item + index}
                        >
                            <View style={styles.leavequotalistBackground}>
                                <View style={styles.leavequotaLine} />
                                <View style={styles.leavequotaContainer}>

                                    <View style={styles.leavequotaLeftContainer}>
                                        <Text numberOfLines={1} style={[styles.leavequotalisttextbold, { color: Colors.grayTextColor }]}>
                                            {item.leave_desc_en}
                                        </Text>
                                        <Text numberOfLines={1} style={[styles.leavequotalisttextbold, { color: Colors.lightgrayText }]}>
                                            {item.leave_desc_th}
                                        </Text>
                                    </View>

                                    <View style={styles.leavequotaListContainer} >
                                        <Text style={styles.leavequotalisttextred}>
                                            {item.used}
                                        </Text>
                                    </View>

                                    <View style={styles.leavequotaListContainer} >
                                        <Text style={styles.leavequotalisttextgreen}>
                                            {item.quota}
                                        </Text>
                                    </View>

                                    <View style={styles.leavequotaLastListContainer} >
                                        <Text style={styles.leavequotalisttextboldUnit}>
                                            {item.unit}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </ScrollView>
        )
    }

    onLastYear() {
        this.setState({
            selectYear: new Date().getFullYear() - 1
        })
    }

    onCurrentYear() {
        this.setState({
            selectYear: new Date().getFullYear()
        })
    }

    renderTabYearSelect() {
        let lastYear = new Date().getFullYear() - 1
        // console.log("lastYear : ", lastYear)
        if (this.state.dataSource.status == '404') {
            return (
                <View style={styles.selectYearContainer}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ flex: 1 }} >
                            <View style={this.state.selectYear === (lastYear + 1) ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                                <Text style={this.state.selectYear === (lastYear + 1) ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{lastYear + 1}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 2 }} />
                </View>)
        }

        return (
            <View style={styles.selectYearContainer}>
                <View style={{ flex: 10, flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={(this.onLastYear.bind(this))} >
                        <View style={this.state.selectYear === lastYear ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                            <Text style={this.state.selectYear === lastYear ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{lastYear}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={(this.onCurrentYear.bind(this))} >
                        <View style={this.state.selectYear === (lastYear + 1) ? styles.nonpayrolltabBG_ena : styles.nonpayrolltabBG_dis}>
                            <Text style={this.state.selectYear === (lastYear + 1) ? styles.leaveYearButton_ena : styles.leaveYearButton_dis}>{lastYear + 1}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.leavequotaListContainer} >
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.leavequotalisttextred}>Used</Text>
                </View>

                <View style={styles.leavequotaListContainer} >
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.leavequotalisttextgreen}>Quota</Text>
                </View>
                <View style={{ flex: 2 }} />
            </View>)
    }


    render() {
        return (
            <View style={styles.container} >
                {/* <View style={styles.navContainer}>
                    <TouchableOpacity onPress={(this.onBack.bind(this))}>
                        <Image
                            source={require('./../resource/images/Back.png')}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                    <Text style={styles.navTitleTextTop}>Leave Quota</Text>
                    <View style={styles.navRightContainer}>
                    </View>
                </View> */}

                <View style={styles.navContainer}>
                    <TouchableOpacity style={styles.navLeftContainer} onPress={(this.onBack.bind(this))}>
                        <Image
                            style={styles.navBackButton}
                            source={require('./../resource/images/Back.png')}
                        />
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={styles.navTitleText}>Leave Quota</Text>
                    <View style={styles.navRightContainer}>
                    </View>
                </View>

                {/* Content */}

                <View style={styles.tabbarSelectYearContainer}>
                    {this.renderTabYearSelect()}
                </View>

                <View style={styles.nonPayRollMonthContainer}>
                    {this.leaveQuotaListview()}

                </View>
            </View >
        );
    }
}