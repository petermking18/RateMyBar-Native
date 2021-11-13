import React, {useState, useEffect, useRef} from 'react';
import {RefreshControl, SafeAreaView} from 'react-native';
import {Text, useTheme, TouchableOpacity, Box, Button, ScrollView, View, Center, Spinner} from 'native-base';
import {RateMyBarApi} from '../../Api/RateMyBarApi';

const api = new RateMyBarApi();

export default function Nearby({radius, sortBy, token, location, ...props}) {
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
        _scrollView.current.scrollTo({y: 0, animated: true});
        setLoading(true);
        setPage(0);
        api.feed.getFeed(token.id, token.token, location.lat, location.lng, 'Nearby', sortBy, radius, 0, pageSize)
        .then(response => {
            setRatings(response.reviews);
            setLoading(false);
            setNoMore(response.reviews.length === 0);
            setRefreshing(false);
            // _scrollView.current?.scrollTo({y: 0, animated: true})
        })
    }
    const loadMore = () => {
        if (!loading && !noMore) {
            const newPage = page + 1;
            setLoading(true);
            api.feed.getFeed(token.id, token.token, location.lat, location.lng, 'Nearby', sortBy, radius, newPage, pageSize)
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
        <SafeAreaView {...props} style={{backgroundColor: colors.muted[200]}}>
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
                    if(shouldLoadMore(nativeEvent)) {
                        loadMore();
                    }
                }}
                showsVerticalScrollIndicator={false}
                style={{backgroundColor: colors.muted[200]}}
                scrollEventThrottle={1000}
            >
                <Text>{JSON.stringify(ratings, null, 2)}</Text>
                <Text>{ratings.length}</Text>
                {loading && <Spinner/>}
                {noMore && <Text textAlign='center' color={colors.muted[500]} fontSize={15} mt={5}>All results loaded.</Text>}
            </ScrollView>
        </SafeAreaView>
    )
}