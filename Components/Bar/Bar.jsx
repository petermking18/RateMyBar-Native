import React, {useEffect, useState} from 'react';
import {SafeAreaView, Linking, RefreshControl, TouchableOpacity, Dimensions} from 'react-native';
import {Text, useTheme, View, Box, Heading, Button, HStack, VStack, Wrap, ScrollView, Select, Spinner, Image, Modal} from 'native-base';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@expo/vector-icons';
import BeerRating from '../Ratings/BeerRating';
import BarCategoryRatings from './BarCategoryRatings'
import RatingCard from '../Profile/RatingCard';

const Tab = createMaterialTopTabNavigator();
const api = new RateMyBarApi();

export default function Bar(props) {
    const barProps = props;
    const {colors} = useTheme();
    const [barInfo, setBarInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState(null);
    const nav = useNavigation();

    useEffect(() => {
        api.bars.getBarPage(props.token.id, props.token.token, props.route.params.barID, props.location.lat, props.location.lng, 'Most recent', 0, 1).then(response => {
            if (response.errorMessage) {
                setError(response.errorMessage);
            } else {
                setBarInfo(response.barInfo);
                setTags(response.tags);
                nav.setOptions({
                    headerTitle: response.barInfo.name,
                    headerRight: () => <Button size='lg' onPress={() => nav.navigate('New Rating', {barID: props.route.params.barID})}>Rate bar</Button>
                });
            }
            setLoading(false);
        })
    }, [nav]);

    if(error) {
        return <View><Text mt={5} color={colors.muted[500]} textAlign='center'>{error}</Text></View>
    } else {
        return (
            <>
            {!loading &&
            <Box p={5} pb={2} pt={3} bg='white' borderColor={colors.muted[300]} borderBottomWidth={1}>
                <Heading size='xl' mb={0}>{barInfo.name}</Heading>
                <Text mb={1} fontSize={17} color={colors.muted[500]}>{barInfo.address} ({parseInt(barInfo.distance)} mile{parseInt(barInfo.distance) !== 1 && 's'})</Text>
                <BeerRating rating={barInfo.avgRating}/>
                <Wrap mt={2} direction='row' space={3}>
                    {barInfo.phone && <Button ml={0} onPress={() => Linking.openURL(`tel:${barInfo.phone}`)} borderRadius={100}><HStack space={1}><MaterialIcons name='call' size={20}/><Text>Call</Text></HStack></Button>}
                    {barInfo.website && <Button onPress={() => Linking.openURL(barInfo.website)} borderRadius={100}><Text>Visit Website</Text></Button>}
                </Wrap>
            </Box>
            }
            <NavigationContainer independent={true}>
                <Tab.Navigator
                    screenOptions={{
                        tabBarIndicatorStyle: {
                            backgroundColor: colors.primary[500]
                        }
                    }}
                >
                    <Tab.Screen name="Overview">
                        {(props) => (
                            <View {...props} flex={1}>
                                {!loading &&
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Box h={3}></Box>
                                    <Box bg='white' shadow={0} p={5}>
                                        <Heading size='sm' color={colors.muted[400]}>Overall</Heading>
                                        {barInfo.avgRating ?
                                        <BarCategoryRatings categoryRatings={barInfo.avgCategoryRatings}/>
                                        :
                                        <Text color={colors.muted[400]} textAlign='center'>This bar has no ratings yet.</Text>
                                        }
                                    </Box>
                                    <Box bg='white' mt={3} shadow={0} p={5}>
                                        <Heading size='sm' color={colors.muted[400]}>Tags</Heading>
                                        {tags.length > 0 ?
                                        <Wrap direction='row' mt={1} space={3}>
                                            {tags.map((tag, index) => (
                                                <Button onPress={() => nav.navigate('Tag', {tag: tag.tag})} borderRadius={100}>{tag.tag}</Button>
                                            ))}
                                        </Wrap>
                                        :
                                        <Text color={colors.muted[400]} textAlign='center'>This bar has no tags yet.</Text>
                                        }
                                    </Box>
                                    {barInfo.name && <Button onPress={() => nav.navigate('New Rating', {barID: barProps.route.params.barID})} borderRadius={100} size='lg' m={5}><HStack alignItems='center' space={1}><MaterialIcons /*color='white'*/ name='add' size={20}/><Text /*color='white'*/ fontSize={20}>Rate {barInfo.name}</Text></HStack></Button>}
                                    <Box h={10}></Box>
                                </ScrollView>
                                }
                            </View>
                        )}
                    </Tab.Screen>
                    <Tab.Screen name="Ratings">
                        {(props) => (
                            <Ratings {...props} token={barProps.token} barID={barProps.route.params.barID} location={barProps.location} parentNav={nav}/>
                        )}
                    </Tab.Screen>
                    <Tab.Screen name="Photos">
                        {(props) => (
                            <Photos {...props} token={barProps.token} barID={barProps.route.params.barID} location={barProps.location} parentNav={nav}/>
                        )}
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
            </>
        )
    }
}

function Ratings({token, location, barID, parentNav, ...props}) {
    const {colors} = useTheme();
    const [ratings, setRatings] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 5;
    const [sortBy, setSortBy] = useState('Most recent');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [noMore, setNoMore] = useState(false);
    
    const shouldLoadMore = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    const loadInitial = () => {
        setLoading(true);
        setPage(0);
        api.bars.getBarPage(token.id, token.token, barID, location.lat, location.lng, sortBy, 0, pageSize).then(response => {
            setRatings(response.ratings);
            setLoading(false);
            setRefreshing(false);
            setNoMore(response.ratings.length === 0);
        });
    }

    const loadMore = () => {
        if (!loading && !noMore) {
            const newPage = page + 1;
            setLoading(true);
            api.bars.getBarPage(token.id, token.token, barID, location.lat, location.lng, sortBy, newPage, pageSize).then(response => {
                setRatings([...ratings, ...response.ratings]);
                setLoading(false);
                setPage(newPage);
                setNoMore(response.ratings.length === 0);
            })
        }
    }

    useEffect(() => {
        loadInitial();
    }, [sortBy]);

    return (
    <View flex={1}>
        <ScrollView
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
                if(shouldLoadMore(nativeEvent)) {
                    loadMore();
                }
            }}
            scrollEventThrottle={400}
        >   
            <Box shadow={0}>
                <Select
                    selectedValue={sortBy}
                    onValueChange={v => setSortBy(v)}
                    bg='white' borderBottomWidth={0} variant='underlined'
                    fontSize='17' px={5} py={5} color={colors.muted[500]}
                >   
                    <Select.Item label="Most recent" value="Most recent"/>
                    <Select.Item label='Highest rating' value='Highest rating'/>
                </Select>
            </Box>
            <Box h={3}></Box>
            {ratings.map((rating, index) => (
                <>
                <RatingCard rating={rating} key={index}
                    token={token} openRating={ratingID => parentNav.navigate('Rating', {
                        ratingID: ratingID,
                        onDeleted: (ratingID) => {},
                        token: token,
                        location: location
                    })}
                    openTag={tag => parentNav.navigate('Tag', {tag})}
                    openUser={userID => parentNav.navigate('User', {userID})}
                    marginBottom={5}
                />
                </>
            ))}
            {loading && <Spinner/>}
            {noMore && <Text textAlign='center' color={colors.muted[500]} fontSize={15} mt={0}>All results loaded.</Text>}
            <Box h={10}></Box>
        </ScrollView>
    </View>
    )
}

function Photos({token, location, barID, parentNav, ...props}) {
    const {colors} = useTheme();
    const imageSize = Dimensions.get('window').width/3;
    const vw = Dimensions.get('window').width;
    const [photos, setPhotos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalPhoto, setModalPhoto] = useState(null);
    const [show, setShow] = useState(false);

    const load = () => {
        api.bars.getBarPage(token.id, token.token, barID, location.lat, location.lng, 'Most recent', 0, 100).then(response => {
            setPhotos(response.barReviewPhotos);
            setRefreshing(false);
        })
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <>
        <View flex={1}>
            <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={
                        () => {
                            setRefreshing(true);
                            load();
                        }
                    }
                    tintColor={colors.primary[500]}
                />
            }
            >
                <Wrap direction='row'>
                    {photos.map((photo, index) => (
                        <TouchableOpacity onPress={() => {
                            setModalPhoto(photo);
                            setShow(true);
                        }} key={photo}>
                            <Image style={{width: imageSize, height: imageSize}} resizeMode='cover' alt='Photo' key={photo} source={{uri: photo}}/>
                        </TouchableOpacity>
                    ))}
                </Wrap>
                {photos.length === 0 && <Text mt={5} textAlign='center' color={colors.muted[500]}>No photos yet</Text>}
            </ScrollView>
        </View>
        <Modal isOpen={show} size='full' onClose={() => {
            setShow(false);
            setTimeout(() => {setModalPhoto(null)}, 100);
        }}>
            <Modal.Content>
                <Modal.CloseButton/>
                <Modal.Body p={0}>
                    <Image key={modalPhoto} size={vw} resizeMode='cover' alt='Photo' source={{uri: modalPhoto}}/>
                </Modal.Body>
            </Modal.Content>
        </Modal>
        </>
    )
}