import React, {useState, useEffect, useRef} from 'react';
import {RefreshControl, SafeAreaView} from 'react-native';
import {Text, useTheme, TouchableOpacity, Box, Button, ScrollView, View, Center, Spinner} from 'native-base';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import RatingCard from '../Profile/RatingCard';

const api = new RateMyBarApi();

export default function Following({radius, sortBy, token, location, parentNav, ...props}) {
    const {colors} = useTheme();
    const [ratings, setRatings] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 5;
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [noMore, setNoMore] = useState(false);
    let _scrollView = useRef();

    const shouldLoadMore = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    const loadInitial = () => {
        setLoading(true);
        setPage(0);
        api.feed.getFeed(token.id, token.token, location.lat, location.lng, 'Following', sortBy, radius, 0, pageSize)
        .then(response => {
            setRatings(response.reviews);
            _scrollView.current.scrollTo({y: 0, animated: true});
            setNoMore(response.reviews.length === 0);
            setRefreshing(false);
            setLoading(false);
        })
    }
    const loadMore = () => {
        if (!loading && !noMore) {
            const newPage = page + 1;
            setLoading(true);
            api.feed.getFeed(token.id, token.token, location.lat, location.lng, 'Following', sortBy, radius, newPage, pageSize)
            .then(response => {
                setRatings([...ratings, ...response.reviews]);
                setLoading(false);
                setPage(newPage);
                setNoMore(response.reviews.length === 0);
            })
        }
    }

    useEffect(() => {
        loadInitial();
    }, [radius, sortBy]);

    return (
        <View {...props} style={{backgroundColor: colors.muted[200], height: '100%'}}>
            <ScrollView ref={_scrollView}
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
                showsVerticalScrollIndicator={false}
                style={{backgroundColor: colors.muted[200]}}
                scrollEventThrottle={1000}
            >
                <Box h={3}></Box>
                {ratings.map((rating, index) => (
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
                ))}
                {/* <Text>{JSON.stringify(ratings, null, 2)}</Text> */}
                {/* <Text>{ratings.length}</Text> */}
                {loading && <Spinner/>}
                {noMore && <Text textAlign='center' color={colors.muted[500]} fontSize={15} mt={0}>All results loaded.</Text>}
                <Box h={7}></Box>
            </ScrollView>
        </View>
    )
}