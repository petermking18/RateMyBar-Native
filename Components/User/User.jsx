import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {Text, useTheme} from 'native-base';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import {useNavigation} from '@react-navigation/native';

const api = new RateMyBarApi();

export default function User(props) {
    const nav = useNavigation();

    useEffect(() => {
        if (props.route.params.userID === props.token.id) {
            nav.navigate('Profile');
        }
    }, []);

    return (
        <SafeAreaView>
            <Text>User {props.route.params.userID}</Text>
        </SafeAreaView>
    )
}