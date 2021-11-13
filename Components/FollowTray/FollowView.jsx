import React, {useState, useEffect} from 'react';
import {Button, Actionsheet, Text, useTheme, VStack, HStack, useDisclose, Image, ScrollView} from 'native-base';
import {default as avatar} from '../../assets/avatar-placeholder.png';
import {TouchableOpacity, StyleSheet} from 'react-native';

export default function FollowView({users, title, goToUser}) {
    const {isOpen, onOpen, onClose} = useDisclose();
    const {colors} = useTheme();
    const styles = getStyles(colors);
    return (
        <>
        <TouchableOpacity onPress={onOpen}>
            <VStack space={0}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.count}>{users.length}</Text>
            </VStack>
        </TouchableOpacity>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
                <ScrollView w='100%' showsVerticalScrollIndicator={false}>
                {users.map((user, index) => (
                    <Actionsheet.Item key={index} onPress={() => {
                        onClose();
                        goToUser(user.userID);
                        }}>
                        <HStack space={3} alignItems='center'>
                            <Image size='xs' resizeMode='cover' borderColor={colors.muted['300']} borderWidth='2' borderRadius={100} key={user.profilePhotoUrl} source={{uri: (user.profilePhotoUrl || 'https://www.seekpng.com/png/small/110-1100707_person-avatar-placeholder.png')}} alt='User'/>
                            <VStack space={0}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.username}>@{user.username}</Text>
                            </VStack>
                        </HStack>
                    </Actionsheet.Item>
                ))}
                </ScrollView>
            </Actionsheet.Content>
        </Actionsheet>
        </>
    )
}

const getStyles = (colors) => {
    return StyleSheet.create({
        titleText: {
            fontSize: 13,
            fontWeight: '500',
            color: colors.muted['500']
        },
        count: {
            fontSize: 30,
            color: colors.primary['500'],
            lineHeight: 30,
        },
        name: {
            fontSize: 20,
            fontWeight: '600'
        },
        username: {
            fontSize: 15,
            color: colors.muted['500']
        }
    })
}