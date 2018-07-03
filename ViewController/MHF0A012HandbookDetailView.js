import React, { Component } from "react";
import { View, Text } from "react-native";

export default class Menu3Screen extends Component{
    static navigationOptions = {
        drawerLabel: 'Menu 3',
    }

    render(){
        return(
            <View style={styles.container}>
                <Text>Menu3</Text>
            </View>
        )
    }
}