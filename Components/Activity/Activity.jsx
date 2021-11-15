import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, TouchableOpacity, StyleSheet, Alert, RefreshControl} from 'react-native';
import {Box, Text, Button, useTheme, Badge, Pressable, Icon, HStack} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import {MaterialIcons} from '@expo/vector-icons';
import {SwipeListView} from 'react-native-swipe-list-view';
import moment from 'moment';

const api = new RateMyBarApi();

export default function ActivityPane({token, location}) {
    const {colors} = useTheme();
    const [followRequests, setFollowRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    let _swipeList = useRef();
    const _keyExtractor = (item, index) => item.notificationID.toString();
    const nav = useNavigation();

    const updateCount = () => {
        let count = 0;
        notifications.forEach(n => {
            if (n.seen === 0) {
                count += 1;
            }
        })
        count += followRequests.length;
        let newTitle = 'Activity'
        if (count > 0) {
            newTitle = newTitle + ' (' + count + ')';
        }
        nav.setOptions({title: newTitle, headerTitle: 'Activity'});
    }

    const load = () => {
        return new Promise((resolve, reject) => {
        api.activity.get(token.id, token.token).then(response => {
            setFollowRequests(response.followRequests);
            response.notifications.forEach(n => {
                n.disableRightSwipe = true;
            })
            setNotifications(response.notifications);
            updateCount();
            setRefreshing(false);
            resolve(response.followRequests);
        })
        })
    }

    const handleAcceptFollowRequest = (request) => {
        api.activity.approveFollowRequest(request.friendID, token.id, token.token).then(response => {
            setFollowRequests(response.followRequests);
            setNotifications(response.notifications);
            updateCount();
        })
    }
    const handleDeclineFollowRequest = (request) => {
        api.activity.declineFollowRequest(request.friendID, token.id, token.token).then(response => {
            setFollowRequests(response.followRequests);
            setNotifications(response.notifications);
            updateCount();
        })
    }

    const handleNotificationPress = (notification) => {
        api.activity.markNotificationSeen(notification.notificationID, token.id, token.token).then(response => {
            setNotifications(response.notifications);
            updateCount();
        })
        Alert.alert(
            "Notification",
            notification.message,
            [
                {
                    text: 'Dismiss'
                }
            ]
        )
    }
    const handleDeleteNotification = (notification) => {
        api.activity.deleteNotification(notification.notificationID, token.id, token.token).then(response => {
            setNotifications(response.notifications);
            updateCount();
        })
    }

    useEffect(() => {
        const intervalID = setInterval(() => {
            load();
        }, 120000);
        return () => clearInterval(intervalID);
    }, [useState]);

    useEffect(() => {
        const unsubscribe = nav.addListener('focus', () => {
            load();
        });
        return unsubscribe;
    }, [nav]);

    const notificationItem = ({item, index}) => (
        <Box key={item.notificationID} borderBottomColor={colors.muted[200]} borderBottomWidth={1}>
            <Pressable onPress={() => handleNotificationPress(item)}
                bg='white'
                p={5}
            >
                <HStack space={2} alignItems='center'>
                    <MaterialIcons color={colors.primary[500]} name={item.seen ? 'panorama-fish-eye' : 'lens'}/>
                    <Text color={colors.muted[500]}>{moment(item.dateReceived).fromNow().toUpperCase()}</Text>
                </HStack>
                <Text>{item.message}</Text>
            </Pressable>
        </Box>
    )
    const deleteNotificationItem = (data, rowMap) => (
        <HStack flex={1} pl={2} key={data.item.key}>
            <Pressable px={4} bg={colors.muted[400]}
                ml='auto'
                justifyContent='center' onPress={
                    () => {
                    rowMap[data.item.notificationID].closeRow();
                    handleDeleteNotification(data.item);
                }}
                _pressed={{opacity: 0.5}}
            >
                <Icon as={<MaterialIcons name='close'/>} color='white'/>
            </Pressable>
        </HStack>
    )

    return (
        <SafeAreaView>
            <TouchableOpacity style={{backgroundColor: 'white', padding: 20, borderBottomColor: colors.muted[200], borderBottomWidth: 1}} onPress={() => nav.navigate('Follow Requests', {
                    followRequests: followRequests,
                    onAccept: handleAcceptFollowRequest,
                    onDecline: handleDeclineFollowRequest,
                    update: load
                })} >
                <HStack alignItems='center'>
                    <Text fontSize={17} >Follow Requests {followRequests.length > 0 && '(' + followRequests.length + ')'}</Text>
                    <MaterialIcons name='chevron-right' style={{marginLeft: 'auto', fontSize: 20}}/>
                </HStack>
            </TouchableOpacity>
            <SwipeListView 
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
                ref={_swipeList}
                data={notifications}
                showsVerticalScrollIndicator={false}
                style={{marginTop: 10, height: '90%'}}
                renderItem={notificationItem}
                renderHiddenItem={deleteNotificationItem}
                rightOpenValue={-65}  
                closeOnRowOpen={true}
                keyExtractor={_keyExtractor}
            />
        </SafeAreaView>
    )
}