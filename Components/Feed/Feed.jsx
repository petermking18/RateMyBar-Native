import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, Pressable, Animated, Dimensions, StatusBar, RefreshControl} from 'react-native';
import {Text, useTheme, TouchableOpacity, Box, Button, ScrollView, View, Center, Spinner} from 'native-base';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from "@expo/vector-icons";
import FeedConfigurations from './FeedConfigurations';
import {NavigationContainer, useRoute} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Nearby from './Nearby';
import Following from './Following';

const Tab = createMaterialTopTabNavigator();

export default function Feed(props) {
    const feedProps = props;
    const {colors} = useTheme();
    const nav = useNavigation();
    const [radius, setRadius] = useState(20);
    const [sortBy, setSortBy] = useState('Most recent');
    const [view, setView] = useState('Following');

    useEffect(() => {
        nav.setOptions({
            headerRight: () => 
            <FeedConfigurations view={view}
                radius={radius} setRadius={(v) => setRadius(v)} 
                sortBy={sortBy} setSortBy={setSortBy}
            />
        })
    }, [view, radius, sortBy]);


    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: {
                        backgroundColor: colors.primary[500]
                    }
                }}
                screenListeners={{
                    state: (e) => {
                        setView(e.data.state.routeNames[e.data.state.index]);
                    }
                }}
            >
                <Tab.Screen name="Following">
                    {(props) => (
                        <Following {...props} radius={radius} sortBy={sortBy} token={feedProps.token} parentNav={nav} location={feedProps.location}/>
                    )}
                </Tab.Screen>
                <Tab.Screen name="Nearby">
                    {(props) => (
                        <Nearby {...props} radius={radius} sortBy={sortBy} token={feedProps.token} parentNav={nav} location={feedProps.location}/>
                    )}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    )
}