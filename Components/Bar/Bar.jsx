import React from 'react';
import {SafeAreaView} from 'react-native';
import {Text, useTheme} from 'native-base';
import {RateMyBarApi} from '../../Api/RateMyBarApi';

const api = new RateMyBarApi();

export default function Bar(props) {

    return (
        <SafeAreaView>
            <Text>Bar {props.route.params.barID}</Text>
        </SafeAreaView>
    )
}