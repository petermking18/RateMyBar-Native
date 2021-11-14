import React, {useState, useEffect} from 'react';
import {SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {Box, Image, Text, useTheme, HStack, VStack, ScrollView} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

export default function FollowRequests(props) {
    const {colors} = useTheme();
    const [followRequests, setFollowRequests] = useState(props.route.params.followRequests);

    useEffect(() => {
        setFollowRequests(props.route.params.followRequests);
    }, [props.route.params.followRequests])

    const handlePress = (request) => {
        Alert.alert(
            "Follow request",
            `${request.name} has requested to follow you`,
            [
                {
                    text: "Decline",
                    onPress: () => {
                        props.route.params.onDecline(request);
                        setFollowRequests(followRequests.filter(fr => fr.friendID !== request.friendID));
                    }
                },
                {
                    text: "Accept",
                    onPress: () => {
                        props.route.params.onAccept(request);
                        setFollowRequests(followRequests.filter(fr => fr.friendID !== request.friendID));
                    }
                },
                {
                    text: "Dismiss"
                }
            ]
        )
    }

    return (
        <SafeAreaView>
            <ScrollView h='100%'>
                {followRequests.map((request, index) => (
                    <TouchableOpacity style={{padding: 15, backgroundColor: 'white', borderBottomColor: colors.muted[200], borderBottomWidth: 1}}
                        key={index}
                        onPress={() => handlePress(request)}
                    >
                        <HStack space={3} alignItems='center'>
                            <Image size='sm' resizeMode='cover' key={request.profilePhotoUrl} borderRadius={100} source={{uri: request.profilePhotoUrl}} alt='Profile photo'/>
                            <VStack>
                                <Text fontWeight='bold' fontSize={17}>{request.name}</Text>
                                <Text color={colors.muted[500]} fontSize={17}>@{request.username}</Text>
                            </VStack>
                            <Text color={colors.muted[500]} ml='auto' fontSize={17}>{moment(request.dateRequested).fromNow()}</Text>
                        </HStack>
                        {/* <Text>{JSON.stringify(request, null, 2)}</Text> */}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}