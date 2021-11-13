import React, {Component} from 'react';
import {Text, Dimensions, StyleSheet} from 'react-native';
import {useTheme, View, Image} from 'native-base';
import Carousel from 'react-native-snap-carousel';
import {scrollInterpolator, animatedStyles} from './Utils/animations';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3/4);

export default class PhotoCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }
        this._renderItem = this._renderItem.bind(this);
    }

    _renderItem({item}) {
        return (
            <View p={0} style={styles.itemContainer}>
                <Image size='100%' source={{uri: item}} alt='Photo'/>
            </View>
        );
    }

    render() {
        return (
            <View>
                <Carousel
                    ref={(c) => this.carousel = c}
                    data={this.props.data}
                    renderItem={this._renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    containerCustomStyle={styles.carouselContainer}
                    inactiveSlideShift={0}
                    onSnapToItem={(index) => this.setState({index})}
                    scrollInterpolator={scrollInterpolator}
                    slideInterpolatedStyle={animatedStyles}
                    useScrollView={true}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    carouselContainer: {
      },
      itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgray'
      },
      itemLabel: {
        color: 'white',
        fontSize: 24
      }
})