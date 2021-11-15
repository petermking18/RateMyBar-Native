import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {Text, useTheme, View, Box} from 'native-base';
import {MaterialIcons} from '@expo/vector-icons';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import MapView from 'react-native-maps';
import { color } from 'styled-system';

const api = new RateMyBarApi();

export default function FindBarsMap({token, location}) {
    const {colors} = useTheme();
    const [bars, setBars] = useState([]);
    const [region, setRegion] = useState({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15
    });
    const [changingRegion, setChangingRegion] = useState(false);

    const onRegionChange = (region) => {
        if (!changingRegion) {
            setChangingRegion(true);
            alert(JSON.stringify(region, null, 2));
            setChangingRegion(false);
        }
    }
    
    return (
        <View style={{flex: 1, backgroundColor: colors.muted[200], alignItems: 'center', justifyContent: 'center'}}>
            <MapView 
                style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
                region={region} onRegionChange={onRegionChange}
            />
        </View>
    )
}