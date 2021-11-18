import React, {useState, useEffect} from 'react';
import {SafeAreaView, RefreshControl, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Alert} from 'react-native';
import {Text, useTheme, Button, ScrollView, Box, View, Skeleton, Spinner, Image, VStack, HStack} from 'native-base';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import FollowView from '../FollowTray/FollowView';
import RatingCard from '../Profile/RatingCard';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@expo/vector-icons';
import NewRatingButton from '../Ratings/NewRatingButton';

const api = new RateMyBarApi();

export default function User(props) {
    const {colors} = useTheme();
    const nav = useNavigation();
    const styles = getStyles(colors);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [access, setAccess] = useState(null);
    const [currentUserFollowing, setCurrentUserFollowing] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 5;
    const [noMore, setNoMore] = useState(false);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [showNewRatingButton, setShowNewRatingButton] = useState(true);

    const shouldLoadMore = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    const loadInitial = () => {
        setLoading(true);
        setPage(0);
        api.user.get(props.route.params.userID, props.token.id, props.token.token, props.location.lat, props.location.lng, 0, pageSize)
        .then(response => {
            setAccess(response.access === 1);
            setUserInfo(response.userInfo);
            setReviews(response.reviews);
            setFollowing(response.following);
            setFollowers(response.followers);
            setCurrentUserFollowing(response.currentUserFollowing);
            setProfilePhoto(response.profilePhotoUrl || 'https://www.seekpng.com/png/small/110-1100707_person-avatar-placeholder.png');
            setNoMore(response.reviews.length === 0);
            setLoading(false);
            setRefreshing(false);
        })
    }
    const loadMore = () => {
        if (!loading && !noMore) {
            const newPage = page + 1;
            setLoading(true);
            api.user.get(props.route.params.userID, props.token.id, props.token.token, props.location.lat, props.location.lng, newPage, pageSize)
            .then(response => {
                setReviews([...reviews, ...response.reviews]);
                setPage(newPage);
                setNoMore(response.reviews.length === 0);
                setLoading(false);
            })
        }
    }

    const getFollowButton = () => {
        const obj = {
            text: 'Follow',
            colorScheme: 'primary'
        }
        switch(currentUserFollowing) {
            case 1:
                obj.text = 'Follow requested';
                obj.colorScheme = 'muted';
                break;
            case 2:
                obj.text = 'Unfollow';
                obj.colorScheme = 'danger';
                break;
        }
        return obj;
    }
    const followButtonPress = () => {
        if (currentUserFollowing === 0) {
            followAction();
        } else {
            Alert.alert(
                currentUserFollowing === 1 ? 'Cancel follow request' : 'Unfollow',
                currentUserFollowing === 1 ? 'Are you sure you want to cancel this follow request?' : 'Are you sure you want to unfollow ' + userInfo.name + '?',
                [
                    {
                        text: 'No'
                    },
                    {
                        text: 'Yes',
                        onPress: followAction
                    }
                ]
            )
        }
    }
    const followAction = () => {
        api.user.followAction(props.route.params.userID, props.token.id, props.token.token).then(response => {
            setAccess(response.access === 1);
            setFollowers(response.followers);
            setCurrentUserFollowing(response.currentUserFollowing);
        })
    }

    useEffect(() => {
        if (props.route.params.userID === props.token.id) {
            nav.navigate('Profile');
        } else {
            loadInitial();
        }
    }, [props.route.params.userID]);

    return (
        <View style={{flex: 1, backgroundColor: colors.muted[200]}}>
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
                bg={colors.muted[200]}
                scrollEventThrottle={400}
            >
                <View shadow={0} bg='white' style={{paddingTop: 13, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, marginBottom: 15}}>
                    {userInfo && profilePhoto && followers && following ?
                    <View style={{paddingLeft: 10, paddingRight: 10}}>
                        <HStack space={3} alignItems='center' mb={3}>
                            <Image size={95} resizeMode='cover' borderRadius={100} borderColor={colors.muted[300]} borderWidth={2} key={profilePhoto} source={{uri: profilePhoto}} alt='Profile photo'/>
                            <Box>
                                <Text style={styles.name}>{userInfo.name}</Text>
                                <Text style={styles.school}>{userInfo.school}</Text>
                                <Text style={styles.bio}>{userInfo.bio}</Text>
                            </Box>
                        </HStack>
                        <HStack space={4} alignItems='center'>
                            <FollowView users={followers} title='Followers' goToUser={(userID) => nav.navigate('User', {userID})}/>
                            <FollowView users={following} title='Following' goToUser={(userID) => nav.navigate('User', {userID})}/>
                            <Button size='sm' colorScheme={getFollowButton().colorScheme} onPress={followButtonPress} variant='outline' marginLeft='auto' mt={3}>{getFollowButton().text}</Button>
                        </HStack>
                    </View>
                    :
                    <View style={{paddingLeft: 10, paddingRight: 10}}>
                        <HStack space={3} alignItems='center' marginBottom={4}>
                            <Skeleton variant='circle' h='97px' w='97px' borderRadius={100}/>
                            <Box>
                                <Skeleton w={75} h={3} />
                                <Skeleton w={100} mt={2} height={3} />
                                <Skeleton w={125} mt={2} height={3} />
                            </Box>
                        </HStack>
                        <HStack space={4} alignItems='center' mb={0}>
                            <VStack space={0} mb={1}>
                                <Skeleton w='60px' h={2} />
                                <Skeleton w={7} h={6} mt={1} />
                            </VStack>
                            <VStack space={0} mb={1}>
                                <Skeleton w='60px' h={2} />
                                <Skeleton w={7} h={6} mt={1} />
                            </VStack>
                            <Skeleton ml='auto' w={20} h={9}/>
                        </HStack>
                    </View>
                    }
                </View>
                {access !== false ? 
                <View>
                    {reviews.map((rating, index) => (
                        <RatingCard rating={rating} key={index}
                            token={props.token} openRating={ratingID => nav.navigate('Rating', {
                                ratingID: ratingID,
                                onDeleted: () => {},
                                token: props.token,
                                location: props.location
                            })}
                            openTag={tag => nav.navigate('Tag', {tag})}
                            openUser={userID => nav.navigate('User', {userID})}
                            marginBottom={5}
                        />
                    ))}
                    {loading && <Box p={5}><Spinner/></Box>}
                    {noMore && <Text textAlign='center' color={colors.muted[500]} fontSize={15} mt={0}>All results loaded.</Text>}
                    <Box h={7}></Box>
                </View>
                :
                <Box p={5}><Text textAlign='center' alignItems='center' fontSize={16} color={colors.muted[500]}><MaterialIcons name='lock'/> This user is private.</Text></Box>
                }
            </ScrollView>
            <NewRatingButton show={showNewRatingButton} go={() => nav.navigate('New Rating', {})}/>
        </View>
    )
}

const getStyles = (colors) => {
    return StyleSheet.create({
        name: {
            fontWeight: '600',
            marginTop: 5
        },
        school: {
            color: colors.muted['500']
        },
        bio: {
        }
    })
}