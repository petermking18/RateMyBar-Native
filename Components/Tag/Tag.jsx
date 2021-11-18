import React, {useState, useEffect} from 'react';
import {SafeAreaView, RefreshControl, TouchableOpacity} from 'react-native';
import {Text, Button, useTheme, Pressable, ScrollView, View, Box, Badge, Heading, HStack, VStack, Spinner} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import { RateMyBarApi } from '../../Api/RateMyBarApi';
import BeerRating from '../Ratings/BeerRating';
import BarCategoryRatings from '../Bar/BarCategoryRatings';

const api = new RateMyBarApi();

export default function Tag(props) {
    const nav = useNavigation();
    const {colors} = useTheme();
    const [bars, setBars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [noMore, setNoMore] = useState(false);
    const pageSize = 20;

    const shouldLoadMore = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    const loadInitial = () => {
        setLoading(true);
        setPage(0);
        api.bars.getTagPage(props.token.id, props.token.token, props.route.params.tag, props.location.lat, props.location.lng, 'Most popular', 0, pageSize)
        .then(response => {
            setBars(response.bars);
            setLoading(false);
            setRefreshing(false);
            setNoMore(response.bars.length === 0);
        })
    }
    const loadMore = () => {
        if (!loading && !noMore) {
            const newPage = page + 1;
            setLoading(true);
            api.bars.getTagPage(props.token.id, props.token.token, props.route.params.tag, props.location.lat, props.location.lng, 'Most popular', newPage, pageSize)
            .then(response => {
                setBars([...bars, ...response.bars]);
                setLoading(false);
                setNoMore(response.bars.length === 0);
                setPage(newPage);
            })
        }
    }

    useEffect(() => {
        loadInitial();
    }, []);

    return (
        <View flex={1}>
            <Box bg='white' p={2} flexDirection='row' justifyContent='center' shadow={0}>
                <Badge colorScheme='rmb' px={2} borderRadius={100}><Text fontSize={20}>{props.route.params.tag}</Text></Badge>
            </Box>
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
                showsVerticalScrollIndicator={false}
            >
                <Box h={3}></Box>
                {bars.length > 0 && bars.map((bar, index) => (
                    <Box key={bar.barID} mb={3} bg='white' shadow={0}>
                        <Pressable p={5} onPress={() => nav.navigate('Bar', {barID: bar.barID})}>
                            <HStack justifyContent='space-between' alignItems='center' mb={3}>
                                <VStack w='60%'>
                                    <Heading>{bar.name}</Heading>
                                    <Heading size='sm' fontWeight='normal' color={colors.muted[500]}>{parseInt(bar.distance)} mile{parseInt(bar.distance) !== 1 && 's'} away</Heading>
                                </VStack>
                                <BeerRating rating={bar.avgRating}/>
                            </HStack>
                            <BarCategoryRatings categoryRatings={bar.avgCategoryRatings}/>
                        </Pressable>
                    </Box>
                ))}
                {bars.length === 0 && <Text textAlign="center" color={colors.muted[500]}>No bars have this tag yet</Text>}
                {loading && <Spinner/>}
                {noMore && <Text textAlign='center' color={colors.muted[500]} fontSize={15} mt={0}>All results loaded.</Text>}
                <Box h={10}></Box>
            </ScrollView>
        </View>
    )
}