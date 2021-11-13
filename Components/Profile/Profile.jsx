import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, RefreshControl, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {Text, useTheme, Button, ScrollView, Box, View, Skeleton, Spinner, Container, Image, VStack, HStack} from 'native-base';
import FollowView from '../FollowTray/FollowView';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import {default as avatar} from '../../assets/avatar-placeholder.png';
import * as ImagePicker from 'expo-image-picker';
import RatingCard from './RatingCard';

const api = new RateMyBarApi();

export default function Profile(props) {
    const {colors} = useTheme();
    const styles = getStyles(colors);
    let loadMoreRef = useRef();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileInfo, setProfileInfo] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [following, setFollowing] = useState(null);
    const [followers, setFollowers] = useState(null);
    const [editingProfile, setEditingProfile] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [noMore, setNoMore] = useState(false);

    const shouldLoadMore = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    const loadInitial = () => {
        setLoading(true);
        setPage(0);
        api.profile.get(props.token.id, props.token.token, props.location.lat, props.location.lng, 0, pageSize).then(response => {
            setProfileInfo(response.profileInfo);
            setProfilePhoto((response.profilePhotoUrl || 'https://www.seekpng.com/png/small/110-1100707_person-avatar-placeholder.png'));
            setFollowing(response.following);
            setFollowers(response.followers);
            setReviews(response.reviews);
            setNoMore((response.reviews.length === 0));
            setLoading(false);
            setRefreshing(false);
            // props.navigation.setOptions({title: '@' + response.profileInfo.username});
        }).catch(err => alert(JSON.stringify(err, null, 2)))
    }
    const loadMore = () => {
        if (!loading && !noMore) {
            const newPage = page + 1;
            setLoading(true);
            api.profile.get(props.token.id, props.token.token, props.location.lat, props.location.lng, newPage, pageSize).then(response => {
                setReviews([...reviews, ...response.reviews]);
                setPage(newPage);
                setNoMore((response.reviews.length === 0));
                setLoading(false);
            })
        }
    }

    const handleProfilePhotoPress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });
        if (!result.cancelled) {
            const imagePath = result.uri;
            const ext = result.uri.split('.').pop();
            const mime = `image/${ext}`;
            let picture = await fetch(imagePath);
            picture = await picture.blob();
            api.profile.changeProfilePhoto(props.token.id, props.token.token, picture, mime).then((response) => {
                setProfilePhoto(response);
            })
        }
    }

    useEffect(() => {
        loadInitial();
    }, []);

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={
                    () => {
                        setRefreshing(true);
                        loadInitial();
                    }
                }
                tintColor={colors.primary['500']} />
            }
            onScroll={({nativeEvent}) => {
                if (shouldLoadMore(nativeEvent)) {
                    loadMore();
                }
            }}
            showsVerticalScrollIndicator={false}
            style={{paddingLeft: 0, paddingRight: 0, backgroundColor: colors.muted[200]}}
            scrollEventThrottle={400}>
                <View shadow={0} style={{maxWidth: '100%', width: '100%', marginBottom: 15, paddingTop: 13 , backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                    {profileInfo && profilePhoto && followers && following ?
                    <View style={{paddingLeft: 10, paddingRight: 10}}>
                        <HStack space={3} alignItems='center' marginBottom={3}>
                            <TouchableOpacity style={styles.profilePhotoWrapper} onPress={() => handleProfilePhotoPress()}>
                                <Image size={95} resizeMode={'cover'} borderRadius={100} key={profilePhoto} source={{uri: profilePhoto}} alt='Profile photo'/>
                            </TouchableOpacity>
                            <Box>
                                <Text style={styles.name}>{profileInfo.name}</Text>
                                <Text style={styles.school}>{profileInfo.school}</Text>
                                <Text style={styles.bio}>{profileInfo.bio}</Text>
                            </Box>
                        </HStack>
                        <HStack space={4} alignItems='center'>
                            <FollowView users={followers} title='Followers' goToUser={(userID) => props.navigation.navigate('User', {userID: userID})}/>
                            <FollowView users={following} title='Following' goToUser={(userID) => props.navigation.navigate('User', {userID: userID})}/>
                            <Button colorScheme='rmb' size='sm' variant='outline' marginLeft='auto' mt={3}>Edit Profile</Button>
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
                <View style={{paddingLeft: 0, paddingRight: 0}}>
                    {reviews.map((rating, index) => (
                        <RatingCard rating={rating} key={index} 
                            token={props.token} openRating={ratingID => props.navigation.navigate('Rating', {ratingID})} 
                            openTag={tag => props.navigation.navigate('Tag', {tag})}
                            openUser={userID => props.navigation.navigate('User', {userID})}
                            marginBottom={5}/>
                    ))}
                </View>
                <Box p={5} ref={r => loadMoreRef = r}>{loading && <Spinner/>}</Box>
            </ScrollView>
        </SafeAreaView>
    )
}

const getStyles = (colors) => {
    return StyleSheet.create({
        profilePhotoWrapper: {
            borderRadius: 100,
            borderColor: colors.muted['300'],
            borderWidth: 2
        },
        name: {
            fontWeight: '600',
            marginTop: 5
        },
        school: {
            color: colors.muted['500']
        },
        bio: {
        }
    });
}