import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, TouchableOpacity, View, Platform, Dimensions, Alert} from 'react-native';
import {Text, useTheme, Heading, Button, Box, Image, 
    HStack, VStack, Wrap, ScrollView, Actionsheet, useDisclose, 
    Pressable, IconButton, Icon,
    Input, KeyboardAvoidingView, Modal} from 'native-base';
import BeerRating from '../Ratings/BeerRating';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel';
import CategoryRatings from '../Ratings/CategoryRatings';
import moment from 'moment';
import {RateMyBarApi} from '../../Api/RateMyBarApi';
import {SwipeListView} from 'react-native-swipe-list-view';
import {MaterialIcons} from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const api = new RateMyBarApi();

export default function RatingCard({rating, token, handleDelete, openUser, openRating, openTag, ratingLink, ...props}) {
    const {colors} = useTheme();
    const [comments, setComments] = useState([]);
    const styles = getStyles(colors);
    const {isOpen, onOpen, onClose} = useDisclose();
    const [newComment, setNewComment] = useState('');
    const [showCommentModal, setShowCommentModal] = useState(false);
    const newCommentInputRef = useRef();
    const [postingComment, setPostingComment] = useState(false);
    const [loading, setLoading] = useState(props.loading || false);
    const nav = useNavigation();
    const _keyExtractor = (item, index) => item.commentID.toString();

    useEffect(() => {
        setLoading(props.loading);
        if (!props.loading) {
            rating.comments.forEach((c => {
                c.disableRightSwipe = true;
                if (c.userID !== token.id && rating.reviewerID !== token.id) {
                    c.disableLeftSwipe = true;
                }
            }))
            setComments(rating.comments);
        }
    }, [props.loading, rating]);

    useEffect(() => {
        setNewComment('');
    }, [showCommentModal]);

    const handleOpenRating = () => {
        openRating(rating.reviewID);
    }

    const postNewComment = () => {
        setPostingComment(true);
        api.ratings.postComment(token.id, token.token, rating.reviewID, newComment).then((response) => {
            setComments(response.comments);
            setPostingComment(false);
            setShowCommentModal(false);
        })
    };

    const handleDeleteComment = (comment) => {
        Alert.alert(
            "Are you sure?",
            "Are you sure you want to delete this comment?",
            [
                {
                    text: "Cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        api.ratings.deleteComment(token.id, token.token, rating.reviewID, comment.commentID).then((response) => setComments(response.comments));
                    }
                }
            ]
        )
    }

    const commentItem = ({item, index}) => (
        <Box key={item.commentID}>
        <Actionsheet.Item onPress={() => {
            onClose();
            openUser(item.userID);
            }}
             bg={colors.muted[50]}
            borderRadius={0}
            borderBottomColor={colors.muted[50]}
            borderBottomWidth={1}
            underlayColor={'#AAA'}
        >
            <HStack alignItems='flex-start' w='100%' >
                <Box>
                    <Text fontWeight='bold'>{item.name}</Text>
                    <Text color={colors.muted[600]}>{item.comment}</Text>
                </Box>
                <Text ml='auto' color={colors.muted[600]}>{moment(item.datePosted).fromNow()}</Text>
            </HStack>
        </Actionsheet.Item>
        </Box>
    );
    const deleteCommentItem = (data, rowMap) => (
        <HStack flex={1} pl={2} key={data.item.key}>
        <Pressable px={4} bg={colors.red[500]}
            ml='auto'
            justifyContent='center' onPress={() => {
                rowMap[data.item.commentID].closeRow();
                handleDeleteComment(data.item);
            }}
            _pressed={{opacity: 0.5}}>
            <Icon as={<MaterialIcons name='delete'/>} color='white'/>
        </Pressable>
        </HStack>
    )

    return (
        <>
        {!loading ?
        <Box bg={'white'} shadow={0} py={4} style={styles.card} {...props}>
            <Box px={5}>
                <Pressable 
                    onPress={ratingLink === false ? 
                    () => nav.navigate('Bar', {barID: rating.barID})
                    : 
                    handleOpenRating
                }>
                    <HStack maxWidth='100%' alignItems='flex-start'>
                        <VStack maxWidth='80%'>
                            <Heading fontSize={17}>{rating.name}</Heading>
                            <Text mb={1} color={colors.muted[500]}>{rating.address}</Text>
                            <BeerRating mb={3} rating={rating.overallRating}/>
                        </VStack>
                        {rating.distance &&
                        <Text ml='auto' fontSize={30} fontWeight={300} color={colors.muted[400]}>{parseInt(rating.distance)}<Text fontSize={15} fontWeight={400} color={colors.muted[400]}>mi</Text></Text>
                        }
                        {!rating.user && <Text ml='auto' color={colors.muted[500]}>{moment(rating.dateReviewed).fromNow()}</Text>}
                </HStack>
                </Pressable>
                {!(props.showUser === false) && rating.user &&
                <Pressable onPress={() => openUser(rating.reviewerID)}>
                    <HStack alignItems='flex-start' mt={1} mb={1}>
                        <Text fontWeight="bold" fontSize={15} color={colors.muted[500]}>{rating.user.name}</Text>
                        <Text ml='auto' color={colors.muted[500]}>{moment(rating.dateReviewed).fromNow()}</Text>
                    </HStack>
                </Pressable>
                }
                <Pressable
                    disabled={ratingLink === false} onPress={handleOpenRating}
                >
                <Text mb={0} fontStyle='italic'>"{rating.description}"</Text>
                </Pressable>
            </Box>
            {rating.reviewPhotos.length > 0 && <PhotoCarousel mt={3} data={rating.reviewPhotos} />}
            <Box px={5}>
                <Pressable disabled={ratingLink === false} onPress={handleOpenRating}>
                    <CategoryRatings mt={3} mb={2} categoryRatings={rating.categoryRatings}/>
                </Pressable>
                <Wrap direction="row">
                    {rating.tags.map((tag, index) => (
                        <Button key={index} style={styles.tag} my={1} mr={2} onPress={() => openTag(tag.tag)}>{tag.tag}</Button>
                    ))}
                </Wrap>
                <Pressable style={{marginTop: 20, marginLeft: 5}} onPress={onOpen}>
                    <Text ml='auto' fontSize={15} color={colors.muted[500]}>{comments.length} comment{comments.length !== 1 && 's'}</Text>
                </Pressable>
            </Box>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content style={{minHeight: 500}}>
                        {comments.length === 0 && <Box mx='auto' mt={3} mb='auto'>
                            <Text color={colors.muted[700]}>No comments yet...</Text>
                        </Box>}
                        <SwipeListView data={comments}
                            renderItem={commentItem}
                            renderHiddenItem={deleteCommentItem}
                            rightOpenValue={-65}
                            closeOnRowOpen={true}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={_keyExtractor}
                        />
                        {/* {comments.map((comment, index) => (
                            <Actionsheet.Item key={index} onPress={() => {onClose();openUser(comment.userID)}}>
                                <HStack alignItems='flex-start' w='100%' >
                                    <Box>
                                        <Text fontWeight='bold'>{comment.name}</Text>
                                        <Text color={colors.muted[600]}>{comment.comment}</Text>
                                    </Box>
                                    <Text ml='auto' color={colors.muted[600]}>{moment(comment.datePosted).fromNow()}</Text>
                                </HStack>
                            </Actionsheet.Item>
                        ))} */}
                    <Actionsheet.Item justifyContent='center' onPress={() => setShowCommentModal(true)}>
                        <Text fontSize={17} mt='auto' color={colors.muted[700]}>Add a comment</Text>
                    </Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
            <Modal isCentered
                isOpen={showCommentModal}
                onClose={setShowCommentModal}
                initialFocusRef={newCommentInputRef}>
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>Add a comment</Modal.Header>
                    <Modal.Body>
                        <Input ref={newCommentInputRef} isDisabled={postingComment} size='xl' value={newComment} onChangeText={text => setNewComment(text)}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button size='lg' isLoading={postingComment} isDisabled={newComment.length === 0 || postingComment} onPress={() => {postNewComment()}}>Post comment</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Box>
        :
        <></>
        }
        </>
    )
}

const getStyles = (colors) => {
    return StyleSheet.create({
        card: {
        },
        slide: {

        },
        tag: {
            borderRadius: 25
        }
    })
}