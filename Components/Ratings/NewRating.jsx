import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Keyboard, Dimensions} from 'react-native';
import {Text, View, Box, Button, Heading, useTheme, HStack, VStack, Input, TextArea, Slider, Wrap, ScrollView, CloseIcon, ArrowBackIcon, Modal, Image} from 'native-base';
import {useNavigation, NavigationContainer} from '@react-navigation/native';
import {MaterialIcons} from '@expo/vector-icons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import NewRatingCategoryRatings from './NewRatingCategoryRatings';
import {ImageBrowser} from 'expo-image-picker-multiple';
import * as ImageManipulator from 'expo-image-manipulator';

const api = new RateMyBarApi();
const vw = Dimensions.get('window').width;

export default function NewRating({token, location, ...props}) {
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
    const [newTag, setNewTag] = useState('');
    const [description, setDescription] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [showPhotoPicker, setShowPhotoPicker] = useState(false);
    const [onSubmitPhotos, setOnSubmitPhotos] = useState(null);
    const [posting, setPosting] = useState(false);
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

    const addTag = () => {
        if (!tags.some(tag => tag === newTag) && newTag.length > 0) {
            let _tags = tags;
            _tags.push(newTag);
            setTags(_tags);
        }
        setNewTag('');
    }
    const removeTag = (tag) => {
        let _tags = tags.filter(t => t !== tag);
        setTags(_tags);
    }

    const photoCallback = (callback) => {
        callback.then(async (photos) => {
            let cPhotos = [];
            for (let photo of photos) {
                const pPhoto = await processImageAsync(photo.uri);
                let blob = await fetch(pPhoto.uri);
                blob = await blob.blob();
                cPhotos.push({
                    uri: pPhoto.uri,
                    name: photo.filename,
                    type: 'image/jpg',
                    blob: blob
                })
            }
            setPhotos(cPhotos);
        })
    }
    const processImageAsync = async (uri) => {
        const file = await ImageManipulator.manipulateAsync(
            uri,
            [{resize: {width: 1000}}],
            {compress: 0.8, format: ImageManipulator.SaveFormat.JPEG}
        );
        return file;
    }

    const postRating = () => {
        setPosting(true);
        api.ratings.postRating(token.id, token.token, selectedBar.placeID, description, categoryRatings, tags, photos)
        .then(response => {
            nav.goBack();
            nav.navigate('Rating', {ratingID: response.review.reviewID});
        })
    }

    useEffect(() => {
        if (props.route.params.barID) {
            api.ratings.getBarByIDForRating(token.id, token.token, props.route.params.barID).then(response => {
                api.ratings.getNewRatingPage(token.id, token.token, location.lat, location.lng, radius).then(response2 => {
                    setRatingCategories(response2.ratingCategories);
                    setSelectedBar(response.selectedBar);
                    setStep('Category ratings');
                })
            })
        } else {
            _inputRef.current?.focus();
            api.ratings.getNewRatingPage(token.id, token.token, location.lat, location.lng, radius).then(response => {
                setRatingCategories(response.ratingCategories);
            })
        }
    }, []);

    return (
        <View height='100%' flex={1}>
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
            <KeyboardAvoidingView h={{base: '400px', lg: 'auto'}} style={{flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundOpacity: 0}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
                <ScrollView >
                    <Box h={2}></Box>
                    <NewRatingCategoryRatings categories={ratingCategories} ratings={categoryRatings} back={() => {
                        setAutocomplete('');
                        setNearbyBars([]);
                        setRadius(20);
                        setCategoryRatings([]);
                        setTags([]);
                        setDescription('');
                        setSelectedBar(null);
                        setStep('Choose bar');
                        setTimeout(() => {_inputRef.current?.focus()},1);
                    }}
                    next={(ratings) => {
                        setCategoryRatings(ratings);
                        setStep('Final step')
                    }}
                    />
                    <Box h={10}></Box>
                </ScrollView>
            </KeyboardAvoidingView>
            }
            {step === 'Final step' && 
            <KeyboardAvoidingView h={{base: '400px', lg: 'auto'}} style={{flex: 1, flexDirection: 'column', justifyContent: 'center', backgroundOpacity: 0}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
                <ScrollView keyboardShouldPersistTaps='handled' >
                    <Box h={2}></Box>
                    <View bg='white' px={5} py={3} shadow={0}>
                        <Text fontSize={18} mb={1} color={colors.muted[500]}>Description</Text>
                        <Text color={colors.muted[500]} mb={1} fontStyle='italic'>Describe your experience at the bar <Text color={colors.danger[500]}>*</Text></Text>
                        <TextArea numberOfLines={4} value={description} onChangeText={text => setDescription(text)}/>
                    </View>
                    <View bg='white' px={5} py={3} mt={2} shadow={0}>
                        <Text fontSize={18} mb={1} color={colors.muted[500]}>Tags</Text>
                        <Text color={colors.muted[500]} mb={1} fontStyle='italic'>Add tags that describe the bar</Text>
                        <Input 
                            fontSize={15} returnKeyType='done' value={newTag} onChangeText={text => setNewTag(text.toLowerCase())} placeholder='Type a tag'
                            onSubmitEditing={addTag} blurOnSubmit={false}
                            InputRightElement={<Button size='lg' rounded='none' onPress={addTag}>Add</Button>}
                        />
                        <Wrap mt={2} direction='row'>
                            {tags.map((tag, index) => (
                                <Button key={index} borderRadius={100} my={1} mr={1} onPress={() => removeTag(tag)}><HStack alignItems='center' space={1}><Text>{tag}</Text><CloseIcon size={2}/></HStack></Button>
                            ))}
                        </Wrap>
                    </View>
                    <View bg='white' px={5} py={3} mt={2} shadow={0}>
                        <Text fontSize={18} mb={1} color={colors.muted[500]}>Photos</Text>
                        <Text color={colors.muted[500]} mb={1} fontStyle='italic'>Add photos from the bar</Text>
                        {photos.length === 0 && 
                        <TouchableOpacity
                            onPress={() => setShowPhotoPicker(true)}
                        >
                            <Box p={5} bg={colors.muted[100]} borderRadius={5}>
                                {photos.length === 0 && <Text textAlign='center' color={colors.muted[500]}>Tap to add photos</Text>}
                            </Box>
                        </TouchableOpacity>
                        }
                        {photos.length > 0 && 
                        <Wrap direction='row'>
                            {photos.map((photo, index) => (
                                <TouchableOpacity key={photo.uri} style={{marginRight: 2, marginTop: 1}}
                                    onPress={() => setPhotos(photos.filter(p => p.uri !== photo.uri))}
                                >
                                    <Image size='md' resizeMode='cover' alt='Photo' borderRadius={5} source={{uri: photo.uri}}/>
                                </TouchableOpacity>
                            ))}
                        </Wrap>
                        }
                    </View>
                    <View bg='white' px={5} py={3} mt={2} shadow={0} flexDirection='row' justifyContent='space-between'>
                            <Button size='lg' borderRadius={100} onPress={() => {
                                setStep('Category ratings');
                            }}
                            isDisabled={posting}
                            >
                                <HStack alignItems='center' space={1}>
                                    <ArrowBackIcon size={5}/>
                                    <Text>Back</Text>
                                </HStack>
                            </Button>
                            <Button size='lg' borderRadius={100} isDisabled={!description || description.length < 1 || posting} 
                            loading={posting}
                            onPress={() => postRating()}
                            >
                                <HStack alignItems='center' space={1}>
                                    <Text>Post rating</Text>
                                    <MaterialIcons name='check' size={20}/>
                                </HStack>
                            </Button>
                    </View>
                    <Box h={10}></Box>
                </ScrollView>
            </KeyboardAvoidingView>
            }
            <Modal isOpen={showPhotoPicker}
            size='full' 
                onClose={() => {
                    setShowPhotoPicker(false);
                    setPhotos([]);
                    setOnSubmitPhotos(null);
                }}
            >
                    <Modal.Content>
                        <Modal.CloseButton/>
                        <Modal.Header>Choose photos</Modal.Header>
                        <Modal.Body p={0} flex={1} position='relative'>
                            <ImageBrowser
                                max={10}
                                onChange={async (num, onSubmit) => {
                                    if (num > 0) {
                                        setOnSubmitPhotos(onSubmit);
                                    } else {
                                        setOnSubmitPhotos(null);
                                    }
                                }}
                                callback={photoCallback}
                                renderSelectedComponent={(num) => (
                                    <View style={{
                                        paddingHorizontal: 8.6,
                                        paddingVertical: 5,
                                        borderRadius: 50,
                                        position: 'absolute',
                                        right: 3,
                                        bottom: 3,
                                        justifyContent: 'center',
                                        backgroundColor: '#0580FF'
                                    }}>
                                        <Text style={{
                                            fontWeight: 'bold',
                                            alignSelf: 'center',
                                            padding: 'auto',
                                            color: '#ffffff'
                                        }}>{num}</Text>
                                    </View>
                                )}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button isDisabled={onSubmitPhotos === null} borderRadius={100} onPress={(e) => {
                                () => onSubmitPhotos;
                                setShowPhotoPicker(false);
                                setOnSubmitPhotos(null);
                            }}>Add photos</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
        </View>
    )
}