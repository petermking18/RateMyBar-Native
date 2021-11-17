import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {Text, View, Box, Button, Heading, useTheme, HStack, VStack, Input, Slider, ScrollView} from 'native-base';
import {useNavigation, NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import NewRatingCategoryRatings from './NewRatingCategoryRatings';

const api = new RateMyBarApi();

export default function NewRating({token, location}) {
    const {colors} = useTheme();
    const [step, setStep] = useState('Choose bar')
    const [nearbyBars, setNearbyBars] = useState([]);
    const [radius, setRadius] = useState(20);
    const [autocompleteSessionToken, setAutocompleteSessionToken] = useState(null);
    const [autocomplete, setAutocomplete] = useState('');
    const [selectedBar, setSelectedBar] = useState(null);
    const [ratingCategories, setRatingCategories] = useState([]);
    const [categoryRatings, setCategoryRatings] = useState([]);
    const [tags, setTags] = useState([]);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const _inputRef = useRef();

    const handleAutocomplete = (newVal) => {
        setAutocomplete(newVal);
        if (newVal.length > 2) {
            api.bars.newRatingAutocomplete(autocomplete, location.lat, location.lng, radius, token.id, token.token, autocompleteSessionToken)
            .then(response => {
                setNearbyBars(response.nearbyBars);
            });
        } else {
            setNearbyBars([]);
        }
    }

    useEffect(() => {
        _inputRef.current?.focus();
        api.ratings.getNewRatingPage(token.id, token.token, location.lat, location.lng, radius).then(response => {
            setRatingCategories(response.ratingCategories);
        })
    }, []);

    return (
        <View height='100%'>
            {selectedBar &&
                <Box p={5} bg='white' borderBottomColor={colors.muted[300]} borderBottomWidth={1}>
                    <Heading size='lg'>{selectedBar.name}</Heading>
                    <Heading size='md' color={colors.muted[500]}>{selectedBar.address}</Heading>
                </Box>
            }
            {step === 'Choose bar' &&
            <View my={selectedBar ? 5 : 0} h='100%' flex={1}>
                <Box flexDirection='row' justifyContent='space-between' bg='white' alignItems='center' p={5}>
                    <Text w='50%' color={colors.muted[500]} >Distance ({Math.floor(radius)} mile{Math.floor(radius) !== 1 && 's'})</Text>
                    <Slider
                            width='50%'
                            size='lg'
                            defaultValue={radius}
                            onChange={v => setRadius(v)}
                            onChangeEnd={() => handleAutocomplete(autocomplete)}
                            colorScheme='rmb'
                        >
                            <Slider.Track bg='lightgray'>
                                <Slider.FilledTrack/>
                            </Slider.Track>
                            <Slider.Thumb/>
                        </Slider>
                </Box>
                <Input ref={_inputRef} placeholder='Search...' p={5} style={{borderColor: colors.muted[300], borderTopWidth: 1, borderBottomWidth: 1}}
                    size='lg' bg='white' value={autocomplete} onChangeText={v => handleAutocomplete(v)}/>
                {autocomplete.length <=2 && <Text py={5} color={colors.muted[500]} textAlign="center" fontSize={18}>Choose a bar</Text>}
                <ScrollView pt={2}
                    keyboardShouldPersistTaps='always'
                >
                {nearbyBars.map((bar, index) => (
                    <TouchableOpacity
                        onPress={() => {
                            if (bar.barID) {
                                setSelectedBar(bar);
                            } else {
                                api.bars.addFoundBar(bar.name, bar.address, bar.placeID, token.id, token.token).then(result => {
                                    setSelectedBar(bar);
                                })
                            }
                            setStep('Category ratings');
                        }}
                        key={index}
                    >
                        <Box flexDirection='row' alignItems='flex-start' justifyContent='space-between'
                            p={5} borderBottomWidth={1} borderBottomColor={colors.muted[200]} bg='white'
                        >
                            <VStack w='75%'>
                                <Heading size='md'>{bar.name}</Heading>
                                <Heading size='sm' fontWeight='normal' color={colors.muted[500]}>{bar.address}</Heading>
                            </VStack>
                            <Heading size='sm' fontWeight='normal' color={colors.muted[500]} ml='auto' pl={5}>{parseInt(bar.distance)} MILE{parseInt(bar.distance) !== 1 && 'S'}</Heading>
                        </Box>
                    </TouchableOpacity>
                ))}
                <Box h={16}></Box> 
                </ScrollView>
            </View>
            }
            {step === 'Category ratings' &&
            <View flex={1}>
                <ScrollView pt={2}>
                    <NewRatingCategoryRatings categories={ratingCategories} back={() => {
                        setAutocomplete('');
                        setNearbyBars([]);
                        setRadius(20);
                        setCategoryRatings([]);
                        setTags([]);
                        setDescription('');
                        setSelectedBar(null);
                        setStep('Choose bar');
                        setTimeout(() => {_inputRef.current?.focus()},1);
                    }}/>
                </ScrollView>
                <Box h={10}></Box>
                {/* <Text>Category ratings</Text> */}
                {/* <Button onPress={() => {
                    setSelectedBar(null);
                    setNearbyBars([]);
                    setAutocomplete('');
                    setStep('Choose bar');
                }}
                >Back</Button> */}
            </View>
            }
        </View>
    )
}