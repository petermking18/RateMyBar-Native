import React, {useState, useEffect} from 'react';
import {RefreshControl, SafeAreaView, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text, Button, View, useTheme, ScrollView, Box, Skeleton, Icon, Pressable, HStack} from 'native-base';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import RatingMenu from './RatingMenu';
import RatingCard from '../Profile/RatingCard';
import {SwipeListView} from 'react-native-swipe-list-view';
import {MaterialIcons} from '@expo/vector-icons';
import moment from 'moment';

const api = new RateMyBarApi();

export default function Rating(props) {
    const {colors} = useTheme();
    const nav = useNavigation();
    const ratingID = props.route.params.ratingID;
    const [rating, setRating] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const handleDelete = () => {
        Alert.alert(
            "Are you sure?",
            "Are you sure you want to delete this rating?",
            [
                {
                    text: "Cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        api.profile.deleteRating(props.token.id, props.token.token, ratingID, props.location.lat, props.location.lng, 0, 0)
                        .then(response => {
                            if (props.route.params.onDeleted) {
                                props.route.params.onDeleted(ratingID);
                            }
                            setError('Rating deleted.');
                            navigation.goBack();
                        })
                    }
                }
            ]
        )
    }

    const loadRating = () => {
        api.ratings.getRatingPage(props.token.id, props.token.token, ratingID, props.location.lat, props.location.lng)
        .then(response => {
            if (response.error) {
                setError(response.error);
            } else {
                setRating(response.review);
                if (response.review.reviewerID === props.token.id) {
                    nav.setOptions({
                        headerRight: () => 
                        <RatingMenu onDelete={handleDelete}/>
                    })
                }
            }
            setRefreshing(false);
            setLoading(false);
        })
    }

    useEffect(() => {
        loadRating();
    }, []);

    return (
        <View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={
                            () => {
                                setRefreshing(true);
                                loadRating();
                            }
                        }
                        tintColor={colors.primary[500]}
                    />
                }
                h='100%'
            >
                {!loading ?
                !error ?
                <RatingCard rating={rating} token={props.token} 
                    openTag={(tag) => nav.navigate('Tag', {tag})}
                    openUser={userID => nav.navigate('User', {userID})}
                    loading={loading} ratingLink={false}
                />
                :
                <Box p={10}><Text color={colors.muted[500]} textAlign='center'>{error}</Text></Box>
                :
                <Box p={5} bg='white'>
                    <Skeleton w={150} h={5} mb={1}/>
                    <Skeleton w={175} h={5} mb={1}/>
                    <Skeleton w={200} h={5} mb={1}/>
                    <Skeleton w={215} h={5} mb={1}/>
                </Box>
                }
                <Box h={10}></Box>
            </ScrollView>
        </View>
    )
}

const getStyles = (colors) => {
    return StyleSheet.create({

    })
}