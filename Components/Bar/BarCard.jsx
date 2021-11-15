import React, {useState, useEffect} from 'react';
import {Text, useTheme, Heading, Button, Box, HStack, VStack, Wrap, openTag, Pressable, Icon} from 'native-base';
import BeerRating from '../Ratings/BeerRating';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel';
import BarCategoryRatings from '../Bar/BarCategoryRatings';
import {useNavigation} from '@react-navigation/native';
// import Constants from 'expo-constants';

export default function BarCard({bar, openBar, openTag, ...props}) {
    const {colors} = useTheme();
    const nav = useNavigation();

    useEffect(() => {
    }, []);

    return (
        <Box bg='white' shadow={0} py={4} {...props}>
            <Box px={5}>
                <Pressable
                    onPress={() => openBar(bar.barID)}
                >
                    <HStack maxWidth='100%' alignItems='flex-start'>
                        <VStack maxWidth='80%'>
                            <Heading fontSize={17}>{bar.name}</Heading>
                            <Text mb={1} color={colors.muted[500]}>{bar.address}</Text>
                            <BeerRating rating={bar.averageRating}/>
                        </VStack>
                        <Text ml='auto' fontSize={30} fontWeight={300} color={colors.muted[400]}>{parseInt(bar.distance)}<Text fontSize={15} fontWeight={400} color={colors.muted[400]}>mi</Text></Text>
                    </HStack>
                </Pressable>
            </Box>
            {bar.reviewPhotos.length > 0 && <PhotoCarousel mt={3} data={bar.reviewPhotos}/>}
            <Pressable px={5} onPress={() => openBar(bar.barID)}>
                <BarCategoryRatings mt={3} mb={2} categoryRatings={bar.avgCategoryRatings}/>
            </Pressable>
            <Wrap direction='row' px={5}>
                {bar.tags.map((tag, index) => (
                    <Button key={index} borderRadius={25} my={1} mr={2} onPress={() => openTag(tag.tag)}>{tag.tag}</Button>
                ))}
            </Wrap>
            {bar.numRatings === 0 && 
                <Pressable onPress={() => openBar(bar.barID)}>
                <Text mt={2} color={colors.muted[500]} textAlign='center'>This bar hasn't been rated yet.</Text>
                </Pressable>
            }
        </Box>
    )
}