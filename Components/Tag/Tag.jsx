import React from 'react';
import {SafeAreaView, Text} from 'native-base';

export default function Tag(props) {
    return (
        <Text>{props.route.params.tag}</Text>
    )
}