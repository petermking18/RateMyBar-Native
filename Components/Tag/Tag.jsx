import React from 'react';
import {SafeAreaView} from 'react-native';
import {Text, Button} from 'native-base';
import {useNavigation} from '@react-navigation/native';

export default function Tag(props) {
    const nav = useNavigation();
    return (
        <SafeAreaView>
            <Text>{props.route.params.tag}</Text>
        </SafeAreaView>
    )
}