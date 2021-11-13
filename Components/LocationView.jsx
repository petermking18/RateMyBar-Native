import React, {useState} from 'react';
import {RateMyBarApi} from '../Api/RateMyBarApi';
import * as Location from 'expo-location';
import {SafeAreaView, StyleSheet, TouchableWithoutFeedback, Keyboard, Platform} from 'react-native';
import {useTheme, Button, Input, Text, Heading, VStack, HStack, KeyboardAvoidingView} from 'native-base';

const api = new RateMyBarApi();

export default function LocationView({setLocation, ...props}) {
    const {colors} = useTheme();
    const styles = getStyles(colors);
    const [zip, setZip] = useState('');
    const [loading, setLoading] = useState(false);
    const zipInvalid = () => {
        if (zip.length !== 5) {
            return true;
        } else if (zip.match(/[^\d]/)) {
            return true;
        }
        return false;
    }
    const getLocation = async () => {
        setLoading(true);
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location denied.');
            setLoading(false);
            return;
        }

        Location.getCurrentPositionAsync({}).then(location => {
            const loc = {
                lat: location.coords.latitude,
                lng: location.coords.longitude
            }
            setLoading(false);
            setLocation(loc);
        }).catch(err => {
            alert(JSON.stringify(err, null, 2));
            setLoading(false);
        })

    }
    const useZip = () => {
        setLoading(true);
        api.bars.getCoordinates(zip).then((response) => {
            setLocation({
                lat: response[0].geometry.location.lat,
                lng: response[0].geometry.location.lng
            })
            setLoading(false);
        })
    }
    return (
        <SafeAreaView style={styles.safe}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView h={{base: '400px', lg: 'auto'}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, padding: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} keyboardVerticalOffset={120}>
                    <VStack justifyContent='center' space={2} style={styles.stack}>
                        <Heading style={{fontSize: 30}}>This app requires your location</Heading>
                        <Text style={{color: colors.muted['500'], fontSize: 17, marginBottom: 40}}>Your location will not be shared and is only used to find bars near you.</Text>
                        <Button colorScheme='primary' size='lg' 
                            onPress={() => getLocation()}
                            isLoading={loading}
                            isDisabled={loading}
                            style={styles.button}>Use current location</Button>
                        <Heading style={{fontSize: 20, color: colors.muted['400'], textAlign: 'center'}}>OR</Heading>
                        <Input variant='underlined' style={styles.input} value={zip} 
                            placeholder='Enter zip code'
                            type='postal-code'
                            isDisabled={loading}
                            keyboardType='number-pad'
                            maxLength={5}
                            onChangeText={text => setZip(text)} 
                            InputRightElement={
                                <Button colorScheme='primary' 
                                onPress={() => useZip()}
                                isDisabled={zipInvalid() || loading}
                                size='lg'>OK</Button>
                            } />
                    </VStack>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

const getStyles = (colors) => {
    return StyleSheet.create({
        safe: {
            flex: 1, 
            justifyContent: 'center',
            alignItems: 'center'
        },
        stack: {
            marginLeft: 30,
            marginRight: 30,
        },
        button: {
            borderRadius: 25,
            paddingTop: 15,
            paddingBottom: 15
        },
        input: {
            fontSize: 25,
            marginBottom: 2,
        },
        error: {
            fontSize: 15,
            color: colors.danger['500'],
            textAlign: 'center'
        },
    })
}