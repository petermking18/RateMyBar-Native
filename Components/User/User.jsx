import React from 'react';
import {SafeAreaView} from 'react-native';
import {Text, useTheme} from 'native-base';
import {RateMyBarApi} from '../../Api/RateMyBarApi';

const api = new RateMyBarApi();

export default function User(props) {

    return (
        <SafeAreaView>
            <Text>User {props.route.params.userID}</Text>
        </SafeAreaView>
    )
}