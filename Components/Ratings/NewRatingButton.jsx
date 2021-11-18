import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {Button, useTheme, HStack, Text} from 'native-base';
import {MaterialIcons} from '@expo/vector-icons';
import { styles } from 'styled-system';

export default function NewRatingButton({show, go, ...props}) {
    const {colors} = useTheme();
    const styles = getStyles(colors);
    const [bounceValue, setBounceValue] = useState(new Animated.Value(100));

    useEffect(() => {
        let toValue = show ? 0 : 100;
        Animated.spring(
            bounceValue, 
            {
                toValue: toValue,
                velocity: 3,
                tension: 2,
                friction: 8,
                useNativeDriver: false
            }
        ).start();
    }, [show]);

    return <Animated.View style={[styles.AnimatedView, {transform: [{translateY: bounceValue}]}]}><Button onPress={go} shadow={1} style={{borderRadius: 100}}><HStack alignItems='center' space={0}><MaterialIcons size={30} color='white' name='add'/><Text fontSize={20} color='white'>{props.text ? props.text : 'New Rating'}</Text></HStack></Button></Animated.View>
}

const getStyles = (color) => StyleSheet.create({
    AnimatedView: {
        position: "absolute",
        bottom: 30,
        right: 10
    }
})