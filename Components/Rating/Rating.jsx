import React from 'react';
import {SafeAreaView, Text} from 'native-base';

export default function Rating(props) {
    return (
        <Text>{props.route.params.ratingID}</Text>
    )
}