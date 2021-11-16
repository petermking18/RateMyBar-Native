import React, {useState, useEffect, useRef} from 'react';
import {Dimensions, StyleSheet, Image} from 'react-native';
import {Text, useTheme, View, Box, Button} from 'native-base';
import {MaterialIcons} from '@expo/vector-icons';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import { color } from 'styled-system';
import {default as logo} from '../../assets/logo-25.png';
import BarCategoryRatings from '../Bar/BarCategoryRatings';

const api = new RateMyBarApi();

export default function FindBarsMap({token, location, openBar}) {
    const vw = Dimensions.get('window').width;
    const {colors} = useTheme();
    const [bars, setBars] = useState([]);
    const DELTA = 0.1;
    let _map = useRef();
    const initialRegion = {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: DELTA,
        longitudeDelta: DELTA
    }
    // const [openingCallout, setOpeningCallout] = useState(false);

    const onRegionChange = (newRegion) => {
        const radius = calcDistance(newRegion.latitude, newRegion.longitude, newRegion.latitude + newRegion.latitudeDelta, newRegion.longitude + newRegion.longitudeDelta);
        api.bars.getFindBarsPage(token.id, token.token, 'Nearby', radius, newRegion.latitude, newRegion.longitude, 0, 100)
        .then(response => {
            setBars(response.bars);
        })
    }
    const calcDistance = (lat1, lat2, lng1, lng2) => {
        lat1 = lat1/(180/Math.PI);
        lat2 = lat2/(180/Math.PI);
        lng1 = lng1/(180/Math.PI);
        lng2 = lng2/(180/Math.PI);
        const inner = Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lng1-lng2);
        return 3963.0*Math.acos(inner);
    }

    const barIsUnrated = (bar) => {
        if (!bar || !bar.avgCategoryRatings) return true;
        let unrated = true;
        bar.avgCategoryRatings.forEach(cr => {
            if (cr.averageCategoryRating > 0) {
                unrated = false;
            }
        })
        return unrated;
    }
    
    return (
        <View style={{flex: 1, backgroundColor: colors.muted[200], alignItems: 'center', justifyContent: 'center'}}>
            <MapView showsUserLocation ref={_map}
                style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}} style={{...StyleSheet.absoluteFillObject}}
                initialRegion={initialRegion} onRegionChangeComplete={onRegionChange} customMapStyle={mapStyle} provider={PROVIDER_GOOGLE}
            >
            {bars.map((bar, index) => (
                <Marker key={index} 
                ref={r => bars[index] = r}
                coordinate={{latitude: bar.lat, longitude: bar.lng}}
                onPress={() => {
                    _map.current.fitToCoordinates([
                        {latitude: bar.lat, longitude: bar.lng},
                        {latitude: bar.lat - DELTA/3, longitude: bar.lng - DELTA/3},
                        {latitude: bar.lat + DELTA/3, longitude: bar.lng + DELTA/3},
                    ], {
                        edgePadding: {
                            top: 100,
                            right: 0,
                            bottom: 0,
                            left: 0
                        },
                        animated: true
                    });
                }}>
                    <Image source={require('../../assets/logo-100.png')} style={{width: 40, height: 40}}/>
                    <Callout onPress={() => openBar(bar.barID)} style={{width: vw*.75}}>
                        <Text fontSize={20}>{bar.name}</Text>
                        <BarCategoryRatings categoryRatings={bar.avgCategoryRatings}/>
                        {barIsUnrated(bar) && <Text textAlign='center' color={colors.muted[500]}>This bar has not been rated yet.</Text>}
                    </Callout>
                </Marker>
            ))}
            {/* <Marker coordinate={{latitude: location.lat, longitude: location.lng}}/> */}
            </MapView>
            <Button onPress={() => {_map.current.fitToCoordinates([
                    {latitude: location.lat, longitude: location.lng},
                    {latitude: location.lat - DELTA/3, longitude: location.lng - DELTA/3},
                    {latitude: location.lat + DELTA/3, longitude: location.lng + DELTA/3}
                ], {
                    edgePadding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    animated: true
                })
                bars.forEach(b => b.hideCallout());    
            }}
            style={{position: 'absolute', bottom: 20, right: 20}}
            >
            <MaterialIcons size={30} color='white' name='my-location'/>
            </Button>
        </View>
    )
}

var mapStyle = [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#f5f5f5",
        },
      ],
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#f5f5f5",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#bdbdbd",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#eeeeee",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#e5e5e5",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9e9e9e",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#dadada",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9e9e9e",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [
        {
          color: "#e5e5e5",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          color: "#eeeeee",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#c9c9c9",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9e9e9e",
        },
      ],
    },
  ];