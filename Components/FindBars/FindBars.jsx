import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, RefreshControl, Dimensions} from 'react-native';
import {Text, useTheme, ScrollView, View, Popover, Slider, Button, Box, Spinner, Select} from 'native-base';
import {useNavigation, NavigationContainer} from '@react-navigation/native';
import {MaterialIcons} from '@expo/vector-icons';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FindBarsConfigurations from './FindBarsConfigruations';
import BarCard from '../Bar/BarCard';
import FindBarsMap from './FindBarsMap';
import NewRatingButton from '../Ratings/NewRatingButton';

const api = new RateMyBarApi();
const Tab = createMaterialTopTabNavigator();

export default function FindBars(props) {
    const token = props.token;
    const location = props.location;
    const {colors} = useTheme();
    const [bars, setBars] = useState([]);
    const [sortBy, setSortBy] = useState('Nearest');
    const [radius, setRadius] = useState(20);
    const [page, setPage] = useState(0);
    const pageSize = 5;
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(true);
    const [noMore, setNoMore] = useState(false);
    const [apiKey, setApiKey] = useState(null);
    const [view, setView] = useState('List view');
    const [scrollOffset, setScrollOffset] = useState(0);
    const [showNewRatingButton, setShowNewRatingButton] = useState(true);
    const nav = useNavigation();
    let _scrollView = useRef();

    const shouldLoadMore = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    const loadInitial = () => {
        setLoading(true);
        setPage(0);
        api.bars.getFindBarsPage(props.token.id, props.token.token, sortBy, radius, props.location.lat, props.location.lng,
        0, pageSize).then(response => {
            setBars(response.bars);
            _scrollView.current.scrollTo({y: 0, animated: true});
            // setApiKey(response.apiKey);
            setLoading(false);
            setRefreshing(false);
            setNoMore(response.bars.length === 0);
        })
    }

    const loadMore = () => {
        if (!loading && !noMore) {
            const newPage = page + 1;
            setLoading(true);
            api.bars.getFindBarsPage(props.token.id, props.token.token, sortBy, radius, props.location.lat, props.location.lng,
            newPage, pageSize).then(response => {
                setBars([...bars, ...response.bars]);
                setLoading(false);
                setPage(newPage);
                setNoMore(response.bars.length === 0);
            })
        }
    }

    useEffect(() => {
        if (view === 'List view') {
            nav.setOptions({
                headerRight: () => <FindBarsConfigurations radius={radius} setRadius={setRadius} sortBy={sortBy} setSortBy={setSortBy}/>
            });
            loadInitial();        
        } else {
            nav.setOptions({
                headerRight: null
            })
        }
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
                <Tab.Screen name='List view'>
                {props => (
                    <View {...props} style={{backgroundColor: colors.muted[200], height: '100%'}}>
                    <ScrollView
                        ref={_scrollView}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={
                                    () => {
                                        setRefreshing(true);
                                        loadInitial();
                                    }
                                }
                                tintColor={colors.primary[500]}
                            />
                        }
                        onScroll={({nativeEvent}) => {
                            if (shouldLoadMore(nativeEvent)) {
                                loadMore();
                            }
                        }}
                        onScrollToTop={() => {
                            setShowNewRatingButton(true);
                        }}
                        onScrollBeginDrag={({nativeEvent}) => {
                            if(nativeEvent.contentOffset.y > scrollOffset) {
                                setShowNewRatingButton(false);
                            } else {
                                setShowNewRatingButton(true);
                            }
                            setScrollOffset(nativeEvent.contentOffset.y);
                        }}
                        onMomentumScrollBegin={({nativeEvent}) => {
                            if(nativeEvent.contentOffset.y > scrollOffset) {
                                setShowNewRatingButton(false);
                            } else {
                                setShowNewRatingButton(true);
                            }
                            setScrollOffset(nativeEvent.contentOffset.y);
                        }}
                        showsVerticalScrollIndicator={false}
                        style={{backgroundColor: colors.muted[200]}}
                        scrollEventThrottle={1000}
                    >
                        <Box h={3}></Box>
                        {bars.map((bar, index) => (
                            <BarCard bar={bar} key={bar.barID} openBar={barID => nav.navigate('Bar', {barID})} openTag={tag => nav.navigate('Tag', {tag})} marginBottom={5}/>
                        ))}
                        {loading && <Spinner/>}
                        {noMore && <Text textAlign='center' color={colors.muted[500]} fontSize={15} mt={0}>All results loaded.</Text>}
                        <Box h={7}></Box>
                    </ScrollView>
                    {token.id !== 21 && <NewRatingButton show={showNewRatingButton} go={() => nav.navigate('New Rating', {})}/>}
                    </View>
                )}
                </Tab.Screen>
                <Tab.Screen name='Map view'>
                    {props => <FindBarsMap {...props} view={view} token={token} location={location} openBar={barID => nav.navigate('Bar', {barID})} />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    )
}