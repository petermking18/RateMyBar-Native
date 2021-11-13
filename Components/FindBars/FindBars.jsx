import React from 'react';
import {SafeAreaView} from 'react-native';
import {Text, useTheme} from 'native-base';
import {RateMyBarApi} from '../../Api/RateMyBarApi';

const api = new RateMyBarApi();

export default function FindBars(props) {

    return (
        <SafeAreaView>
            <Text>FindBars</Text>
        </SafeAreaView>
    )
}