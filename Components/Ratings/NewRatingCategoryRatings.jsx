import React, {useState, useEffect} from 'react';
import {View, Text, Slider, Button, Box, useTheme, Select, HStack, VStack, Wrap, CloseIcon, ArrowForwardIcon, ArrowBackIcon} from 'native-base';
import {MaterialIcons} from '@expo/vector-icons';
import { back } from 'react-native/Libraries/Animated/Easing';

export default function NewRatingCategoryRatings({categories, ratings, back}) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [unselectedCategories, setUnselectedCategories] = useState([]);
    const {colors} = useTheme();

    useEffect(() => {
        if(ratings) {

        } else {
            categories.forEach((category) => {
                category.comment = '';
            });
            setSelectedCategories(categories.filter((category) => category.required === 1));
            setUnselectedCategories(categories.filter((category) => category.required === 0));
        }
    }, []);
    const selectCategory = (category) => {
        setSelectedCategories([...selectedCategories, category]);
        setUnselectedCategories(unselectedCategories.filter(c => c !== category));
    }
    const unselectCategory = (category) => {
        if(category.required === 1) return;
        setUnselectedCategories([...unselectedCategories, category]);
        setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
    const handleRatingChange = (category, value) => {
        let categories = JSON.parse(JSON.stringify(selectedCategories));
        let index = 0;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].ratingCategoryID === category.ratingCategoryID) {
                index = i;
            }
        }
        // let index = categories.indexOf(c => c.ratingCategoryID === category.ratingCategoryID);
        categories[index].rating = parseInt(value);
        setSelectedCategories(categories);
    }
    const handleCommentChange = (category, value) => {
        let categories = selectedCategories;
        let index = categories.indexOf(category);
        categories[index].comment = value;
        setSelectedCategories(categories);
    }
    const nextDisabled = () => {
        return selectedCategories.some(c => !c.rating);
    }

    return (
        <View bg='white' shadow={0}>
            {selectedCategories.map((category, index) => (
                <Box key={index} px={5} pt={3}>
                    <HStack alignItems='flex-start'>
                        <VStack w='75%'>
                            <Text color={colors.muted[500]} fontSize={18}>{category.name}</Text>
                            <Text color={colors.muted[500]} fontStyle='italic'>{category.description}</Text>
                        </VStack>
                        {category.required === 0 && <Button ml='auto' variant='ghost' size='lg' onPress={() => unselectCategory(category)}><CloseIcon size={3}/></Button>}
                    </HStack>
                    <Select
                        accessibilityLabel={category.name + ' rating'}
                        defaultValue='Choose one'
                        selectedValue={category.rating}
                        fontSize={15}
                        mt={1}
                        p={3}
                        onValueChange={v => handleRatingChange(category, v)}
                    >
                        <Select.Item label={category.levelOne} value={1}/>
                        <Select.Item label={category.levelTwo} value={2}/>
                        <Select.Item label={category.levelThree} value={3}/>
                        <Select.Item label={category.levelFour} value={4}/>
                        <Select.Item label={category.levelFive} value={5}/>
                    </Select>
                </Box>
            ))}
            {unselectedCategories.length > 0 &&
                <>
                <Text px={5} pt={3} fontSize={18} mb={1} color={colors.muted[500]}>Add a category</Text>
                <Wrap px={5} direction='row' pb={5}>
                    {unselectedCategories.map((category, index) => (
                        <Button key={index} borderRadius={100} my={1} mr={2} onPress={() => selectCategory(category)}><HStack alignItems='center' space={0}><MaterialIcons size={20} name='add'/><Text>{category.name}</Text></HStack></Button>
                    ))}
                </Wrap>
                </>
            }
            <Box p={5} flexDirection='row' justifyContent='space-between'>
                <Button size='lg' style={{borderRadius: 100}}
                    onPress={() => back()}
                >
                    <HStack alignItems='center' space={1}>
                        <ArrowBackIcon size={5}/>
                        <Text>Back</Text>
                    </HStack>
                </Button>
                <Button size='lg' isDisabled={selectedCategories.some(c => !c.rating)} style={{borderRadius: 100}}>
                    <HStack alignItems='center' space={1}>
                        <Text>Next</Text>
                        <ArrowForwardIcon size={5}/>
                    </HStack>
                </Button>
            </Box>
            <Box h={5}></Box>
            {/* <Text>{JSON.stringify(selectedCategories, null, 2)}</Text> */}
        </View>
    )
}